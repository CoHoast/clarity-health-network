/**
 * Credentialing Engine
 * 
 * Provider credentialing verification and management.
 * Verifies licenses, NPI, DEA, sanctions, malpractice, and board certifications.
 */

// ============================================================================
// TYPES
// ============================================================================

export type CredentialType = 
  | 'NPI'
  | 'STATE_LICENSE'
  | 'DEA'
  | 'BOARD_CERTIFICATION'
  | 'MALPRACTICE'
  | 'EDUCATION'
  | 'WORK_HISTORY'
  | 'SANCTIONS'
  | 'BACKGROUND';

export type VerificationStatus = 
  | 'VERIFIED'
  | 'PENDING'
  | 'EXPIRED'
  | 'FAILED'
  | 'NOT_FOUND'
  | 'FLAGGED';

export type CredentialingRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface CredentialCheck {
  type: CredentialType;
  status: VerificationStatus;
  verifiedAt?: string;
  expiresAt?: string;
  source: string;
  details: Record<string, unknown>;
  flags?: string[];
}

export interface SanctionResult {
  found: boolean;
  database: string;
  entries: Array<{
    source: string;
    date: string;
    reason?: string;
    status: string;
  }>;
}

export interface ProviderCredentials {
  npi: string;
  name: string;
  credentials: string[];
  specialty: string;
  taxonomyCode: string;
}

export interface CredentialingRequest {
  npi: string;
  firstName?: string;
  lastName?: string;
  organizationName?: string;
  providerType: 'INDIVIDUAL' | 'ORGANIZATION';
  stateLicenseNumber?: string;
  stateLicenseState?: string;
  deaNumber?: string;
  taxonomyCode?: string;
}

export interface CredentialingResult {
  npi: string;
  transactionId: string;
  timestamp: string;
  processingTimeMs: number;
  
  // Provider Info
  provider: {
    name: string;
    type: string;
    credentials: string[];
    specialty: string;
    taxonomyCode: string;
    address: {
      line1: string;
      city: string;
      state: string;
      zip: string;
    };
    phone?: string;
  };
  
  // Overall Status
  overallStatus: VerificationStatus;
  riskLevel: CredentialingRiskLevel;
  credentialingScore: number; // 0-100
  
  // Individual Checks
  checks: CredentialCheck[];
  
  // Sanctions
  sanctions: SanctionResult;
  
  // Recommendations
  recommendations: string[];
  
  // Summary
  summary: string;
}

// ============================================================================
// MOCK DATA - NPI Registry
// ============================================================================

interface NPIRecord {
  npi: string;
  type: 'INDIVIDUAL' | 'ORGANIZATION';
  name: string;
  credentials: string[];
  specialty: string;
  taxonomyCode: string;
  taxonomyDescription: string;
  address: {
    line1: string;
    city: string;
    state: string;
    zip: string;
  };
  phone: string;
  enumerationDate: string;
  lastUpdated: string;
}

