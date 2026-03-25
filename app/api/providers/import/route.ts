import { NextRequest, NextResponse } from 'next/server';
import { logAuditEvent } from '@/lib/audit';

// Increase body size limit for large CSV files (8000+ providers)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};
import {
  createImportSession,
  updateImportSession,
  calculateImportImpact,
  ImportChange,
} from '@/lib/import-session';
import providersData from '@/data/arizona-providers.json';
import fs from 'fs';
import path from 'path';

interface ImportRow {
  npi: string;
  firstName: string;
  lastName: string;
  name?: string;
  specialty?: string;
  action: 'add' | 'skip' | 'merge';
  [key: string]: any;
}

// POST - Execute import with session tracking and rollback capability
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { rows, fileName, createdBy, dryRun } = data as {
      rows: ImportRow[];
      fileName?: string;
      createdBy?: string;
      dryRun?: boolean;
    };
    
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    if (!rows || !Array.isArray(rows)) {
      return NextResponse.json({ error: 'Invalid request - rows array required' }, { status: 400 });
    }
    
    // Load current providers
    const providersFile = path.join(process.cwd(), 'data', 'arizona-providers.json');
    let providers: any[] = [];
    
    try {
      providers = JSON.parse(fs.readFileSync(providersFile, 'utf-8'));
    } catch (error) {
      providers = [...(providersData as any[])];
    }
    
    // Build NPI lookup map
    const existingByNpi = new Map<string, any>();
    providers.forEach(p => {
      if (p.npi) {
        existingByNpi.set(p.npi, p);
      }
    });
    
    // Count actions
    const addRows = rows.filter(r => r.action === 'add');
    const mergeRows = rows.filter(r => r.action === 'merge');
    const skipRows = rows.filter(r => r.action === 'skip');
    
    // Calculate impact
    const impact = calculateImportImpact(
      providers.length,
      skipRows.length,
      addRows.length,
      mergeRows.length
    );
    
    // If dry run, return impact analysis without making changes
    if (dryRun) {
      return NextResponse.json({
        dryRun: true,
        impact,
        summary: {
          totalRows: rows.length,
          toAdd: addRows.length,
          toMerge: mergeRows.length,
          toSkip: skipRows.length,
          currentProviders: providers.length,
          afterImport: providers.length + addRows.length,
        },
      });
    }
    
    // Create import session for tracking
    const session = createImportSession({
      fileName: fileName || 'import.csv',
      fileSize: JSON.stringify(rows).length,
      totalRows: rows.length,
      createdBy: createdBy || 'system',
    });
    
    const changes: ImportChange[] = [];
    const decisions: { npi: string; action: 'add' | 'skip' | 'merge' | 'error'; reason?: string }[] = [];
    let added = 0;
    let updated = 0;
    let skipped = 0;
    let errors = 0;
    
    // Process each row
    for (const row of rows) {
      try {
        if (row.action === 'skip') {
          skipped++;
          decisions.push({ npi: row.npi, action: 'skip', reason: 'User chose to skip duplicate' });
          continue;
        }
        
        if (row.action === 'add') {
          // Check if NPI already exists (safety check)
          if (existingByNpi.has(row.npi)) {
            errors++;
            decisions.push({ npi: row.npi, action: 'error', reason: 'NPI already exists' });
            continue;
          }
          
          // Generate unique entity number for this provider-location combo
          const entityNumber = row.referenceNumber || row.entityNumber || `${row.npi}${String(Date.now()).slice(-5)}`;
          
          // Create new provider with ALL fields from CSV
          const newProvider = {
            id: `prov-${entityNumber}`,
            entityNumber: entityNumber,
            contractNumber: row.contractNumber || '',
            npi: row.npi,
            firstName: row.firstName || '',
            lastName: row.lastName || '',
            middleInitial: row.middleInitial || '',
            name: row.name || `${row.firstName || ''} ${row.lastName || ''}`.trim(),
            credentials: row.credential || row.credentials || '',
            gender: row.gender || 'U',
            specialty: row.specialty || '',
            specialtyCode: row.specialtyCode || '',
            taxonomyCode: row.primaryTaxonomy || row.taxonomyCode || '',
            secondarySpecialtyCode: row.secondarySpecialtyCode || '',
            secondaryTaxonomyCode: row.secondaryTaxonomy || row.secondaryTaxonomyCode || '',
            facilityType: row.facilityType || 'INDIVIDUAL',
            isPrimaryCare: row.isPrimaryCare || false,
            isBehavioralHealth: row.isBehavioralHealth || false,
            acceptingNewPatients: row.acceptingNewPatients ?? true,
            directoryDisplay: row.directoryDisplay ?? true,
            languages: Array.isArray(row.languages) ? row.languages : (row.languages ? [row.languages] : ['English']),
            pricingTier: row.pricingTier || '',
            networkOrg: row.networkOrg || '',
            effectiveDate: row.startDate || row.effectiveDate || '',
            terminationDate: row.endDate || row.terminationDate || '',
            // Location data - the actual practice location for this provider
            locations: [{
              name: 'Primary',
              address: row.address || row.address1 || '',
              address2: row.address2 || '',
              city: row.city || '',
              state: row.state || 'AZ',
              zip: row.zip || '',
              county: row.county || '',
              phone: row.phone || '',
              fax: row.fax || '',
              email: row.email || '',
            }],
            // Office hours
            hours: {
              monday: row.mondayHours || '',
              tuesday: row.tuesdayHours || '',
              wednesday: row.wednesdayHours || '',
              thursday: row.thursdayHours || '',
              friday: row.fridayHours || '',
              saturday: row.saturdayHours || '',
              sunday: row.sundayHours || '',
            },
            // Corresponding address (for mail/correspondence)
            correspondingAddress: {
              address1: row.correspondingAddr1 || '',
              address2: row.correspondingAddr2 || '',
              city: row.correspondingCity || '',
              state: row.correspondingState || '',
              zip: row.correspondingZip || '',
              contactName: row.contactName || '',
              fax: row.correspondingFax || '',
            },
            // Billing information (Pay-To entity)
            billing: {
              npi: row.billingNpi || '',
              taxId: row.billingTaxId || '',
              name: row.billingName || '',
              address: row.billingAddr1 || row.billingAddress || '',
              address2: row.billingAddr2 || '',
              city: row.billingCity || '',
              state: row.billingState || '',
              zip: row.billingZip || '',
              phone: row.billingPhone || '',
              fax: row.billingFax || '',
            },
            importSessionId: session.id,
            importedAt: new Date().toISOString(),
          };
          
          providers.push(newProvider);
          existingByNpi.set(row.npi, newProvider);
          added++;
          
          changes.push({
            type: 'add',
            npi: row.npi,
            providerId: newProvider.id,
            afterState: newProvider,
          });
          
          decisions.push({ npi: row.npi, action: 'add', reason: 'New provider' });
        }
        
        if (row.action === 'merge') {
          const existing = existingByNpi.get(row.npi);
          if (!existing) {
            errors++;
            decisions.push({ npi: row.npi, action: 'error', reason: 'Provider not found for merge' });
            continue;
          }
          
          // Store before state for rollback
          const beforeState = JSON.parse(JSON.stringify(existing));
          
          // Merge non-empty top-level fields from CSV (don't overwrite with empty values)
          const fieldsToMerge = [
            'firstName', 'lastName', 'middleInitial', 'name', 'credentials',
            'specialty', 'specialtyCode', 'taxonomyCode', 'secondarySpecialtyCode', 'secondaryTaxonomyCode',
            'gender', 'facilityType', 'pricingTier', 'networkOrg', 'effectiveDate', 'terminationDate',
          ];
          
          for (const field of fieldsToMerge) {
            if (row[field] && row[field] !== existing[field]) {
              existing[field] = row[field];
            }
          }
          
          // Merge boolean fields
          if (row.isPrimaryCare !== undefined) existing.isPrimaryCare = row.isPrimaryCare;
          if (row.isBehavioralHealth !== undefined) existing.isBehavioralHealth = row.isBehavioralHealth;
          if (row.acceptingNewPatients !== undefined) existing.acceptingNewPatients = row.acceptingNewPatients;
          if (row.directoryDisplay !== undefined) existing.directoryDisplay = row.directoryDisplay;
          
          // Merge languages
          if (row.languages) {
            existing.languages = Array.isArray(row.languages) ? row.languages : [row.languages];
          }
          
          // Merge location data (update first location)
          if (!existing.locations) existing.locations = [{}];
          const loc = existing.locations[0];
          if (row.address) loc.address = row.address;
          if (row.address2) loc.address2 = row.address2;
          if (row.city) loc.city = row.city;
          if (row.state) loc.state = row.state;
          if (row.zip) loc.zip = row.zip;
          if (row.county) loc.county = row.county;
          if (row.phone) loc.phone = row.phone;
          if (row.fax) loc.fax = row.fax;
          if (row.email) loc.email = row.email;
          
          // Merge hours
          if (!existing.hours) existing.hours = {};
          if (row.mondayHours) existing.hours.monday = row.mondayHours;
          if (row.tuesdayHours) existing.hours.tuesday = row.tuesdayHours;
          if (row.wednesdayHours) existing.hours.wednesday = row.wednesdayHours;
          if (row.thursdayHours) existing.hours.thursday = row.thursdayHours;
          if (row.fridayHours) existing.hours.friday = row.fridayHours;
          if (row.saturdayHours) existing.hours.saturday = row.saturdayHours;
          if (row.sundayHours) existing.hours.sunday = row.sundayHours;
          
          // Merge billing info
          if (!existing.billing) existing.billing = {};
          if (row.billingNpi) existing.billing.npi = row.billingNpi;
          if (row.billingTaxId) existing.billing.taxId = row.billingTaxId;
          if (row.billingName) existing.billing.name = row.billingName;
          if (row.billingAddr1) existing.billing.address = row.billingAddr1;
          if (row.billingAddr2) existing.billing.address2 = row.billingAddr2;
          if (row.billingCity) existing.billing.city = row.billingCity;
          if (row.billingState) existing.billing.state = row.billingState;
          if (row.billingZip) existing.billing.zip = row.billingZip;
          if (row.billingPhone) existing.billing.phone = row.billingPhone;
          if (row.billingFax) existing.billing.fax = row.billingFax;
          
          // Merge corresponding address
          if (!existing.correspondingAddress) existing.correspondingAddress = {};
          if (row.correspondingAddr1) existing.correspondingAddress.address1 = row.correspondingAddr1;
          if (row.correspondingAddr2) existing.correspondingAddress.address2 = row.correspondingAddr2;
          if (row.correspondingCity) existing.correspondingAddress.city = row.correspondingCity;
          if (row.correspondingState) existing.correspondingAddress.state = row.correspondingState;
          if (row.correspondingZip) existing.correspondingAddress.zip = row.correspondingZip;
          if (row.contactName) existing.correspondingAddress.contactName = row.contactName;
          if (row.correspondingFax) existing.correspondingAddress.fax = row.correspondingFax;
          
          existing.lastUpdatedAt = new Date().toISOString();
          existing.lastUpdatedBySession = session.id;
          
          updated++;
          
          changes.push({
            type: 'update',
            npi: row.npi,
            providerId: existing.id,
            beforeState,
            afterState: JSON.parse(JSON.stringify(existing)),
          });
          
          decisions.push({ npi: row.npi, action: 'merge', reason: 'Updated existing provider' });
        }
      } catch (error) {
        errors++;
        decisions.push({ npi: row.npi, action: 'error', reason: String(error) });
      }
    }
    
    // Save updated providers
    try {
      fs.writeFileSync(providersFile, JSON.stringify(providers, null, 2));
    } catch (error) {
      // Update session as failed
      updateImportSession(session.id, {
        status: 'failed',
        added: 0,
        updated: 0,
        skipped,
        errors: rows.length,
      });
      
      return NextResponse.json({ error: 'Failed to save providers' }, { status: 500 });
    }
    
    // Update session as completed
    updateImportSession(session.id, {
      status: 'completed',
      completedAt: new Date().toISOString(),
      added,
      updated,
      skipped,
      errors,
      changes,
      decisions,
    });
    
    // Log audit event
    await logAuditEvent({
      user: createdBy || 'system',
      userId: createdBy || 'system',
      action: 'CSV Import Completed',
      category: 'data_change',
      resource: session.id,
      resourceType: 'ImportSession',
      resourceId: session.id,
      details: `Import completed: ${added} added, ${updated} updated, ${skipped} skipped, ${errors} errors`,
      ip,
      userAgent,
      sessionId: session.id,
      severity: errors > 0 ? 'warning' : 'info',
      phiAccessed: true,
      success: true,
    });
    
    return NextResponse.json({
      success: true,
      sessionId: session.id,
      summary: {
        added,
        updated,
        skipped,
        errors,
        totalProviders: providers.length,
      },
      canRollback: changes.length > 0,
      impact,
    });
  } catch (error) {
    console.error('Error executing import:', error);
    return NextResponse.json({ error: 'Failed to execute import' }, { status: 500 });
  }
}
