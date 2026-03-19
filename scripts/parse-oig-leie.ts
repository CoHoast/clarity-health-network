/**
 * Parse OIG LEIE CSV into JSON for fast lookup
 * Run with: npx tsx scripts/parse-oig-leie.ts
 */

import * as fs from 'fs';
import * as path from 'path';

interface OIGExclusion {
  lastName: string;
  firstName: string;
  midName: string;
  busName: string;
  general: string;
  specialty: string;
  upin: string;
  npi: string;
  dob: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  exclType: string;
  exclDate: string;
  reinDate: string;
  waiverDate: string;
  wvrState: string;
}

function parseCSV(csvContent: string): OIGExclusion[] {
  const lines = csvContent.split('\n');
  const results: OIGExclusion[] = [];
  
  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Parse CSV with quoted fields
    const fields: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        fields.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    fields.push(current.trim());
    
    if (fields.length >= 18) {
      results.push({
        lastName: fields[0],
        firstName: fields[1],
        midName: fields[2],
        busName: fields[3],
        general: fields[4],
        specialty: fields[5],
        upin: fields[6],
        npi: fields[7],
        dob: fields[8],
        address: fields[9],
        city: fields[10],
        state: fields[11],
        zip: fields[12],
        exclType: fields[13],
        exclDate: fields[14],
        reinDate: fields[15],
        waiverDate: fields[16],
        wvrState: fields[17],
      });
    }
  }
  
  return results;
}

function formatExclDate(dateStr: string): string {
  if (!dateStr || dateStr === '00000000') return '';
  // Format: YYYYMMDD -> YYYY-MM-DD
  if (dateStr.length === 8) {
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
  }
  return dateStr;
}

// Main execution
const csvPath = path.join(__dirname, '../data/oig-leie.csv');
const outputPath = path.join(__dirname, '../data/oig-leie.json');
const npiIndexPath = path.join(__dirname, '../data/oig-npi-index.json');
const nameIndexPath = path.join(__dirname, '../data/oig-name-index.json');

console.log('Reading CSV...');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

console.log('Parsing...');
const exclusions = parseCSV(csvContent);

console.log(`Parsed ${exclusions.length} exclusion records`);

// Create NPI index for fast lookup
const npiIndex: Record<string, number[]> = {};
const nameIndex: Record<string, number[]> = {};

exclusions.forEach((excl, idx) => {
  // Index by NPI (if valid 10-digit NPI)
  if (excl.npi && excl.npi.length === 10 && excl.npi !== '0000000000') {
    if (!npiIndex[excl.npi]) npiIndex[excl.npi] = [];
    npiIndex[excl.npi].push(idx);
  }
  
  // Index by normalized last name (for name-based lookup)
  const normalizedName = excl.lastName.toUpperCase().trim();
  if (normalizedName) {
    if (!nameIndex[normalizedName]) nameIndex[normalizedName] = [];
    nameIndex[normalizedName].push(idx);
  }
  
  // Index by business name
  const normalizedBus = excl.busName.toUpperCase().trim();
  if (normalizedBus) {
    if (!nameIndex[normalizedBus]) nameIndex[normalizedBus] = [];
    nameIndex[normalizedBus].push(idx);
  }
});

// Format dates in exclusions
const formattedExclusions = exclusions.map(e => ({
  ...e,
  exclDate: formatExclDate(e.exclDate),
  reinDate: formatExclDate(e.reinDate),
  waiverDate: formatExclDate(e.waiverDate),
}));

console.log('Writing JSON files...');

// Write main data file
fs.writeFileSync(outputPath, JSON.stringify(formattedExclusions, null, 0));
console.log(`- Main data: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);

// Write indexes
fs.writeFileSync(npiIndexPath, JSON.stringify(npiIndex));
console.log(`- NPI index: ${Object.keys(npiIndex).length} unique NPIs`);

fs.writeFileSync(nameIndexPath, JSON.stringify(nameIndex));
console.log(`- Name index: ${Object.keys(nameIndex).length} unique names`);

console.log('Done!');
