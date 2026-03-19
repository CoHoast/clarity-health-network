#!/usr/bin/env npx tsx
/**
 * Arizona Provider Import Script
 * Imports Solidarity Arizona providers from CSV into TrueCare demo
 * 
 * Usage: npx tsx scripts/import-arizona-providers.ts
 */

import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';

// CSV file path
const CSV_PATH = '/Users/rufus/.openclaw/media/inbound/file_173---b51396e5-d830-44bd-9bd8-53b1da943d9e.csv';

// Output paths
const PROVIDERS_OUTPUT = path.join(__dirname, '../data/arizona-providers.json');
const PRACTICES_OUTPUT = path.join(__dirname, '../data/arizona-practices.json');
const STATS_OUTPUT = path.join(__dirname, '../data/arizona-import-stats.json');

interface CSVRow {
  'Entity #': string;
  'Contract #': string;
  'NPI': string;
  'First Name': string;
  'Last Name': string;
  'Mid Init': string;
  'Suffix': string;
  'Address1': string;
  'Address 2': string;
  'City': string;
  'State': string;
  'Zip Code': string;
  'County': string;
  'Gender': string;
  'Primary Spc Code': string;
  'Primary Taxonomy Code': string;
  'Secondary Spc Code': string;
  'Secondary Taxonomy Code': string;
  'Facility Type': string;
  'Phone #': string;
  'Fax': string;
  'Email': string;
  'Language': string;
  'Accepts New Patients': string;
  'Primary Care Flag': string;
  'Behavioral Health Flag': string;
  'Directory Display': string;
  'Monday Hours': string;
  'Tuesday Hours': string;
  'Wednesday Hours': string;
  'Thursday Hours': string;
  'Friday Hours': string;
  'Saturday Hours': string;
  'Sunday Hours': string;
  'Pricing Tier': string;
  'Network Org': string;
  'Start Date': string;
  'End Date': string;
  'Corresponding Addr 1': string;
  'Corresponding Addr 2': string;
  'Corresponding City': string;
  'Corresponding State': string;
  'Corresponding Zip': string;
  'Contact Name': string;
  'Corresponding Fax': string;
  'Billing NPI': string;
  'Billing Tax ID': string;
  'Billing Name': string;
  'Billing Addr 1': string;
  'Billing Addr 2': string;
  'Billing City': string;
  'Billing State': string;
  'Billing Zip': string;
  'Billing Phone': string;
  'Billing Fax': string;
}

// Specialty code to name mapping
const SPECIALTY_MAP: Record<string, string> = {
  '02': 'General Surgery',
  '03': 'Allergy/Immunology',
  '04': 'Otolaryngology',
  '05': 'Anesthesiology',
  '07': 'Dermatology',
  '08': 'Family Practice',
  '09': 'Pain Management',
  '11': 'Internal Medicine',
  '14': 'Neurosurgery',
  '16': 'Obstetrics/Gynecology',
  '17': 'Hospice/Palliative Care',
  '18': 'Ophthalmology',
  '20': 'Orthopedic Surgery',
  '21': 'Cardiac Surgery',
  '22': 'Plastic Surgery',
  '23': 'Sports Medicine',
  '29': 'Pulmonology',
  '30': 'Radiology',
  '34': 'Urology',
  '35': 'Chiropractic',
  '37': 'Pediatrics',
  '38': 'Geriatrics',
  '39': 'Nephrology',
  '40': 'Hand Surgery',
  '43': 'CRNA',
  '44': 'Infectious Disease',
  '46': 'Endocrinology',
  '48': 'Podiatry',
  '50': 'Nurse Practitioner',
  '62': 'Psychology',
  '65': 'Physical Therapy',
  '66': 'Rheumatology',
  '67': 'Occupational Therapy',
  '68': 'Clinical Psychology',
  '72': 'Pain Medicine',
  '77': 'Gastroenterology',
  '78': 'Thoracic Surgery',
  '79': 'Addiction Medicine',
  '80': 'Social Work',
  '81': 'Critical Care',
  '86': 'Psychiatry',
  '89': 'PMHNP',
  '92': 'Radiation Oncology',
  '93': 'Emergency Medicine',
  '94': 'Interventional Radiology',
  '97': 'Physician Assistant',
  'C3': 'Cardiovascular',
  'C5': 'Dentistry',
  'C6': 'Hospitalist',
  'C8': 'Child Psychiatry',
  'D8': 'Hematology/Oncology',
  'E1': 'Marriage/Family Therapy',
  'E2': 'Counseling',
};

