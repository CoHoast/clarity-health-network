/**
 * OIG LEIE (List of Excluded Individuals/Entities) API
 * Checks if a provider is on the federal exclusion list
 * 
 * Data source: https://oig.hhs.gov/exclusions/downloadables/UPDATED.csv
 * Updated monthly by OIG
 */

import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

// Lazy load the data to avoid memory issues at startup
let exclusionsData: any[] | null = null;
let npiIndex: Record<string, number[]> | null = null;
let nameIndex: Record<string, number[]> | null = null;
let dataLoadError: string | null = null;

function loadData() {
  if (exclusionsData !== null) return; // Already loaded
  
  try {
    const dataDir = path.join(process.cwd(), 'data');
    
    // Load main data
    const dataPath = path.join(dataDir, 'oig-leie.json');
    if (fs.existsSync(dataPath)) {
      exclusionsData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    } else {
      throw new Error('OIG data file not found');
    }
    
    // Load NPI index
    const npiPath = path.join(dataDir, 'oig-npi-index.json');
    if (fs.existsSync(npiPath)) {
      npiIndex = JSON.parse(fs.readFileSync(npiPath, 'utf-8'));
    }
    
    // Load name index
    const namePath = path.join(dataDir, 'oig-name-index.json');
    if (fs.existsSync(namePath)) {
      nameIndex = JSON.parse(fs.readFileSync(namePath, 'utf-8'));
    }
    
  } catch (error) {
    dataLoadError = error instanceof Error ? error.message : 'Unknown error loading OIG data';
    console.error('OIG data load error:', dataLoadError);
  }
}

// Exclusion type descriptions
const exclTypeDescriptions: Record<string, string> = {
  '1128a1': 'Conviction of program-related crimes',
  '1128a2': 'Conviction relating to patient abuse or neglect',
  '1128a3': 'Felony conviction relating to health care fraud',
  '1128a4': 'Felony conviction relating to controlled substances',
  '1128b1': 'Misdemeanor conviction relating to health care fraud',
  '1128b2': 'Misdemeanor conviction relating to controlled substances',
  '1128b4': 'License revocation or suspension',
  '1128b5': 'Exclusion or suspension under federal or state health care program',
  '1128b6': 'Claims for excessive charges or unnecessary services',
  '1128b7': 'Fraud, kickbacks, and other prohibited activities',
  '1128b8': 'Entities owned or controlled by sanctioned persons',
  '1128b14': 'Default on health education loan or scholarship obligations',
  '1128b15': 'Individuals controlling a sanctioned entity',
  '1128b16': 'Making false statements or misrepresentation',
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const npi = searchParams.get('npi');
  const firstName = searchParams.get('firstName');
  const lastName = searchParams.get('lastName');
  const businessName = searchParams.get('businessName');
  
  // Load data if not already loaded
  loadData();
  
  if (dataLoadError) {
    return NextResponse.json({
      status: 'ERROR',
      error: dataLoadError,
      message: 'OIG database not available. Run: npx tsx scripts/parse-oig-leie.ts',
    }, { status: 500 });
  }
  
  if (!exclusionsData || !npiIndex || !nameIndex) {
    return NextResponse.json({
      status: 'ERROR',
      error: 'OIG data not loaded',
    }, { status: 500 });
  }
  
  const matches: any[] = [];
  const searchedParams: Record<string, string> = {};
  
  // Search by NPI (most reliable)
  if (npi && npi.length === 10) {
    searchedParams.npi = npi;
    const indices = npiIndex[npi];
    if (indices) {
      indices.forEach(idx => {
        if (exclusionsData && exclusionsData[idx]) {
          matches.push(exclusionsData[idx]);
        }
      });
    }
  }
  
  // Search by last name (if no NPI match)
  if (matches.length === 0 && lastName) {
    const normalizedLast = lastName.toUpperCase().trim();
    searchedParams.lastName = lastName;
    
    const indices = nameIndex[normalizedLast];
    if (indices) {
      indices.forEach(idx => {
        if (exclusionsData && exclusionsData[idx]) {
          const record = exclusionsData[idx];
          // If firstName provided, check for match
          if (firstName) {
            searchedParams.firstName = firstName;
            const normalizedFirst = firstName.toUpperCase().trim();
            if (record.firstName.toUpperCase().startsWith(normalizedFirst) ||
                normalizedFirst.startsWith(record.firstName.toUpperCase())) {
              matches.push(record);
            }
          } else {
            matches.push(record);
          }
        }
      });
    }
  }
  
  // Search by business name
  if (matches.length === 0 && businessName) {
    const normalizedBus = businessName.toUpperCase().trim();
    searchedParams.businessName = businessName;
    
    // Check if any part of business name is in index
    for (const [indexName, indices] of Object.entries(nameIndex)) {
      if (normalizedBus.includes(indexName) || indexName.includes(normalizedBus)) {
        indices.forEach(idx => {
          if (exclusionsData && exclusionsData[idx]) {
            const record = exclusionsData[idx];
            if (record.busName) {
              matches.push(record);
            }
          }
        });
      }
    }
  }
  
  // No matches = clear
  if (matches.length === 0) {
    return NextResponse.json({
      status: 'CLEAR',
      excluded: false,
      message: 'No exclusion records found',
      searched: searchedParams,
      databaseInfo: {
        recordCount: exclusionsData.length,
        source: 'OIG LEIE',
        sourceUrl: 'https://oig.hhs.gov/exclusions',
      },
    });
  }
  
  // Found exclusion(s)!
  const formattedMatches = matches.map(m => ({
    type: m.busName ? 'organization' : 'individual',
    name: m.busName || `${m.firstName} ${m.midName} ${m.lastName}`.replace(/\s+/g, ' ').trim(),
    npi: m.npi !== '0000000000' ? m.npi : null,
    specialty: m.specialty,
    state: m.state,
    exclusionType: m.exclType,
    exclusionTypeDescription: exclTypeDescriptions[m.exclType] || m.exclType,
    exclusionDate: m.exclDate,
    reinstateDate: m.reinDate || null,
    waiverDate: m.waiverDate || null,
    waiverState: m.wvrState || null,
  }));
  
  return NextResponse.json({
    status: 'EXCLUDED',
    excluded: true,
    message: `Found ${matches.length} exclusion record(s)`,
    matches: formattedMatches,
    searched: searchedParams,
    severity: 'CRITICAL',
    databaseInfo: {
      recordCount: exclusionsData.length,
      source: 'OIG LEIE',
      sourceUrl: 'https://oig.hhs.gov/exclusions',
    },
  });
}
