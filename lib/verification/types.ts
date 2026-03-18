/**
 * Verification Types for Provider Credentialing
 */

export type VerificationStatus = 
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'PASSED'
  | 'FAILED'
  | 'NEEDS_REVIEW'
  | 'ERROR';

export type VerificationType =
  | 'NPI_VALIDATION'
  | 'OIG_EXCLUSION'
  | 'SAM_EXCLUSION'
  | 'STATE_LICENSE'
  | 'DEA_REGISTRATION'
  | 'BOARD_CERTIFICATION'
  | 'MALPRACTICE_INSURANCE';

export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface VerificationResult {
  status: VerificationStatus;
  verificationType: VerificationType;
  sourceName: string;
  sourceUrl?: string;
  verifiedAt: Date;
  expiresAt?: Date;
  reason?: string;
  severity?: AlertSeverity;
  rawResponse?: unknown;
  parsedData?: Record<string, unknown>;
  notes?: string;
  matchScore?: number;
}

export interface VerificationSummary {
  applicationId?: string;
  providerId?: string;
  npi: string;
  total: number;
  passed: number;
  failed: number;
  pending: number;
  needsReview: number;
  errors: number;
  criticalIssues: string[];
  recommendation: 'AUTO_APPROVE' | 'NEEDS_REVIEW' | 'AUTO_DENY';
  completedAt: Date;
  processingTimeMs: number;
}

export interface ProviderVerificationRequest {
  npi: string;
  firstName?: string;
  lastName?: string;
  organizationName?: string;
  providerType?: 'individual' | 'organization';
  verificationsToRun?: VerificationType[];
}

export interface NPPESProvider {
  number: string;
  enumeration_type: 'NPI-1' | 'NPI-2';
  basic: {
    first_name?: string;
    last_name?: string;
    middle_name?: string;
    credential?: string;
    sole_proprietor?: string;
    gender?: string;
    enumeration_date?: string;
    last_updated?: string;
    status: 'A' | 'D';
    name_prefix?: string;
    name_suffix?: string;
    organization_name?: string;
  };
  taxonomies: Array<{
    code: string;
    taxonomy_group?: string;
    desc: string;
    state?: string;
    license?: string;
    primary: boolean;
  }>;
  addresses: Array<{
    country_code: string;
    country_name: string;
    address_purpose: 'LOCATION' | 'MAILING';
    address_type: string;
    address_1: string;
    address_2?: string;
    city: string;
    state: string;
    postal_code: string;
    telephone_number?: string;
    fax_number?: string;
  }>;
}

export interface NPPESResponse {
  result_count: number;
  results: NPPESProvider[];
}