const NPI_REGISTRY: Record<string, NPIRecord> = {
  '1234567890': {
    npi: '1234567890',
    type: 'ORGANIZATION',
    name: 'Cleveland Family Medicine',
    credentials: [],
    specialty: 'Family Medicine',
    taxonomyCode: '207Q00000X',
    taxonomyDescription: 'Family Medicine',
    address: { line1: '1234 Health Ave', city: 'Cleveland', state: 'OH', zip: '44101' },
    phone: '(216) 555-0100',
    enumerationDate: '2008-05-15',
    lastUpdated: '2024-01-10',
  },
  '2345678901': {
    npi: '2345678901',
    type: 'INDIVIDUAL',
    name: 'James Wilson, MD',
    credentials: ['MD', 'FACP'],
    specialty: 'Internal Medicine',
    taxonomyCode: '207R00000X',
    taxonomyDescription: 'Internal Medicine',
    address: { line1: '5678 Medical Pkwy', city: 'Cleveland', state: 'OH', zip: '44106' },
    phone: '(216) 555-0200',
    enumerationDate: '2005-03-20',
    lastUpdated: '2023-11-15',
  },
  '3456789012': {
    npi: '3456789012',
    type: 'ORGANIZATION',
    name: 'Metro Imaging Center',
    credentials: [],
    specialty: 'Diagnostic Radiology',
    taxonomyCode: '2085R0202X',
    taxonomyDescription: 'Diagnostic Radiology',
    address: { line1: '9012 Imaging Dr', city: 'Cleveland', state: 'OH', zip: '44114' },
    phone: '(216) 555-0300',
    enumerationDate: '2010-08-01',
    lastUpdated: '2024-02-20',
  },
  '4567890123': {
    npi: '4567890123',
    type: 'ORGANIZATION',
    name: 'Cleveland Orthopedic Associates',
    credentials: [],
    specialty: 'Orthopedic Surgery',
    taxonomyCode: '207X00000X',
    taxonomyDescription: 'Orthopedic Surgery',
    address: { line1: '3456 Bone & Joint Blvd', city: 'Cleveland', state: 'OH', zip: '44120' },
    phone: '(216) 555-0400',
    enumerationDate: '2012-01-15',
    lastUpdated: '2023-09-30',
  },
  '5678901234': {
    npi: '5678901234',
    type: 'ORGANIZATION',
    name: 'Quick Care Urgent Care',
    credentials: [],
    specialty: 'Urgent Care',
    taxonomyCode: '261QU0200X',
    taxonomyDescription: 'Urgent Care Clinic',
    address: { line1: '7890 Fast Lane', city: 'Cleveland', state: 'OH', zip: '44125' },
    phone: '(216) 555-0500',
    enumerationDate: '2015-06-01',
    lastUpdated: '2024-01-05',
  },
  '9012345678': {
    npi: '9012345678',
    type: 'INDIVIDUAL',
    name: 'Sarah Chen, MD, FACC',
    credentials: ['MD', 'FACC'],
    specialty: 'Cardiovascular Disease',
    taxonomyCode: '207RC0000X',
    taxonomyDescription: 'Cardiovascular Disease',
    address: { line1: '1234 Heart Center Dr', city: 'Cleveland', state: 'OH', zip: '44195' },
    phone: '(216) 555-0600',
    enumerationDate: '2003-09-10',
    lastUpdated: '2024-02-01',
  },
  '1111111111': {
    npi: '1111111111',
    type: 'ORGANIZATION',
    name: 'ABC Medical Group',
    credentials: [],
    specialty: 'Multi-Specialty',
    taxonomyCode: '207Q00000X',
    taxonomyDescription: 'Family Medicine',
    address: { line1: '999 Suspicious St', city: 'Cleveland', state: 'OH', zip: '44199' },
    phone: '(216) 555-9999',
    enumerationDate: '2024-01-01',
    lastUpdated: '2024-01-01',
  },
};

// ============================================================================
// MOCK DATA - State Licenses
// ============================================================================

interface StateLicense {
  licenseNumber: string;
  state: string;
  type: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'REVOKED' | 'EXPIRED';
  issueDate: string;
  expirationDate: string;
  disciplinaryActions: boolean;
}

const STATE_LICENSES: Record<string, StateLicense[]> = {
  '2345678901': [
    { licenseNumber: 'MD-35-123456', state: 'OH', type: 'MD', status: 'ACTIVE', issueDate: '2005-06-15', expirationDate: '2026-06-30', disciplinaryActions: false },
    { licenseNumber: 'PA-MD-789012', state: 'PA', type: 'MD', status: 'ACTIVE', issueDate: '2010-03-01', expirationDate: '2025-03-31', disciplinaryActions: false },
  ],
  '9012345678': [
    { licenseNumber: 'MD-35-234567', state: 'OH', type: 'MD', status: 'ACTIVE', issueDate: '2003-12-01', expirationDate: '2025-12-31', disciplinaryActions: false },
  ],
  '1111111111': [
    { licenseNumber: 'MD-35-999999', state: 'OH', type: 'MD', status: 'SUSPENDED', issueDate: '2020-01-01', expirationDate: '2024-01-01', disciplinaryActions: true },
  ],
};

// ============================================================================
// MOCK DATA - DEA Registrations
// ============================================================================

interface DEARegistration {
  deaNumber: string;
  name: string;
  schedules: string[];
  expirationDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'REVOKED';
}

