/**
 * SAM.gov (System for Award Management) Integration
 * https://api.sam.gov/
 * 
 * SAM.gov provides exclusion/debarment data for federal contractors.
 * API requires free registration at SAM.gov to get an API key.
 * 
 * For demo purposes, we simulate the check.
 */

import { VerificationResult } from './types';

// SAM.gov API key would be stored in environment variables
const SAM_API_KEY = process.env.SAM_API_KEY || '';

// Simulated exclusion list for demo
const DEMO_SAM_EXCLUSIONS = [
  { name: 'FRAUDULENT MEDICAL SERVICES LLC', type: 'organization', excludedDate: '2023-08-15', reason: 'Debarment' },
];

/**
 * Check if an entity is excluded/debarred in SAM.gov
 */
export async function checkSAMExclusion(
  entityName: string,
  options?: {
    taxId?: string;
    npi?: string;
  }
): Promise<VerificationResult> {
  try {
    // In production with API key, we would call the real API:
    // GET https://api.sam.gov/entity-information/v3/entities?api_key=${SAM_API_KEY}&legalBusinessName=${entityName}
    
    // For demo, check against simulated list
    const normalizedName = entityName.toUpperCase().trim();
    
    const match = DEMO_SAM_EXCLUSIONS.find(e => {
      const normalizedExcludedName = e.name.toUpperCase();
      return normalizedExcludedName.includes(normalizedName) || normalizedName.includes(normalizedExcludedName);
    });

    if (match) {
      return {
        status: 'FAILED',
        verificationType: 'SAM_EXCLUSION',
        sourceName: 'SAM.gov',
        sourceUrl: 'https://sam.gov',
        verifiedAt: new Date(),
        reason: `Entity is EXCLUDED/DEBARRED in SAM.gov. Date: ${match.excludedDate}. Reason: ${match.reason}`,
        severity: 'CRITICAL',
        parsedData: {
          excluded: true,
          excludedDate: match.excludedDate,
          reason: match.reason,
          entityType: match.type,
        },
      };
    }

    // Not found - clear
    return {
      status: 'PASSED',
      verificationType: 'SAM_EXCLUSION',
      sourceName: 'SAM.gov',
      sourceUrl: 'https://sam.gov',
      verifiedAt: new Date(),
      parsedData: {
        excluded: false,
        searchedEntity: entityName,
        searchedTaxId: options?.taxId || 'N/A',
        databaseDate: new Date().toISOString().split('T')[0],
      },
    };

  } catch (error) {
    return {
      status: 'ERROR',
      verificationType: 'SAM_EXCLUSION',
      sourceName: 'SAM.gov',
      verifiedAt: new Date(),
      reason: error instanceof Error ? error.message : 'Unknown error checking SAM.gov',
    };
  }
}

/**
 * Check individual by name in SAM.gov
 */
export async function checkSAMIndividualExclusion(
  firstName: string,
  lastName: string
): Promise<VerificationResult> {
  const fullName = `${firstName} ${lastName}`;
  return checkSAMExclusion(fullName);
}
