/**
 * NPPES (National Plan and Provider Enumeration System) Integration
 * Free API - No key required
 * https://npiregistry.cms.hhs.gov/api-page
 */

import { VerificationResult, NPPESResponse, NPPESProvider } from './types';

const NPPES_API_URL = 'https://npiregistry.cms.hhs.gov/api/';

export interface NPPESSearchParams {
  npi?: string;
  firstName?: string;
  lastName?: string;
  organizationName?: string;
  state?: string;
  limit?: number;
}

/**
 * Search NPPES registry for provider information
 */
export async function searchNPPES(params: NPPESSearchParams): Promise<NPPESResponse> {
  const queryParams = new URLSearchParams();
  queryParams.append('version', '2.1');
  
  if (params.npi) queryParams.append('number', params.npi);
  if (params.firstName) queryParams.append('first_name', params.firstName);
  if (params.lastName) queryParams.append('last_name', params.lastName);
  if (params.organizationName) queryParams.append('organization_name', params.organizationName);
  if (params.state) queryParams.append('state', params.state);
  queryParams.append('limit', String(params.limit || 10));

  const response = await fetch(`${NPPES_API_URL}?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`NPPES API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Verify NPI and return structured verification result
 */
export async function verifyNPI(
  npi: string,
  expectedData?: {
    firstName?: string;
    lastName?: string;
    organizationName?: string;
  }
): Promise<VerificationResult> {
  try {
    const response = await searchNPPES({ npi });

    if (response.result_count === 0) {
      return {
        status: 'FAILED',
        verificationType: 'NPI_VALIDATION',
        sourceName: 'NPPES',
        sourceUrl: 'https://npiregistry.cms.hhs.gov',
        verifiedAt: new Date(),
        reason: 'NPI not found in NPPES registry',
        severity: 'HIGH',
        rawResponse: response,
      };
    }

    const provider = response.results[0];

    // Check if NPI is deactivated
    if (provider.basic.status !== 'A') {
      return {
        status: 'FAILED',
        verificationType: 'NPI_VALIDATION',
        sourceName: 'NPPES',
        sourceUrl: 'https://npiregistry.cms.hhs.gov',
        verifiedAt: new Date(),
        reason: 'NPI has been deactivated',
        severity: 'CRITICAL',
        rawResponse: response,
      };
    }

    // Calculate match score and check for mismatches
    let matchScore = 100;
    const mismatches: string[] = [];

    if (expectedData) {
      if (expectedData.firstName && provider.basic.first_name) {
        if (expectedData.firstName.toLowerCase() !== provider.basic.first_name.toLowerCase()) {
          mismatches.push(`First name: expected "${expectedData.firstName}", found "${provider.basic.first_name}"`);
          matchScore -= 20;
        }
      }

      if (expectedData.lastName && provider.basic.last_name) {
        if (expectedData.lastName.toLowerCase() !== provider.basic.last_name.toLowerCase()) {
          mismatches.push(`Last name: expected "${expectedData.lastName}", found "${provider.basic.last_name}"`);
          matchScore -= 20;
        }
      }

      if (expectedData.organizationName && provider.basic.organization_name) {
        const expectedNorm = expectedData.organizationName.toLowerCase().replace(/[^a-z0-9]/g, '');
        const actualNorm = provider.basic.organization_name.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (!actualNorm.includes(expectedNorm) && !expectedNorm.includes(actualNorm)) {
          mismatches.push(`Organization: expected "${expectedData.organizationName}", found "${provider.basic.organization_name}"`);
          matchScore -= 15;
        }
      }
    }

    // If significant mismatches, flag for review
    if (mismatches.length > 0) {
      return {
        status: 'NEEDS_REVIEW',
        verificationType: 'NPI_VALIDATION',
        sourceName: 'NPPES',
        sourceUrl: 'https://npiregistry.cms.hhs.gov',
        verifiedAt: new Date(),
        reason: `Data mismatches found: ${mismatches.join('; ')}`,
        severity: 'MEDIUM',
        matchScore,
        parsedData: extractProviderData(provider),
        rawResponse: response,
      };
    }

    // All good!
    return {
      status: 'PASSED',
      verificationType: 'NPI_VALIDATION',
      sourceName: 'NPPES',
      sourceUrl: 'https://npiregistry.cms.hhs.gov',
      verifiedAt: new Date(),
      matchScore: 100,
      parsedData: extractProviderData(provider),
      rawResponse: response,
    };

  } catch (error) {
    return {
      status: 'ERROR',
      verificationType: 'NPI_VALIDATION',
      sourceName: 'NPPES',
      verifiedAt: new Date(),
      reason: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Extract useful data from NPPES provider record
 */
function extractProviderData(provider: NPPESProvider): Record<string, unknown> {
  const primaryTaxonomy = provider.taxonomies?.find(t => t.primary) || provider.taxonomies?.[0];
  const locationAddress = provider.addresses?.find(a => a.address_purpose === 'LOCATION') || provider.addresses?.[0];

  return {
    npi: provider.number,
    enumerationType: provider.enumeration_type,
    status: provider.basic.status === 'A' ? 'Active' : 'Deactivated',
    name: provider.basic.organization_name || 
          `${provider.basic.first_name || ''} ${provider.basic.last_name || ''}`.trim(),
    credential: provider.basic.credential,
    gender: provider.basic.gender,
    enumerationDate: provider.basic.enumeration_date,
    lastUpdated: provider.basic.last_updated,
    specialty: primaryTaxonomy?.desc,
    taxonomyCode: primaryTaxonomy?.code,
    licenseNumber: primaryTaxonomy?.license,
    licenseState: primaryTaxonomy?.state,
    address: locationAddress ? {
      line1: locationAddress.address_1,
      line2: locationAddress.address_2,
      city: locationAddress.city,
      state: locationAddress.state,
      zip: locationAddress.postal_code,
      phone: locationAddress.telephone_number,
    } : null,
  };
}