const DEA_REGISTRATIONS: Record<string, DEARegistration> = {
  '2345678901': { deaNumber: 'AW1234567', name: 'JAMES WILSON MD', schedules: ['2', '2N', '3', '3N', '4', '5'], expirationDate: '2026-04-30', status: 'ACTIVE' },
  '9012345678': { deaNumber: 'AC2345678', name: 'SARAH CHEN MD', schedules: ['2', '2N', '3', '3N', '4', '5'], expirationDate: '2025-08-31', status: 'ACTIVE' },
};

// ============================================================================
// MOCK DATA - Board Certifications
// ============================================================================

interface BoardCertification {
  board: string;
  specialty: string;
  certificationDate: string;
  expirationDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  isMOCCompliant: boolean;
}

const BOARD_CERTIFICATIONS: Record<string, BoardCertification[]> = {
  '2345678901': [
    { board: 'ABIM', specialty: 'Internal Medicine', certificationDate: '2008-01-15', expirationDate: '2028-01-15', status: 'ACTIVE', isMOCCompliant: true },
  ],
  '9012345678': [
    { board: 'ABIM', specialty: 'Internal Medicine', certificationDate: '2006-07-01', expirationDate: '2026-07-01', status: 'ACTIVE', isMOCCompliant: true },
    { board: 'ABIM', specialty: 'Cardiovascular Disease', certificationDate: '2009-01-15', expirationDate: '2029-01-15', status: 'ACTIVE', isMOCCompliant: true },
  ],
};

// ============================================================================
// MOCK DATA - Sanctions
// ============================================================================

const SANCTIONED_PROVIDERS: Record<string, Array<{ source: string; date: string; reason: string; status: string }>> = {
  '9999999999': [
    { source: 'OIG LEIE', date: '2020-05-15', reason: 'Healthcare fraud conviction', status: 'ACTIVE' },
  ],
  '8888888888': [
    { source: 'SAM.gov', date: '2019-11-01', reason: 'False claims', status: 'ACTIVE' },
  ],
  '1111111111': [
    { source: 'OH State Medical Board', date: '2023-06-15', reason: 'Inappropriate prescribing', status: 'SUSPENDED' },
  ],
};

// ============================================================================
// CREDENTIALING ENGINE
// ============================================================================

