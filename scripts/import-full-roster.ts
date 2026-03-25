import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CSV file path
const csvPath = '/Users/rufus/.openclaw/media/inbound/file_210---0b00bfc8-2c77-4ae6-9436-9187c9c05293.csv';
const outputPath = path.join(__dirname, '..', 'data', 'arizona-providers.json');

// Read CSV
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.split('\n').filter(line => line.trim());

// Parse header
const headerLine = lines[0];
const headers = parseCSVLine(headerLine);

console.log(`Headers: ${headers.length} columns`);
console.log(`Data rows: ${lines.length - 1}`);

// Parse CSV line handling quoted fields
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Map headers to indices
const headerMap: Record<string, number> = {};
headers.forEach((h, i) => {
  headerMap[h.toLowerCase().replace(/[^a-z0-9]/g, '')] = i;
});

// Helper to get value by header name
function getValue(row: string[], ...possibleNames: string[]): string {
  for (const name of possibleNames) {
    const key = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (headerMap[key] !== undefined) {
      return row[headerMap[key]] || '';
    }
  }
  return '';
}

// Parse all rows
const providers: any[] = [];
const seenNpis = new Set<string>();

for (let i = 1; i < lines.length; i++) {
  const row = parseCSVLine(lines[i]);
  if (row.length < 5) continue; // Skip incomplete rows
  
  const npi = getValue(row, 'NPI');
  if (!npi || !/^\d{10}$/.test(npi)) continue; // Skip invalid NPIs
  
  // Create unique key for deduplication (NPI + address for multi-location providers)
  const address = getValue(row, 'Address1');
  const uniqueKey = `${npi}-${address}`;
  
  // For same NPI different location, we still want to add
  // But for exact duplicates, skip
  
  const provider = {
    id: `prov-${getValue(row, 'Entity #') || npi}`,
    entityNumber: getValue(row, 'Entity #'),
    contractNumber: getValue(row, 'Contract #'),
    npi: npi,
    firstName: getValue(row, 'First Name'),
    lastName: getValue(row, 'Last Name'),
    middleInitial: getValue(row, 'Mid Init'),
    credentials: getValue(row, 'Suffix'),
    gender: getValue(row, 'Gender') || 'U',
    specialty: mapSpecialtyCode(getValue(row, 'Primary Spc Code')),
    specialtyCode: getValue(row, 'Primary Spc Code'),
    taxonomyCode: getValue(row, 'Primary Taxonomy Code'),
    secondarySpecialtyCode: getValue(row, 'Secondary Spc Code'),
    secondaryTaxonomyCode: getValue(row, 'Secondary Taxonomy Code'),
    facilityType: getValue(row, 'Facility Type') || 'INDIVIDUAL',
    isPrimaryCare: getValue(row, 'Primary Care Flag') === 'P',
    isBehavioralHealth: getValue(row, 'Behavioral Health Flag') === 'B',
    acceptingNewPatients: getValue(row, 'Accepts New Patients') === 'Y',
    directoryDisplay: getValue(row, 'Directory Display') === 'Y',
    languages: parseLanguages(getValue(row, 'Language')),
    pricingTier: getValue(row, 'Pricing Tier'),
    networkOrg: getValue(row, 'Network Org'),
    effectiveDate: getValue(row, 'Start Date'),
    terminationDate: getValue(row, 'End Date'),
    locations: [{
      name: 'Primary',
      address: getValue(row, 'Address1'),
      address2: getValue(row, 'Address 2'),
      city: getValue(row, 'City'),
      state: getValue(row, 'State'),
      zip: getValue(row, 'Zip Code'),
      county: getValue(row, 'County'),
      phone: getValue(row, 'Phone #'),
      fax: getValue(row, 'Fax'),
      email: getValue(row, 'Email'),
    }],
    hours: {
      monday: getValue(row, 'Monday Hours'),
      tuesday: getValue(row, 'Tuesday Hours'),
      wednesday: getValue(row, 'Wednesday Hours'),
      thursday: getValue(row, 'Thursday Hours'),
      friday: getValue(row, 'Friday Hours'),
      saturday: getValue(row, 'Saturday Hours'),
      sunday: getValue(row, 'Sunday Hours'),
    },
    correspondingAddress: {
      address1: getValue(row, 'Corresponding Addr 1'),
      address2: getValue(row, 'Corresponding Addr 2'),
      city: getValue(row, 'Corresponding City'),
      state: getValue(row, 'Corresponding State'),
      zip: getValue(row, 'Corresponding Zip'),
      contactName: getValue(row, 'Contact Name'),
      fax: getValue(row, 'Corresponding Fax'),
    },
    billing: {
      npi: getValue(row, 'Billing NPI'),
      taxId: getValue(row, 'Billing Tax ID'),
      name: getValue(row, 'Billing Name'),
      address: getValue(row, 'Billing Addr 1'),
      address2: getValue(row, 'Billing Addr 2'),
      city: getValue(row, 'Billing City'),
      state: getValue(row, 'Billing State'),
      zip: getValue(row, 'Billing Zip'),
      phone: getValue(row, 'Billing Phone'),
      fax: getValue(row, 'Billing Fax'),
    },
    importedAt: new Date().toISOString(),
  };
  
  providers.push(provider);
}

