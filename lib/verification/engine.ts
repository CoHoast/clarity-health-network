/**
 * Verification Engine
 * Orchestrates all primary source verifications for provider credentialing
 */

import { verifyNPI } from './nppes';
import { checkOIGExclusion } from './oig';
import { checkSAMExclusion, checkSAMIndividualExclusion } from './sam';
import {
  VerificationResult,
  VerificationSummary,
  VerificationType,
  ProviderVerificationRequest,
} from './types';

// Default verifications to run for different provider types
const DEFAULT_VERIFICATIONS: Record<string, VerificationType[]> = {
  individual: ['NPI_VALIDATION', 'OIG_EXCLUSION', 'SAM_EXCLUSION'],
  organization: ['NPI_VALIDATION', 'OIG_EXCLUSION', 'SAM_EXCLUSION'],
};

/**
 * Run all verifications for a provider
 */
export async function runVerifications(
  request: ProviderVerificationRequest
): Promise<{
  results: Record<string, VerificationResult>;
  summary: VerificationSummary;
}> {
  const startTime = Date.now();
  const results: Record<string, VerificationResult> = {};
  const criticalIssues: string[] = [];

  // Determine which verifications to run
  const verificationsToRun = request.verificationsToRun || 
    DEFAULT_VERIFICATIONS[request.providerType || 'individual'];

  // If we don't have name info but have NPI, get it from NPPES first
  let enrichedRequest = { ...request };
  
  if (!request.firstName && !request.lastName && !request.organizationName && request.npi) {
    // Run NPPES first to get name info
    const npiResult = await verifyNPI(request.npi, {});
    results['NPI_VALIDATION'] = npiResult;
    
    // Extract name from NPPES result
    if (npiResult.status === 'PASSED' && npiResult.parsedData) {
      const data = npiResult.parsedData as Record<string, any>;
      if (data.firstName && data.lastName) {
        enrichedRequest.firstName = data.firstName;
        enrichedRequest.lastName = data.lastName;
      } else if (data.organizationName) {
        enrichedRequest.organizationName = data.organizationName;
      }
    }
  }

  // Run remaining verifications
  const remainingVerifications = verificationsToRun.filter(
    type => !results[type] // Skip if already done (like NPI_VALIDATION above)
  );

  const verificationPromises = remainingVerifications.map(async (type) => {
    let result: VerificationResult;

    try {
      switch (type) {
        case 'NPI_VALIDATION':
          result = await verifyNPI(enrichedRequest.npi, {
            firstName: enrichedRequest.firstName,
            lastName: enrichedRequest.lastName,
            organizationName: enrichedRequest.organizationName,
          });
          break;

        case 'OIG_EXCLUSION':
          if (enrichedRequest.organizationName) {
            // For organizations, search by org name
            result = await checkOIGExclusion(
              enrichedRequest.organizationName,
              '',
              enrichedRequest.npi
            );
          } else if (enrichedRequest.firstName && enrichedRequest.lastName) {
            result = await checkOIGExclusion(
              enrichedRequest.firstName,
              enrichedRequest.lastName,
              enrichedRequest.npi
            );
          } else {
            result = {
              status: 'ERROR',
              verificationType: 'OIG_EXCLUSION',
              sourceName: 'OIG LEIE',
              verifiedAt: new Date(),
              reason: 'Missing required name information for OIG check',
            };
          }
          break;

        case 'SAM_EXCLUSION':
          if (enrichedRequest.organizationName) {
            result = await checkSAMExclusion(enrichedRequest.organizationName);
          } else if (enrichedRequest.firstName && enrichedRequest.lastName) {
            result = await checkSAMIndividualExclusion(
              enrichedRequest.firstName,
              enrichedRequest.lastName
            );
          } else {
            result = {
              status: 'ERROR',
              verificationType: 'SAM_EXCLUSION',
              sourceName: 'SAM.gov',
              verifiedAt: new Date(),
              reason: 'Missing required name information for SAM check',
            };
          }
          break;

        default:
          result = {
            status: 'PENDING',
            verificationType: type,
            sourceName: 'Manual',
            verifiedAt: new Date(),
            reason: 'Manual verification required',
          };
      }
    } catch (error) {
      result = {
        status: 'ERROR',
        verificationType: type,
        sourceName: 'Unknown',
        verifiedAt: new Date(),
        reason: error instanceof Error ? error.message : 'Unknown error',
      };
    }

    // Track critical issues
    if (result.status === 'FAILED' && result.severity === 'CRITICAL') {
      criticalIssues.push(`${type}: ${result.reason}`);
    }

    results[type] = result;
  });

  await Promise.all(verificationPromises);

  // Generate summary
  const summary = generateSummary(request, results, criticalIssues, Date.now() - startTime);

  return { results, summary };
}

/**
 * Generate verification summary with recommendation
 */
function generateSummary(
  request: ProviderVerificationRequest,
  results: Record<string, VerificationResult>,
  criticalIssues: string[],
  processingTimeMs: number
): VerificationSummary {
  const resultValues = Object.values(results);
  
  const passed = resultValues.filter(r => r.status === 'PASSED').length;
  const failed = resultValues.filter(r => r.status === 'FAILED').length;
  const pending = resultValues.filter(r => r.status === 'PENDING').length;
  const needsReview = resultValues.filter(r => r.status === 'NEEDS_REVIEW').length;
  const errors = resultValues.filter(r => r.status === 'ERROR').length;

  // Determine recommendation
  let recommendation: 'AUTO_APPROVE' | 'NEEDS_REVIEW' | 'AUTO_DENY';
  
  if (criticalIssues.length > 0 || failed > 0) {
    recommendation = 'AUTO_DENY';
  } else if (needsReview > 0 || errors > 0) {
    recommendation = 'NEEDS_REVIEW';
  } else if (passed === resultValues.length) {
    recommendation = 'AUTO_APPROVE';
  } else {
    recommendation = 'NEEDS_REVIEW';
  }

  return {
    npi: request.npi,
    total: resultValues.length,
    passed,
    failed,
    pending,
    needsReview,
    errors,
    criticalIssues,
    recommendation,
    completedAt: new Date(),
    processingTimeMs,
  };
}

/**
 * Run a single verification type
 */
export async function runSingleVerification(
  type: VerificationType,
  request: ProviderVerificationRequest
): Promise<VerificationResult> {
  const { results } = await runVerifications({
    ...request,
    verificationsToRun: [type],
  });
  
  return results[type];
}