export class CredentialingEngine {
  /**
   * Run full credentialing verification
   */
  async verifyProvider(request: CredentialingRequest): Promise<CredentialingResult> {
    const startTime = Date.now();
    const transactionId = `CRD-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    
    const checks: CredentialCheck[] = [];
    const recommendations: string[] = [];
    
    // 1. NPI Verification
    const npiCheck = await this.verifyNPI(request.npi);
    checks.push(npiCheck);
    
    const npiRecord = NPI_REGISTRY[request.npi];
    
    if (!npiRecord) {
      return this.buildResult(request, transactionId, startTime, {
        provider: {
          name: request.organizationName || `${request.firstName} ${request.lastName}` || 'Unknown',
          type: request.providerType,
          credentials: [],
          specialty: 'Unknown',
          taxonomyCode: request.taxonomyCode || 'Unknown',
          address: { line1: '', city: '', state: '', zip: '' },
        },
        overallStatus: 'NOT_FOUND',
        riskLevel: 'CRITICAL',
        credentialingScore: 0,
        checks,
        sanctions: { found: false, database: 'OIG LEIE, SAM.gov, State Boards', entries: [] },
        recommendations: ['NPI not found in NPPES registry. Cannot proceed with credentialing.'],
        summary: 'Provider NPI not found. Credentialing cannot proceed.',
      });
    }
    
    // 2. State License Verification (for individuals)
    if (npiRecord.type === 'INDIVIDUAL') {
      const licenseCheck = await this.verifyStateLicense(request.npi, request.stateLicenseState || 'OH');
      checks.push(licenseCheck);
      
      if (licenseCheck.status === 'EXPIRED') {
        recommendations.push('State medical license is expired. Renewal required before credentialing.');
      } else if (licenseCheck.status === 'FLAGGED') {
        recommendations.push('Disciplinary actions found on state license. Manual review required.');
      }
    }
    
    // 3. DEA Verification (for prescribers)
    if (npiRecord.type === 'INDIVIDUAL') {
      const deaCheck = await this.verifyDEA(request.npi);
      checks.push(deaCheck);
      
      if (deaCheck.status === 'NOT_FOUND') {
        recommendations.push('No DEA registration found. Provider may not be able to prescribe controlled substances.');
      }
    }
    
    // 4. Board Certification (for individuals)
    if (npiRecord.type === 'INDIVIDUAL') {
      const boardCheck = await this.verifyBoardCertification(request.npi);
      checks.push(boardCheck);
      
      if (boardCheck.status === 'NOT_FOUND') {
        recommendations.push('No board certification found. Consider requiring certification for network participation.');
      }
    }
    
    // 5. Sanctions Check (always)
    const sanctionsResult = await this.checkSanctions(request.npi);
    const sanctionCheck: CredentialCheck = {
      type: 'SANCTIONS',
      status: sanctionsResult.found ? 'FLAGGED' : 'VERIFIED',
      verifiedAt: new Date().toISOString(),
      source: 'OIG LEIE, SAM.gov, State Boards',
      details: { entries: sanctionsResult.entries },
      flags: sanctionsResult.found ? ['SANCTION_FOUND'] : [],
    };
    checks.push(sanctionCheck);
    
    if (sanctionsResult.found) {
      recommendations.push('CRITICAL: Sanctions found. Provider cannot be credentialed until sanctions are resolved.');
    }
    
    // 6. Malpractice Check (mock)
    const malpracticeCheck = await this.verifyMalpractice(request.npi);
    checks.push(malpracticeCheck);
    
    // Calculate overall status and score
    const { overallStatus, riskLevel, credentialingScore } = this.calculateOverallStatus(checks, sanctionsResult);
    
    // Generate summary
    const summary = this.generateSummary(npiRecord, checks, sanctionsResult, overallStatus);
    
    return this.buildResult(request, transactionId, startTime, {
      provider: {
        name: npiRecord.name,
        type: npiRecord.type,
        credentials: npiRecord.credentials,
        specialty: npiRecord.specialty,
        taxonomyCode: npiRecord.taxonomyCode,
        address: npiRecord.address,
        phone: npiRecord.phone,
      },
      overallStatus,
      riskLevel,
      credentialingScore,
      checks,
      sanctions: sanctionsResult,
      recommendations,
      summary,
    });
  }

  /**
   * Verify NPI in NPPES registry
   */
  private async verifyNPI(npi: string): Promise<CredentialCheck> {
    const record = NPI_REGISTRY[npi];
    
    if (!record) {
      return {
        type: 'NPI',
        status: 'NOT_FOUND',
        source: 'NPPES',
        details: { npi, message: 'NPI not found in NPPES registry' },
      };
    }
    
    return {
      type: 'NPI',
      status: 'VERIFIED',
      verifiedAt: new Date().toISOString(),
      source: 'NPPES',
      details: {
        npi: record.npi,
        name: record.name,
        type: record.type,
        taxonomyCode: record.taxonomyCode,
        taxonomyDescription: record.taxonomyDescription,
        enumerationDate: record.enumerationDate,
        lastUpdated: record.lastUpdated,
      },
    };
  }

  /**
   * Verify state medical license
   */
  private async verifyStateLicense(npi: string, state: string): Promise<CredentialCheck> {
    const licenses = STATE_LICENSES[npi];
    
    if (!licenses || licenses.length === 0) {
      return {
        type: 'STATE_LICENSE',
        status: 'NOT_FOUND',
        source: `${state} State Medical Board`,
        details: { message: 'No state license found' },
      };
    }
    
    const stateLicense = licenses.find(l => l.state === state) || licenses[0];
    const isExpired = new Date(stateLicense.expirationDate) < new Date();
    
    let status: VerificationStatus = 'VERIFIED';
    const flags: string[] = [];
    
    if (stateLicense.status === 'SUSPENDED' || stateLicense.status === 'REVOKED') {
      status = 'FAILED';
      flags.push('LICENSE_' + stateLicense.status);
    } else if (isExpired || stateLicense.status === 'EXPIRED') {
      status = 'EXPIRED';
      flags.push('LICENSE_EXPIRED');
    } else if (stateLicense.disciplinaryActions) {
      status = 'FLAGGED';
      flags.push('DISCIPLINARY_ACTIONS');
    }
    
    return {
      type: 'STATE_LICENSE',
      status,
      verifiedAt: new Date().toISOString(),
      expiresAt: stateLicense.expirationDate,
      source: `${stateLicense.state} State Medical Board`,
      details: {
        licenseNumber: stateLicense.licenseNumber,
        state: stateLicense.state,
        type: stateLicense.type,
        status: stateLicense.status,
        issueDate: stateLicense.issueDate,
        expirationDate: stateLicense.expirationDate,
        disciplinaryActions: stateLicense.disciplinaryActions,
      },
      flags: flags.length > 0 ? flags : undefined,
    };
  }

  /**
   * Verify DEA registration
   */
  private async verifyDEA(npi: string): Promise<CredentialCheck> {
    const dea = DEA_REGISTRATIONS[npi];
    
    if (!dea) {
      return {
        type: 'DEA',
        status: 'NOT_FOUND',
        source: 'DEA NTIS',
        details: { message: 'No DEA registration found' },
      };
    }
    
    const isExpired = new Date(dea.expirationDate) < new Date();
    
    return {
      type: 'DEA',
      status: isExpired ? 'EXPIRED' : (dea.status === 'ACTIVE' ? 'VERIFIED' : 'FAILED'),
      verifiedAt: new Date().toISOString(),
      expiresAt: dea.expirationDate,
      source: 'DEA NTIS',
      details: {
        deaNumber: dea.deaNumber,
        name: dea.name,
        schedules: dea.schedules,
        expirationDate: dea.expirationDate,
        status: dea.status,
      },
      flags: isExpired ? ['DEA_EXPIRED'] : undefined,
    };
  }

  /**
   * Verify board certification
   */
  private async verifyBoardCertification(npi: string): Promise<CredentialCheck> {
    const certs = BOARD_CERTIFICATIONS[npi];
    
    if (!certs || certs.length === 0) {
      return {
        type: 'BOARD_CERTIFICATION',
        status: 'NOT_FOUND',
        source: 'ABMS',
        details: { message: 'No board certification found' },
      };
    }
    
    const activeCerts = certs.filter(c => c.status === 'ACTIVE');
    const hasExpired = certs.some(c => new Date(c.expirationDate) < new Date());
    
    return {
      type: 'BOARD_CERTIFICATION',
      status: activeCerts.length > 0 ? 'VERIFIED' : (hasExpired ? 'EXPIRED' : 'NOT_FOUND'),
      verifiedAt: new Date().toISOString(),
      expiresAt: activeCerts.length > 0 ? activeCerts[0].expirationDate : undefined,
      source: 'ABMS',
      details: {
        certifications: certs.map(c => ({
          board: c.board,
          specialty: c.specialty,
          certificationDate: c.certificationDate,
          expirationDate: c.expirationDate,
          status: c.status,
          isMOCCompliant: c.isMOCCompliant,
        })),
      },
    };
  }

  /**
   * Check sanctions databases
   */
  private async checkSanctions(npi: string): Promise<SanctionResult> {
    const sanctions = SANCTIONED_PROVIDERS[npi];
    
    return {
      found: !!sanctions && sanctions.length > 0,
      database: 'OIG LEIE, SAM.gov, State Boards',
      entries: sanctions || [],
    };
  }

  /**
   * Verify malpractice insurance (mock)
   */
  private async verifyMalpractice(npi: string): Promise<CredentialCheck> {
    // Mock - in production would verify with NPDB or insurance carriers
    const hasCoverage = !['1111111111', '9999999999'].includes(npi);
    
    return {
      type: 'MALPRACTICE',
      status: hasCoverage ? 'VERIFIED' : 'NOT_FOUND',
      verifiedAt: new Date().toISOString(),
      expiresAt: hasCoverage ? '2025-12-31' : undefined,
      source: 'NPDB / Insurance Verification',
      details: hasCoverage ? {
        carrier: 'Medical Protective',
        policyNumber: 'MP-' + npi.substring(0, 6),
        coverageAmount: '$1,000,000/$3,000,000',
        effectiveDate: '2024-01-01',
        expirationDate: '2025-12-31',
      } : { message: 'No malpractice coverage verified' },
    };
  }

  /**
   * Calculate overall status and score
   */
  private calculateOverallStatus(checks: CredentialCheck[], sanctions: SanctionResult): {
    overallStatus: VerificationStatus;
    riskLevel: CredentialingRiskLevel;
    credentialingScore: number;
  } {
    // Sanctions are critical
    if (sanctions.found) {
      return { overallStatus: 'FLAGGED', riskLevel: 'CRITICAL', credentialingScore: 10 };
    }
    
    const failedChecks = checks.filter(c => c.status === 'FAILED');
    const expiredChecks = checks.filter(c => c.status === 'EXPIRED');
    const flaggedChecks = checks.filter(c => c.status === 'FLAGGED');
    const verifiedChecks = checks.filter(c => c.status === 'VERIFIED');
    
    // Any failed = overall failed
    if (failedChecks.length > 0) {
      return { overallStatus: 'FAILED', riskLevel: 'HIGH', credentialingScore: 20 };
    }
    
    // Flagged items need review
    if (flaggedChecks.length > 0) {
      return { overallStatus: 'FLAGGED', riskLevel: 'MEDIUM', credentialingScore: 50 };
    }
    
    // Expired items
    if (expiredChecks.length > 0) {
      return { overallStatus: 'EXPIRED', riskLevel: 'MEDIUM', credentialingScore: 60 };
    }
    
    // Calculate score based on verified
    const baseScore = (verifiedChecks.length / checks.length) * 100;
    
    if (baseScore >= 80) {
      return { overallStatus: 'VERIFIED', riskLevel: 'LOW', credentialingScore: Math.round(baseScore) };
    }
    
    return { overallStatus: 'PENDING', riskLevel: 'LOW', credentialingScore: Math.round(baseScore) };
  }

  /**
   * Generate summary
   */
  private generateSummary(
    provider: NPIRecord,
    checks: CredentialCheck[],
    sanctions: SanctionResult,
    status: VerificationStatus
  ): string {
    const verifiedCount = checks.filter(c => c.status === 'VERIFIED').length;
    
    if (sanctions.found) {
      return `CRITICAL: ${provider.name} has active sanctions and cannot be credentialed.`;
    }
    
    if (status === 'FAILED') {
      const failed = checks.find(c => c.status === 'FAILED');
      return `Credentialing FAILED for ${provider.name}. ${failed?.type} verification failed.`;
    }
    
    if (status === 'FLAGGED') {
      return `${provider.name} requires manual review. ${checks.filter(c => c.status === 'FLAGGED').length} item(s) flagged.`;
    }
    
    if (status === 'EXPIRED') {
      const expired = checks.filter(c => c.status === 'EXPIRED');
      return `${provider.name} has ${expired.length} expired credential(s) requiring renewal.`;
    }
    
    return `${provider.name} passed credentialing with ${verifiedCount}/${checks.length} verifications complete.`;
  }

  /**
   * Build result object
   */
  private buildResult(
    request: CredentialingRequest,
    transactionId: string,
    startTime: number,
    data: Omit<CredentialingResult, 'npi' | 'transactionId' | 'timestamp' | 'processingTimeMs'>
  ): CredentialingResult {
    return {
      npi: request.npi,
      transactionId,
      timestamp: new Date().toISOString(),
      processingTimeMs: Date.now() - startTime,
      ...data,
    };
  }

  /**
   * Get all available NPIs for testing
   */
  getTestNPIs(): Array<{ npi: string; name: string; type: string; hasIssues: boolean }> {
    return Object.values(NPI_REGISTRY).map(r => ({
      npi: r.npi,
      name: r.name,
      type: r.type,
      hasIssues: !!SANCTIONED_PROVIDERS[r.npi] || 
        (STATE_LICENSES[r.npi]?.some(l => l.status !== 'ACTIVE') ?? false),
    }));
  }
}

// Export singleton
export const credentialingEngine = new CredentialingEngine();