// Map specialty codes to names
function mapSpecialtyCode(code: string): string {
  const specialties: Record<string, string> = {
    '02': 'General Surgery',
    '03': 'Allergy/Immunology',
    '04': 'Otolaryngology',
    '05': 'Anesthesiology',
    '07': 'Dermatology',
    '08': 'Family Medicine',
    '09': 'Pain Management',
    '11': 'Internal Medicine',
    '14': 'Neurosurgery',
    '15': 'Speech Pathology',
    '16': 'Obstetrics/Gynecology',
    '17': 'Hospice/Palliative',
    '18': 'Ophthalmology',
    '20': 'Orthopedic Surgery',
    '21': 'Cardiac Surgery',
    '22': 'Pathology',
    '23': 'Sports Medicine',
    '29': 'Pulmonology',
    '30': 'Radiology',
    '34': 'Urology',
    '35': 'Chiropractic',
    '37': 'Pediatrics',
    '38': 'Gastroenterology',
    '39': 'Nephrology',
    '40': 'Hand Surgery',
    '43': 'Anesthesiology (CRNA)',
    '44': 'Infectious Disease',
    '46': 'Endocrinology',
    '48': 'Podiatry',
    '50': 'Nurse Practitioner',
    '62': 'Psychology',
    '65': 'Physical Therapy',
    '66': 'Rheumatology',
    '67': 'Occupational Therapy',
    '68': 'Psychology',
    '72': 'Pain Medicine',
    '77': 'Vascular Surgery',
    '78': 'Cardiac Surgery',
    '79': 'Plastic Surgery',
    '80': 'Social Work',
    '81': 'Critical Care',
    '86': 'Psychiatry',
    '89': 'Nurse Midwife',
    '92': 'Radiation Oncology',
    '93': 'Emergency Medicine',
    '94': 'Nuclear Medicine',
    '97': 'Physician Assistant',
    'C3': 'Interventional Cardiology',
    'C5': 'Dentistry',
    'C6': 'Hospitalist',
    'C8': 'Preventive Medicine',
    'D8': 'Sports Medicine',
    'E1': 'Marriage/Family Therapy',
    'E2': 'Counseling',
  };
  return specialties[code] || 'General Practice';
}

// Parse languages string
function parseLanguages(langStr: string): string[] {
  if (!langStr) return ['English'];
  const langMap: Record<string, string> = {
    'eng': 'English',
    'spa': 'Spanish',
    'zho': 'Chinese',
    'vie': 'Vietnamese',
    'kor': 'Korean',
    'tgl': 'Tagalog',
    'hin': 'Hindi',
    'guj': 'Gujarati',
    'ara': 'Arabic',
    'fas': 'Persian',
    'fra': 'French',
    'deu': 'German',
    'rus': 'Russian',
    'pol': 'Polish',
    'tha': 'Thai',
    'swa': 'Swahili',
    'pan': 'Punjabi',
    'tel': 'Telugu',
    'mal': 'Malayalam',
    'kan': 'Kannada',
    'tam': 'Tamil',
    'urd': 'Urdu',
    'heb': 'Hebrew',
    'sqi': 'Albanian',
  };
  
  const codes = langStr.split(',').map(s => s.trim().toLowerCase());
  const languages = [...new Set(codes.map(c => langMap[c] || c).filter(Boolean))];
  return languages.length > 0 ? languages : ['English'];
}

// Write output
console.log(`\nWriting ${providers.length} providers to ${outputPath}`);
fs.writeFileSync(outputPath, JSON.stringify(providers, null, 2));

// Stats
const uniqueNpis = new Set(providers.map(p => p.npi)).size;
const primaryCare = providers.filter(p => p.isPrimaryCare).length;
const behavioralHealth = providers.filter(p => p.isBehavioralHealth).length;
const acceptingNew = providers.filter(p => p.acceptingNewPatients).length;

console.log(`\n=== Import Complete ===`);
console.log(`Total rows: ${providers.length}`);
console.log(`Unique NPIs: ${uniqueNpis}`);
console.log(`Primary Care: ${primaryCare}`);
console.log(`Behavioral Health: ${behavioralHealth}`);
console.log(`Accepting New Patients: ${acceptingNew}`);

// Count by specialty
const bySpecialty: Record<string, number> = {};
providers.forEach(p => {
  bySpecialty[p.specialty] = (bySpecialty[p.specialty] || 0) + 1;
});
console.log(`\nTop Specialties:`);
Object.entries(bySpecialty)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .forEach(([spec, count]) => console.log(`  ${spec}: ${count}`));