// Credential cleanup
function cleanCredential(suffix: string): string {
  if (!suffix || suffix === 'None' || suffix === 'nan' || suffix.trim() === '') {
    return '';
  }
  return suffix.trim();
}

// Gender normalization
function normalizeGender(g: string): 'M' | 'F' | 'U' {
  const upper = (g || '').toUpperCase();
  if (upper === 'M') return 'M';
  if (upper === 'F') return 'F';
  return 'U';
}

// Phone formatting
function formatPhone(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

// Parse languages
function parseLanguages(langStr: string): string[] {
  if (!langStr) return ['English'];
  const langs = langStr.split(',').map(l => l.trim()).filter(Boolean);
  const langMap: Record<string, string> = {
    'eng': 'English',
    'spa': 'Spanish',
    'zho': 'Chinese',
    'vie': 'Vietnamese',
    'ara': 'Arabic',
    'kor': 'Korean',
    'rus': 'Russian',
    'hin': 'Hindi',
    'guj': 'Gujarati',
    'pan': 'Punjabi',
    'tgl': 'Tagalog',
    'tha': 'Thai',
    'fra': 'French',
    'deu': 'German',
    'pol': 'Polish',
    'fas': 'Farsi',
    'mal': 'Malayalam',
    'tam': 'Tamil',
    'tel': 'Telugu',
    'swa': 'Swahili',
    'urd': 'Urdu',
    'sqi': 'Albanian',
    'heb': 'Hebrew',
    'kan': 'Kannada',
  };
  const mapped = [...new Set(langs.map(l => langMap[l] || l))];
  return mapped.length > 0 ? mapped : ['English'];
}

interface Provider {
  id: string;
  npi: string;
  contractNumber: string;
  referenceNumber: string;
  firstName: string;
  lastName: string;
  middleInitial: string;
  credentials: string;
  gender: 'M' | 'F' | 'U';
  specialty: string;
  specialtyCode: string;
  taxonomyCode: string;
  secondarySpecialtyCode: string;
  secondaryTaxonomyCode: string;
  isPrimaryCare: boolean;
  isBehavioralHealth: boolean;
  acceptingNewPatients: boolean;
  directoryDisplay: boolean;
  languages: string[];
  pricingTier: string;
  networkId: string;
  status: 'active' | 'pending' | 'inactive';
  locations: ProviderLocation[];
  billing: BillingInfo;
  createdAt: string;
}

interface ProviderLocation {
  id: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  fax: string;
  email: string;
  isPrimary: boolean;
  hours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
}

interface BillingInfo {
  npi: string;
  taxId: string;
  name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  fax: string;
}

interface Practice {
  id: string;
  name: string;
  taxId: string;
  npi: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  fax: string;
  providerCount: number;
  providerIds: string[];
}

async function main() {
  console.log('🏥 Arizona Provider Import Script');
  console.log('==================================\n');

  // Read CSV
  console.log('📖 Reading CSV file...');
  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
  
  // Parse CSV (handle BOM)
  const cleanContent = csvContent.replace(/^\uFEFF/, '');
  const rows: CSVRow[] = parse(cleanContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  console.log(`   Found ${rows.length} rows in CSV\n`);

  // Group by NPI to handle multiple locations
  const providersByNPI = new Map<string, CSVRow[]>();
  for (const row of rows) {
    const npi = row['NPI'];
    if (!npi) continue;
    
    if (!providersByNPI.has(npi)) {
      providersByNPI.set(npi, []);
    }
    providersByNPI.get(npi)!.push(row);
  }

  console.log(`👤 Found ${providersByNPI.size} unique providers\n`);

  // Group by billing org to create practices
  const practicesByTaxId = new Map<string, Practice>();
  
  // Build provider records
  const providers: Provider[] = [];
  let locationCount = 0;

  for (const [npi, locations] of providersByNPI) {
    const primary = locations[0];
    
    // Create provider
    const provider: Provider = {
      id: `prov-${npi}`,
      npi,
      contractNumber: primary['Contract #'] || '',
      referenceNumber: primary['Entity #'] || '',
      firstName: primary['First Name'] || '',
      lastName: primary['Last Name'] || '',
      middleInitial: primary['Mid Init'] || '',
      credentials: cleanCredential(primary['Suffix']),
      gender: normalizeGender(primary['Gender']),
      specialty: SPECIALTY_MAP[primary['Primary Spc Code']] || 'General Practice',
      specialtyCode: primary['Primary Spc Code'] || '',
      taxonomyCode: primary['Primary Taxonomy Code'] || '',
      secondarySpecialtyCode: primary['Secondary Spc Code'] || '',
      secondaryTaxonomyCode: primary['Secondary Taxonomy Code'] || '',
      isPrimaryCare: primary['Primary Care Flag'] === 'P',
      isBehavioralHealth: primary['Behavioral Health Flag'] === 'B',
      acceptingNewPatients: primary['Accepts New Patients'] === 'Y',
      directoryDisplay: primary['Directory Display'] === 'Y',
      languages: parseLanguages(primary['Language']),
      pricingTier: primary['Pricing Tier'] || 'Tier1',
      networkId: 'arizona-antidote',
      status: 'active',
      locations: [],
      billing: {
        npi: primary['Billing NPI'] || '',
        taxId: primary['Billing Tax ID'] || '',
        name: primary['Billing Name']?.replace(/^"|"$/g, '') || '',
        address1: primary['Billing Addr 1'] || '',
        address2: primary['Billing Addr 2'] || '',
        city: primary['Billing City'] || '',
        state: primary['Billing State'] || '',
        zip: primary['Billing Zip'] || '',
        phone: formatPhone(primary['Billing Phone'] || ''),
        fax: formatPhone(primary['Billing Fax'] || ''),
      },
      createdAt: new Date().toISOString(),
    };

    // Add all locations
    for (let i = 0; i < locations.length; i++) {
      const loc = locations[i];
      const location: ProviderLocation = {
        id: `loc-${npi}-${i}`,
        address1: loc['Address1'] || '',
        address2: loc['Address 2'] || '',
        city: loc['City'] || '',
        state: loc['State'] || '',
        zip: loc['Zip Code'] || '',
        phone: formatPhone(loc['Phone #'] || ''),
        fax: formatPhone(loc['Fax'] || ''),
        email: loc['Email'] || '',
        isPrimary: i === 0,
        hours: {
          monday: loc['Monday Hours'] || '',
          tuesday: loc['Tuesday Hours'] || '',
          wednesday: loc['Wednesday Hours'] || '',
          thursday: loc['Thursday Hours'] || '',
          friday: loc['Friday Hours'] || '',
          saturday: loc['Saturday Hours'] || '',
          sunday: loc['Sunday Hours'] || '',
        },
      };
      provider.locations.push(location);
      locationCount++;
    }

    providers.push(provider);

    // Track practice by billing org - check ALL locations for different Tax IDs
    const seenTaxIds = new Set<string>();
    
    for (const loc of locations) {
      const taxId = loc['Billing Tax ID'];
      const billingName = loc['Billing Name']?.replace(/^"|"$/g, '') || '';
      
      // Skip if we've already added this provider to this practice
      if (!taxId || !billingName || seenTaxIds.has(taxId)) continue;
      seenTaxIds.add(taxId);
      
      if (!practicesByTaxId.has(taxId)) {
        practicesByTaxId.set(taxId, {
          id: `practice-${taxId}`,
          name: billingName,
          taxId,
          npi: loc['Billing NPI'] || '',
          address1: loc['Billing Addr 1'] || '',
          address2: loc['Billing Addr 2'] || '',
          city: loc['Billing City'] || '',
          state: loc['Billing State'] || '',
          zip: loc['Billing Zip'] || '',
          phone: formatPhone(loc['Billing Phone'] || ''),
          fax: formatPhone(loc['Billing Fax'] || ''),
          providerCount: 0,
          providerIds: [],
        });
      }
      const practice = practicesByTaxId.get(taxId)!;
      practice.providerCount++;
      practice.providerIds.push(provider.id);
    }
  }

  const practices = Array.from(practicesByTaxId.values());

  // Calculate stats
  const stats = {
    totalRows: rows.length,
    uniqueProviders: providers.length,
    totalLocations: locationCount,
    practices: practices.length,
    bySpecialty: {} as Record<string, number>,
    byCity: {} as Record<string, number>,
    primaryCare: providers.filter(p => p.isPrimaryCare).length,
    behavioralHealth: providers.filter(p => p.isBehavioralHealth).length,
    acceptingNew: providers.filter(p => p.acceptingNewPatients).length,
    directoryVisible: providers.filter(p => p.directoryDisplay).length,
    byCredential: {} as Record<string, number>,
    byGender: { M: 0, F: 0, U: 0 },
  };

  for (const p of providers) {
    // By specialty
    stats.bySpecialty[p.specialty] = (stats.bySpecialty[p.specialty] || 0) + 1;
    
    // By city (from primary location)
    if (p.locations[0]) {
      const city = p.locations[0].city;
      stats.byCity[city] = (stats.byCity[city] || 0) + 1;
    }

    // By credential
    const cred = p.credentials || 'Other';
    stats.byCredential[cred] = (stats.byCredential[cred] || 0) + 1;

    // By gender
    stats.byGender[p.gender]++;
  }

  // Sort stats
  stats.bySpecialty = Object.fromEntries(
    Object.entries(stats.bySpecialty).sort((a, b) => b[1] - a[1])
  );
  stats.byCity = Object.fromEntries(
    Object.entries(stats.byCity).sort((a, b) => b[1] - a[1]).slice(0, 20)
  );
  stats.byCredential = Object.fromEntries(
    Object.entries(stats.byCredential).sort((a, b) => b[1] - a[1])
  );

  // Ensure data directory exists
  const dataDir = path.dirname(PROVIDERS_OUTPUT);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Write output files
  console.log('💾 Writing output files...');
  
  fs.writeFileSync(PROVIDERS_OUTPUT, JSON.stringify(providers, null, 2));
  console.log(`   ✅ Providers: ${PROVIDERS_OUTPUT}`);
  
  fs.writeFileSync(PRACTICES_OUTPUT, JSON.stringify(practices, null, 2));
  console.log(`   ✅ Practices: ${PRACTICES_OUTPUT}`);
  
  fs.writeFileSync(STATS_OUTPUT, JSON.stringify(stats, null, 2));
  console.log(`   ✅ Stats: ${STATS_OUTPUT}`);

  // Print summary
  console.log('\n📊 Import Summary');
  console.log('=================');
  console.log(`Total CSV Rows:      ${stats.totalRows}`);
  console.log(`Unique Providers:    ${stats.uniqueProviders}`);
  console.log(`Total Locations:     ${stats.totalLocations}`);
  console.log(`Billing Practices:   ${stats.practices}`);
  console.log(`Primary Care:        ${stats.primaryCare}`);
  console.log(`Behavioral Health:   ${stats.behavioralHealth}`);
  console.log(`Accepting New:       ${stats.acceptingNew}`);
  console.log(`Directory Visible:   ${stats.directoryVisible}`);
  
  console.log('\n👤 By Gender:');
  console.log(`   Male:    ${stats.byGender.M}`);
  console.log(`   Female:  ${stats.byGender.F}`);
  console.log(`   Unknown: ${stats.byGender.U}`);

  console.log('\n🩺 Top 10 Specialties:');
  Object.entries(stats.bySpecialty).slice(0, 10).forEach(([spec, count]) => {
    console.log(`   ${spec}: ${count}`);
  });

  console.log('\n🏙️ Top 10 Cities:');
  Object.entries(stats.byCity).slice(0, 10).forEach(([city, count]) => {
    console.log(`   ${city}: ${count}`);
  });

  console.log('\n📜 Top 10 Credentials:');
  Object.entries(stats.byCredential).slice(0, 10).forEach(([cred, count]) => {
    console.log(`   ${cred}: ${count}`);
  });

  console.log('\n✅ Import complete!');
  console.log('\nNext steps:');
  console.log('1. Review the JSON files in data/');
  console.log('2. Load into TrueCare admin dashboard');
  console.log('3. Verify provider data in UI');
}

main().catch(console.error);
