import { NextRequest, NextResponse } from 'next/server';
import providersData from '@/data/arizona-providers.json';
import fs from 'fs';
import path from 'path';

// For large CSV files - body size is handled by Next.js default (4MB)
// For files over 4MB, use streaming or chunked uploads

interface ParsedRow {
  rowNumber: number;
  entityNumber: string;
  npi: string;
  firstName: string;
  lastName: string;
  name: string;
  specialty: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  [key: string]: any;
}

interface EntityDuplicate {
  rowNumber: number;
  entityNumber: string;
  npi: string;
  csvName: string;
  reason: 'exists_in_system' | 'duplicate_in_csv';
  existingInfo?: {
    providerName: string;
    address: string;
  };
  duplicateRowNumbers?: number[];
}

interface LocationToAdd {
  rowNumber: number;
  entityNumber: string;
  npi: string;
  name: string;
  address: string;
  city: string;
  state: string;
  action: 'add_location' | 'create_provider';
  existingProviderName?: string;
  existingLocationCount?: number;
}

// POST - Analyze CSV for duplicates (server-side)
// Uses ENTITY NUMBER as the unique key per location
// NPI is used to group locations under the same provider
export async function POST(request: NextRequest) {
  try {
    const { rows } = await request.json() as { rows: ParsedRow[] };
    
    if (!rows || !Array.isArray(rows)) {
      return NextResponse.json({ error: 'Invalid request - rows array required' }, { status: 400 });
    }

    // Load current providers from file (in case it's been updated)
    let providers: any[] = [];
    const providersFile = path.join(process.cwd(), 'data', 'arizona-providers.json');
    try {
      providers = JSON.parse(fs.readFileSync(providersFile, 'utf-8'));
    } catch (error) {
      providers = [...(providersData as any[])];
    }
    
    // Build Entity Number lookup map for O(1) duplicate checking
    // Each location has a unique entity number
    const existingByEntityNumber = new Map<string, { provider: any; locationIndex: number }>();
    const existingByNpi = new Map<string, any>();
    
    providers.forEach(p => {
      if (p.npi) {
        existingByNpi.set(p.npi, p);
      }
      // Check provider-level entity number (legacy single-location)
      if (p.entityNumber) {
        existingByEntityNumber.set(p.entityNumber, { provider: p, locationIndex: 0 });
      }
      // Check all locations for entity numbers
      if (p.locations && Array.isArray(p.locations)) {
        p.locations.forEach((loc: any, idx: number) => {
          if (loc.entityNumber) {
            existingByEntityNumber.set(loc.entityNumber, { provider: p, locationIndex: idx });
          }
        });
      }
    });

    const duplicates: EntityDuplicate[] = [];
    const locationsToAdd: LocationToAdd[] = [];
    const errors: { rowNumber: number; field: string; message: string }[] = [];

    // Track entity numbers within this CSV to detect duplicates in the file itself
    const csvEntityNumbers = new Map<string, number[]>(); // entityNumber -> rowNumbers

    // First pass: collect all entity numbers in CSV
    rows.forEach(row => {
      const entityNum = row.entityNumber || row.referenceNumber;
      if (entityNum) {
        const existing = csvEntityNumbers.get(entityNum) || [];
        existing.push(row.rowNumber);
        csvEntityNumbers.set(entityNum, existing);
      }
    });

    // Second pass: analyze each row
    rows.forEach(row => {
      const entityNum = row.entityNumber || row.referenceNumber;
      
      // Validate required fields
      if (!row.npi) {
        errors.push({ rowNumber: row.rowNumber, field: 'npi', message: 'Missing NPI' });
        return;
      }
      if (!/^\d{10}$/.test(row.npi)) {
        errors.push({ rowNumber: row.rowNumber, field: 'npi', message: 'Invalid NPI format (must be 10 digits)' });
        return;
      }
      if (!entityNum) {
        errors.push({ rowNumber: row.rowNumber, field: 'entityNumber', message: 'Missing Entity Number' });
        return;
      }

      const rowName = row.name || `${row.firstName || ''} ${row.lastName || ''}`.trim();
      const rowAddress = `${row.address || ''}, ${row.city || ''}, ${row.state || ''} ${row.zip || ''}`.trim();

      // Check 1: Is this entity number duplicated within the CSV?
      const csvDupeRows = csvEntityNumbers.get(entityNum) || [];
      if (csvDupeRows.length > 1) {
        duplicates.push({
          rowNumber: row.rowNumber,
          entityNumber: entityNum,
          npi: row.npi,
          csvName: rowName,
          reason: 'duplicate_in_csv',
          duplicateRowNumbers: csvDupeRows.filter(r => r !== row.rowNumber),
        });
        return;
      }

      // Check 2: Does this entity number already exist in the system?
      const existingEntity = existingByEntityNumber.get(entityNum);
      if (existingEntity) {
        const existingLoc = existingEntity.provider.locations?.[existingEntity.locationIndex] || {};
        duplicates.push({
          rowNumber: row.rowNumber,
          entityNumber: entityNum,
          npi: row.npi,
          csvName: rowName,
          reason: 'exists_in_system',
          existingInfo: {
            providerName: existingEntity.provider.name || `${existingEntity.provider.firstName} ${existingEntity.provider.lastName}`,
            address: `${existingLoc.address || existingEntity.provider.address || ''}, ${existingLoc.city || existingEntity.provider.city || ''}`,
          },
        });
        return;
      }

      // No duplicate - this is a valid location to add
      const existingProvider = existingByNpi.get(row.npi);
      
      if (existingProvider) {
        // Provider exists - this will add a new location
        const locationCount = existingProvider.locations?.length || 1;
        locationsToAdd.push({
          rowNumber: row.rowNumber,
          entityNumber: entityNum,
          npi: row.npi,
          name: rowName,
          address: row.address || '',
          city: row.city || '',
          state: row.state || '',
          action: 'add_location',
          existingProviderName: existingProvider.name || `${existingProvider.firstName} ${existingProvider.lastName}`,
          existingLocationCount: locationCount,
        });
      } else {
        // New provider - will be created with this location
        locationsToAdd.push({
          rowNumber: row.rowNumber,
          entityNumber: entityNum,
          npi: row.npi,
          name: rowName,
          address: row.address || '',
          city: row.city || '',
          state: row.state || '',
          action: 'create_provider',
        });
      }
    });

    // Group locations by NPI for summary
    const byNpi = new Map<string, LocationToAdd[]>();
    locationsToAdd.forEach(loc => {
      const existing = byNpi.get(loc.npi) || [];
      existing.push(loc);
      byNpi.set(loc.npi, existing);
    });

    // Count new providers vs locations added to existing
    const newProviders = locationsToAdd.filter(l => l.action === 'create_provider');
    const addedLocations = locationsToAdd.filter(l => l.action === 'add_location');

    // Group new providers by NPI to show how many locations each new provider will have
    const newProvidersByNpi = new Map<string, LocationToAdd[]>();
    newProviders.forEach(loc => {
      const existing = newProvidersByNpi.get(loc.npi) || [];
      existing.push(loc);
      newProvidersByNpi.set(loc.npi, existing);
    });

    return NextResponse.json({
      totalRows: rows.length,
      totalExistingProviders: providers.length,
      totalExistingEntityNumbers: existingByEntityNumber.size,
      
      // Summary counts
      duplicates: duplicates.length,
      duplicatesInSystem: duplicates.filter(d => d.reason === 'exists_in_system').length,
      duplicatesInCsv: duplicates.filter(d => d.reason === 'duplicate_in_csv').length,
      
      locationsToAdd: locationsToAdd.length,
      newProviders: newProvidersByNpi.size, // Unique new NPIs
      newLocationsForNewProviders: newProviders.length, // Total locations for new providers
      existingProvidersUpdated: new Set(addedLocations.map(l => l.npi)).size, // Unique existing NPIs getting new locations
      locationsAddedToExisting: addedLocations.length, // Total locations being added to existing providers
      
      errors: errors.length,
      
      // Details for review UI
      duplicateDetails: duplicates,
      locationsToAddDetails: locationsToAdd,
      errorDetails: errors,
      
      // Grouped by NPI for display
      providerSummary: Array.from(byNpi.entries()).map(([npi, locs]) => ({
        npi,
        name: locs[0].name,
        action: locs[0].action,
        existingProviderName: locs[0].existingProviderName,
        existingLocationCount: locs[0].existingLocationCount,
        newLocationCount: locs.length,
        locations: locs.map(l => ({
          entityNumber: l.entityNumber,
          address: l.address,
          city: l.city,
          state: l.state,
        })),
      })),
    });
  } catch (error) {
    console.error('Error analyzing CSV:', error);
    return NextResponse.json({ error: 'Failed to analyze CSV' }, { status: 500 });
  }
}
