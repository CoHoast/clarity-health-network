/**
 * OIG LEIE (List of Excluded Individuals/Entities) Integration
 * https://oig.hhs.gov/exclusions/exclusions_list.asp
 * 
 * The OIG provides a downloadable CSV file that should be synced monthly.
 * For demo purposes, we simulate the check with a known exclusion list.
 */

import { VerificationResult } from './types';

// Simulated exclusion list for demo (in production, this would be a database table)
const DEMO_EXCLUSIONS = [
  { firstName: 'MICHAEL', lastName: 'BROWN', npi: '1122334455', excludedDate: '2024-01-15', reason: 'Patient Abuse' },
  { firstName: 'ROBERT', lastName: 'JOHNSON', npi: '9988776655', excludedDate: '2023-06-01', reason: 'License Revocation' },
];

/**
 * Check if a provider is on the OIG exclusion list
 */
export async function checkOIGExclusion(
  firstName: string,
  lastName: string,
  npi?: string
): Promise<VerificationResult> {
  try {
    // Normalize names for comparison
    const normalizedFirst = firstName.toUpperCase().trim();
    const normalizedLast = lastName.toUpperCase().trim();

    // Search for match (in production, this would query a database)
    const match = DEMO_EXCLUSIONS.find(e => {
      // Check by NPI first (most reliable)
      if (npi && e.npi === npi) return true;
      
      // Check by name match
      return e.firstName === normalizedFirst && e.lastName === normalizedLast;
    });

    if (match) {
      return {
        status: 'FAILED',
        verificationType: 'OIG_EXCLUSION',
        sourceName: 'OIG LEIE',
        sourceUrl: 'https://oig.hhs.gov/exclusions',
        verifiedAt: new Date(),
        reason: `Provider is EXCLUDED from federal healthcare programs. Exclusion date: ${match.excludedDate}. Reason: ${match.reason}`,
        severity: 'CRITICAL',
        parsedData: {
          excluded: true,
          excludedDate: match.excludedDate,
          reason: match.reason,
          matchedBy: npi && match.npi === npi ? 'NPI' : 'Name',
        },
      };
    }

    // Not found on exclusion list - this is good!
    return {
      status: 'PASSED',
      verificationType: 'OIG_EXCLUSION',
      sourceName: 'OIG LEIE',
      sourceUrl: 'https://oig.hhs.gov/exclusions',
      verifiedAt: new Date(),
      parsedData: {
        excluded: false,
        searchedName: `${firstName} ${lastName}`,
        searchedNpi: npi || 'N/A',
        databaseDate: new Date().toISOString().split('T')[0], // Simulated last update
      },
    };

  } catch (error) {
    return {
      status: 'ERROR',
      verificationType: 'OIG_EXCLUSION',
      sourceName: 'OIG LEIE',
      verifiedAt: new Date(),
      reason: error instanceof Error ? error.message : 'Unknown error checking OIG exclusion list',
    };
  }
}

/**
 * In production, this would sync the OIG LEIE database
 * The OIG provides a downloadable CSV file updated monthly
 */
export async function syncOIGDatabase(): Promise<{ success: boolean; recordCount: number; syncDate: Date }> {
  // This would download from: https://oig.hhs.gov/exclusions/downloadables/UPDATED.csv
  // Parse the CSV and upsert into database
  
  // For demo, just return success
  return {
    success: true,
    recordCount: DEMO_EXCLUSIONS.length,
    syncDate: new Date(),
  };
}
