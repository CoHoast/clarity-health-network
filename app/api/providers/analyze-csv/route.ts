import { NextRequest, NextResponse } from 'next/server';
import providersData from '@/data/arizona-providers.json';

interface ParsedRow {
  rowNumber: number;
  npi: string;
  firstName: string;
  lastName: string;
  name: string;
  specialty: string;
  [key: string]: any;
}

interface DuplicateMatch {
  rowNumber: number;
  npi: string;
  csvName: string;
  existingName: string;
  existingSpecialty: string;
  differences: { field: string; existing: string; csv: string }[];
}

// POST - Analyze CSV for duplicates (server-side)
// This scales to 100K+ providers because we check against an indexed Set
export async function POST(request: NextRequest) {
  try {
    const { rows } = await request.json() as { rows: ParsedRow[] };
    
    if (!rows || !Array.isArray(rows)) {
      return NextResponse.json({ error: 'Invalid request - rows array required' }, { status: 400 });
    }

    const providers = providersData as any[];
    
    // Build NPI lookup map for O(1) duplicate checking
    // This is the key to scaling - Map lookup is O(1) vs O(n) array search
    const existingByNpi = new Map<string, any>();
    providers.forEach(p => {
      if (p.npi) {
        existingByNpi.set(p.npi, p);
      }
    });

    const duplicates: DuplicateMatch[] = [];
    const newRows: ParsedRow[] = [];
    const errors: { rowNumber: number; field: string; message: string }[] = [];

    // Check each row - O(1) lookup per row
    rows.forEach(row => {
      // Validate NPI
      if (!row.npi) {
        errors.push({ rowNumber: row.rowNumber, field: 'npi', message: 'Missing NPI' });
        return;
      }
      if (!/^\d{10}$/.test(row.npi)) {
        errors.push({ rowNumber: row.rowNumber, field: 'npi', message: 'Invalid NPI format' });
        return;
      }

      // Check for duplicate
      const existing = existingByNpi.get(row.npi);
      
      if (existing) {
        // Found duplicate - calculate differences
        const differences: { field: string; existing: string; csv: string }[] = [];
        
        const fieldsToCompare = [
          { csvKey: 'firstName', existingKey: 'firstName', label: 'First Name' },
          { csvKey: 'lastName', existingKey: 'lastName', label: 'Last Name' },
          { csvKey: 'specialty', existingKey: 'specialty', label: 'Specialty' },
          { csvKey: 'phone', existingKey: 'phone', label: 'Phone' },
          { csvKey: 'email', existingKey: 'email', label: 'Email' },
          { csvKey: 'address', existingKey: 'address', label: 'Address' },
          { csvKey: 'city', existingKey: 'city', label: 'City' },
          { csvKey: 'state', existingKey: 'state', label: 'State' },
          { csvKey: 'zip', existingKey: 'zip', label: 'ZIP' },
        ];

        fieldsToCompare.forEach(({ csvKey, existingKey, label }) => {
          const existingVal = existing[existingKey] || '';
          const csvVal = row[csvKey] || '';
          // Only flag if CSV has a non-empty value that differs
          if (csvVal && existingVal !== csvVal) {
            differences.push({ 
              field: label, 
              existing: existingVal || '(empty)', 
              csv: csvVal 
            });
          }
        });

        duplicates.push({
          rowNumber: row.rowNumber,
          npi: row.npi,
          csvName: row.name || `${row.firstName} ${row.lastName}`.trim(),
          existingName: existing.name || `${existing.firstName || ''} ${existing.lastName || ''}`.trim(),
          existingSpecialty: existing.specialty || '',
          differences,
        });
      } else {
        newRows.push(row);
      }
    });

    return NextResponse.json({
      totalRows: rows.length,
      totalExisting: providers.length,
      duplicates: duplicates.length,
      new: newRows.length,
      errors: errors.length,
      duplicateDetails: duplicates,
      newRows: newRows,
      errorDetails: errors,
    });
  } catch (error) {
    console.error('Error analyzing CSV:', error);
    return NextResponse.json({ error: 'Failed to analyze CSV' }, { status: 500 });
  }
}
