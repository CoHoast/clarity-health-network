import { NextRequest, NextResponse } from 'next/server';
import { logAuditEvent } from '@/lib/audit';
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
          
          // Create new provider
          const newProvider = {
            id: `prov-${row.npi}`,
            npi: row.npi,
            firstName: row.firstName || '',
            lastName: row.lastName || '',
            name: row.name || `${row.firstName || ''} ${row.lastName || ''}`.trim(),
            credentials: row.credential || row.credentials || '',
            specialty: row.specialty || '',
            specialtyCode: row.specialtyCode || '',
            taxonomyCode: row.primaryTaxonomy || '',
            secondaryTaxonomyCode: row.secondaryTaxonomy || '',
            gender: row.gender || 'U',
            facilityType: row.facilityType || 'INDIVIDUAL',
            isPrimaryCare: row.isPrimaryCare || false,
            isBehavioralHealth: row.isBehavioralHealth || false,
            acceptingNewPatients: row.acceptingNewPatients ?? true,
            languages: row.languages || ['English'],
            locations: [{
              address1: row.address || '',
              city: row.city || '',
              state: row.state || '',
              zip: row.zip || '',
              phone: row.phone || '',
            }],
            contractNumber: row.contractNumber || '',
            referenceNumber: row.referenceNumber || '',
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
          const beforeState = { ...existing };
          
          // Merge non-empty fields from CSV (don't overwrite with empty values)
          const fieldsToMerge = [
            'firstName', 'lastName', 'name', 'specialty', 'specialtyCode',
            'credentials', 'taxonomyCode', 'secondaryTaxonomyCode',
            'gender', 'facilityType', 'phone', 'address', 'city', 'state', 'zip',
          ];
          
          for (const field of fieldsToMerge) {
            if (row[field] && row[field] !== existing[field]) {
              existing[field] = row[field];
            }
          }
          
          existing.lastUpdatedAt = new Date().toISOString();
          existing.lastUpdatedBySession = session.id;
          
          updated++;
          
          changes.push({
            type: 'update',
            npi: row.npi,
            providerId: existing.id,
            beforeState,
            afterState: { ...existing },
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
