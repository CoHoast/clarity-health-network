/**
 * Claims Validation Engine
 * 
 * 5-level validation pipeline with auto-adjudication.
 * Adapted from DOKit Claims Intake module for TrueCare Health Network.
 * 
 * Levels:
 * 1. Syntax - Required fields, format validation
 * 2. Business - Timely filing, duplicates, future dates
 * 3. Eligibility - Member active, coverage applies
 * 4. Provider - NPI valid, network status, not excluded
 * 5. Clinical - ICD-10/CPT valid, age/gender appropriate
 */

// ============================================================================
// TYPES
// ============================================================================

export type ValidationLevel = 1 | 2 | 3 | 4 | 5;

export type ValidationCategory = 
  | 'SYNTAX'
  | 'BUSINESS'
  | 'ELIGIBILITY'
  | 'PROVIDER'
  | 'CLINICAL';

export type ValidationSeverity = 'REJECT' | 'DENY' | 'PEND' | 'WARN' | 'INFO';

export type ClaimStatus = 
  | 'accepted'
  | 'rejected'
  | 'denied'
  | 'pended'
  | 'approved';

export interface ValidationError {
  ruleId: string;
  level: ValidationLevel;
  category: ValidationCategory;
  severity: ValidationSeverity;
  errorCode: string;
  errorMessage: string;
  field?: string;
  value?: string;
  reasonCode?: string;
  pendQueue?: string;
}

export interface ValidationWarning {
  ruleId: string;
  level: ValidationLevel;
  category: ValidationCategory;
  warningCode: string;
  warningMessage: string;
  field?: string;
}

export interface ClaimForValidation {
  claimId: string;
  memberId: string;
  memberDob?: string;
  memberGender?: string;
  billingNpi: string;
  providerName?: string;
  renderingNpi?: string;
  claimType: 'PROFESSIONAL' | 'INSTITUTIONAL';
  serviceFromDate: string;
  serviceToDate?: string;
  submittedDate?: string;
  placeOfService?: string;
  totalCharges: number;
  priorAuthNumber?: string;
  diagnosisCodes: Array<{ code: string; type?: string }>;
  serviceLines: Array<{
    lineNumber: number;
    procedureCode: string;
    modifiers?: string[];
    chargeAmount: number;
    quantity: number;
    serviceDate?: string;
    diagnosisPointers?: number[];
    revenueCode?: string;
  }>;
}

export interface ValidationResult {
  claimId: string;
  transactionId: string;
  timestamp: string;
  processingTimeMs: number;
  
  // Overall result
  passed: boolean;
  status: ClaimStatus;
  
  // Validation progress
  validationLevel: ValidationLevel;
  levelsCompleted: number[];
  
  // Errors and warnings
  errors: ValidationError[];
  warnings: ValidationWarning[];
  
  // Denial/pend info
  denialReasons?: string[];
  pendQueue?: string;
  pendReason?: string;
  
  // Auto-adjudication
  autoAdjudicated: boolean;
  autoAdjudicationReason?: string;
  
  // Summary
  summary: string;
}

// ============================================================================
// VALIDATION DATA
// ============================================================================

// Valid ICD-10 codes (sample - real system would have full database)
const VALID_ICD10_CODES = new Set([
  // Common diagnoses
  'E11.9', 'E11.65', 'E11.21', 'E11.22', // Diabetes
  'I10', 'I11.9', 'I12.9', 'I13.10', // Hypertension
  'J06.9', 'J02.9', 'J18.9', 'J44.1', // Respiratory
  'M54.5', 'M54.2', 'M54.9', 'M17.11', 'M17.12', // Musculoskeletal
  'Z00.00', 'Z00.01', 'Z01.419', 'Z01.812', // Preventive
  'Z13.220', 'Z13.1', 'Z13.6', // Screening
  'R05.9', 'R10.9', 'R51.9', 'R53.83', // Symptoms
  'K21.0', 'K58.9', 'K30', // GI
  'F32.9', 'F41.9', 'F41.1', // Mental health
  'G43.909', 'G47.33', // Neurological
  'L82.1', 'L70.0', // Skin
  'H91.90', 'H10.9', // ENT
  'S93.401A', 'S62.501A', // Injuries
  'N39.0', 'N40.0', // Urological
  'M06.9', // Rheumatoid arthritis
]);

// Valid CPT codes (sample - real system would have full database)
const VALID_CPT_CODES = new Set([
  // E&M codes
  '99201', '99202', '99203', '99204', '99205',
  '99211', '99212', '99213', '99214', '99215',
  '99381', '99382', '99383', '99384', '99385', '99386', '99387',
  '99391', '99392', '99393', '99394', '99395', '99396', '99397',
  '99281', '99282', '99283', '99284', '99285',
  // Procedures
  '36415', '36416', // Venipuncture
  '10060', '10061', '11102', '11104', // Minor procedures
  '12001', '12002', // Wound repair
  '27447', '27130', '29881', '63030', // Surgery
  // Lab
  '80048', '80053', '80061', '85025', '85027',
  '84443', '82728', '83036', '81001', '87086',
  // Imaging
  '71046', '71047', '72148', '72141', '70553',
  '74177', '74176', '93306', '93307',
  '73030', '73060', '73110', '73130', '73510', '73560', '73600', '73630',
  // Therapy
  '97161', '97162', '97163', '97110', '97140', '97530',
  '98940', '98941', '98942',
  // Other
  '92557', '95810', '90837', '90834',
]);

// Codes requiring prior authorization
const PRIOR_AUTH_REQUIRED = new Set([
  '27447', '27130', '63030', '33533', // Major surgeries
  '70553', '72148', '72141', // Advanced imaging
  '95810', // Sleep study
]);

// Gender-specific procedures
const FEMALE_ONLY_CODES = new Set(['99384', '99385', '99386', '99394', '99395', '99396']);
const MALE_ONLY_CODES = new Set<string>([]);

// Age-restricted codes (min, max)
const AGE_RESTRICTIONS: Record<string, { min?: number; max?: number }> = {
  '99381': { max: 1 },
  '99382': { min: 1, max: 4 },
  '99383': { min: 5, max: 11 },
  '99384': { min: 12, max: 17 },
  '99385': { min: 18, max: 39 },
  '99386': { min: 40, max: 64 },
  '99387': { min: 65 },
  '99391': { max: 1 },
  '99392': { min: 1, max: 4 },
  '99393': { min: 5, max: 11 },
  '99394': { min: 12, max: 17 },
  '99395': { min: 18, max: 39 },
  '99396': { min: 40, max: 64 },
  '99397': { min: 65 },
};

// Active members (mock)
const ACTIVE_MEMBERS = new Set([
  'CHN-123456', 'CHN-234567', 'CHN-345678', 'CHN-456789',
  'CHN-567890', 'CHN-678901', 'CHN-789012', 'CHN-890123',
  'CHN-901234', 'CHN-012345', 'CHN-112233', 'CHN-223344',
  'CHN-334455', 'CHN-445566', 'CHN-556677', 'CHN-667788',
]);

// In-network providers (mock)
const IN_NETWORK_PROVIDERS = new Set([
  '1234567890', '2345678901', '3456789012', '4567890123',
  '5678901234', '6789012345', '8901234567', '9012345678',
  '0123456789', '1122334455', '2233445566', '3344556677', '4455667788',
]);

// Excluded providers (OIG/SAM)
const EXCLUDED_PROVIDERS = new Set([
  '9999999999', '8888888888', '7777777777',
]);

// Timely filing limit (days)
const TIMELY_FILING_DAYS = 365;

// ============================================================================
// AUTO-ADJUDICATION CONFIG
// ============================================================================

interface AutoAdjConfig {
  maxChargeAmount: number;
  maxLineCount: number;
  autoAdjClaimTypes: string[];
  alwaysPendModifiers: string[];
  alwaysPendProcedures: string[];
  requirePriorAuth: string[];
  autoAdjInNetwork: boolean;
  autoAdjOutOfNetwork: boolean;
}

const AUTO_ADJ_CONFIG: AutoAdjConfig = {
  maxChargeAmount: 10000,
  maxLineCount: 10,
  autoAdjClaimTypes: ['PROFESSIONAL'],
  alwaysPendModifiers: ['22', '62', '66'], // Unusual modifiers
  alwaysPendProcedures: [], // Empty for demo
  requirePriorAuth: Array.from(PRIOR_AUTH_REQUIRED),
  autoAdjInNetwork: true,
  autoAdjOutOfNetwork: false,
};

// ============================================================================
// VALIDATION ENGINE
// ============================================================================

export class ClaimsValidationEngine {
  /**
   * Run full validation pipeline
   */
  async validateClaim(claim: ClaimForValidation): Promise<ValidationResult> {
    const startTime = Date.now();
    const transactionId = `VAL-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const levelsCompleted: number[] = [];
    let currentLevel: ValidationLevel = 1;
    let finalStatus: ClaimStatus = 'accepted';
    
    // Level 1: Syntax Validation
    const syntaxResult = this.validateSyntax(claim);
    errors.push(...syntaxResult.errors);
    warnings.push(...syntaxResult.warnings);
    
    const rejectErrors = syntaxResult.errors.filter(e => e.severity === 'REJECT');
    if (rejectErrors.length > 0) {
      return this.buildResult(claim, transactionId, startTime, {
        passed: false,
        status: 'rejected',
        level: 1,
        levelsCompleted: [],
        errors,
        warnings,
        summary: `Claim rejected at Level 1 (Syntax): ${rejectErrors[0].errorMessage}`,
      });
    }
    levelsCompleted.push(1);
    currentLevel = 2;
    
    // Level 2: Business Validation
    const businessResult = this.validateBusiness(claim);
    errors.push(...businessResult.errors);
    warnings.push(...businessResult.warnings);
    
    const denyErrors = businessResult.errors.filter(e => e.severity === 'DENY');
    if (denyErrors.length > 0) {
      return this.buildResult(claim, transactionId, startTime, {
        passed: false,
        status: 'denied',
        level: 2,
        levelsCompleted: [1],
        errors,
        warnings,
        denialReasons: denyErrors.map(e => e.reasonCode!).filter(Boolean),
        summary: `Claim denied at Level 2 (Business): ${denyErrors[0].errorMessage}`,
      });
    }
    levelsCompleted.push(2);
    currentLevel = 3;
    
    // Level 3: Eligibility Validation
    const eligibilityResult = this.validateEligibility(claim);
    errors.push(...eligibilityResult.errors);
    warnings.push(...eligibilityResult.warnings);
    
    const eligDenyErrors = eligibilityResult.errors.filter(e => e.severity === 'DENY');
    if (eligDenyErrors.length > 0) {
      return this.buildResult(claim, transactionId, startTime, {
        passed: false,
        status: 'denied',
        level: 3,
        levelsCompleted: [1, 2],
        errors,
        warnings,
        denialReasons: eligDenyErrors.map(e => e.reasonCode!).filter(Boolean),
        summary: `Claim denied at Level 3 (Eligibility): ${eligDenyErrors[0].errorMessage}`,
      });
    }
    levelsCompleted.push(3);
    currentLevel = 4;
    
    // Level 4: Provider Validation
    const providerResult = this.validateProvider(claim);
    errors.push(...providerResult.errors);
    warnings.push(...providerResult.warnings);
    
    const provDenyErrors = providerResult.errors.filter(e => e.severity === 'DENY');
    if (provDenyErrors.length > 0) {
      return this.buildResult(claim, transactionId, startTime, {
        passed: false,
        status: 'denied',
        level: 4,
        levelsCompleted: [1, 2, 3],
        errors,
        warnings,
        denialReasons: provDenyErrors.map(e => e.reasonCode!).filter(Boolean),
        summary: `Claim denied at Level 4 (Provider): ${provDenyErrors[0].errorMessage}`,
      });
    }
    levelsCompleted.push(4);
    currentLevel = 5;
    
    // Level 5: Clinical Validation
    const clinicalResult = this.validateClinical(claim);
    errors.push(...clinicalResult.errors);
    warnings.push(...clinicalResult.warnings);
    levelsCompleted.push(5);
    
    // Check for any remaining deny errors
    const allDenyErrors = errors.filter(e => e.severity === 'DENY');
    if (allDenyErrors.length > 0) {
      return this.buildResult(claim, transactionId, startTime, {
        passed: false,
        status: 'denied',
        level: 5,
        levelsCompleted,
        errors,
        warnings,
        denialReasons: allDenyErrors.map(e => e.reasonCode!).filter(Boolean),
        summary: `Claim denied: ${allDenyErrors[0].errorMessage}`,
      });
    }
    
    // Check for pend errors
    const pendErrors = errors.filter(e => e.severity === 'PEND');
    if (pendErrors.length > 0) {
      return this.buildResult(claim, transactionId, startTime, {
        passed: true,
        status: 'pended',
        level: 5,
        levelsCompleted,
        errors,
        warnings,
        pendQueue: pendErrors[0].pendQueue,
        pendReason: pendErrors[0].errorMessage,
        summary: `Claim pended for review: ${pendErrors[0].errorMessage}`,
      });
    }
    
    // Check auto-adjudication eligibility
    const autoAdjResult = this.checkAutoAdjudication(claim);
    
    if (autoAdjResult.autoAdjudicate) {
      return this.buildResult(claim, transactionId, startTime, {
        passed: true,
        status: 'approved',
        level: 5,
        levelsCompleted,
        errors: [],
        warnings,
        autoAdjudicated: true,
        autoAdjudicationReason: 'Claim meets all auto-adjudication criteria',
        summary: `Claim auto-approved. All 5 validation levels passed. ${warnings.length} warning(s).`,
      });
    }
    
    // Accepted but needs manual review
    return this.buildResult(claim, transactionId, startTime, {
      passed: true,
      status: 'accepted',
      level: 5,
      levelsCompleted,
      errors,
      warnings,
      autoAdjudicated: false,
      autoAdjudicationReason: autoAdjResult.reason,
      summary: `Claim accepted for processing. ${autoAdjResult.reason}`,
    });
  }

  /**
   * Level 1: Syntax Validation
   */
  private validateSyntax(claim: ClaimForValidation): { errors: ValidationError[]; warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    
    // Required fields
    if (!claim.billingNpi) {
      errors.push({
        ruleId: 'SYN001',
        level: 1,
        category: 'SYNTAX',
        severity: 'REJECT',
        errorCode: 'AAA',
        errorMessage: 'Billing Provider NPI is required',
        field: 'billingNpi',
      });
    }
    
    if (!claim.memberId) {
      errors.push({
        ruleId: 'SYN002',
        level: 1,
        category: 'SYNTAX',
        severity: 'REJECT',
        errorCode: 'AAA',
        errorMessage: 'Member ID is required',
        field: 'memberId',
      });
    }
    
    if (!claim.serviceFromDate) {
      errors.push({
        ruleId: 'SYN003',
        level: 1,
        category: 'SYNTAX',
        severity: 'REJECT',
        errorCode: 'AAA',
        errorMessage: 'Service date is required',
        field: 'serviceFromDate',
      });
    }
    
    if (!claim.serviceLines || claim.serviceLines.length === 0) {
      errors.push({
        ruleId: 'SYN004',
        level: 1,
        category: 'SYNTAX',
        severity: 'REJECT',
        errorCode: 'AAA',
        errorMessage: 'At least one service line is required',
        field: 'serviceLines',
      });
    }
    
    if (!claim.diagnosisCodes || claim.diagnosisCodes.length === 0) {
      errors.push({
        ruleId: 'SYN005',
        level: 1,
        category: 'SYNTAX',
        severity: 'REJECT',
        errorCode: 'AAA',
        errorMessage: 'At least one diagnosis code is required',
        field: 'diagnosisCodes',
      });
    }
    
    // NPI format (10 digits)
    if (claim.billingNpi && !/^\d{10}$/.test(claim.billingNpi)) {
      errors.push({
        ruleId: 'SYN006',
        level: 1,
        category: 'SYNTAX',
        severity: 'REJECT',
        errorCode: 'AAA',
        errorMessage: 'Billing NPI must be 10 digits',
        field: 'billingNpi',
        value: claim.billingNpi,
      });
    }
    
    // Validate service lines
    for (const line of claim.serviceLines || []) {
      if (!line.procedureCode) {
        errors.push({
          ruleId: 'SYN007',
          level: 1,
          category: 'SYNTAX',
          severity: 'REJECT',
          errorCode: 'AAA',
          errorMessage: `Line ${line.lineNumber}: Procedure code is required`,
          field: `serviceLines[${line.lineNumber}].procedureCode`,
        });
      }
      
      if (!line.chargeAmount || line.chargeAmount <= 0) {
        errors.push({
          ruleId: 'SYN008',
          level: 1,
          category: 'SYNTAX',
          severity: 'REJECT',
          errorCode: 'AAA',
          errorMessage: `Line ${line.lineNumber}: Charge amount must be positive`,
          field: `serviceLines[${line.lineNumber}].chargeAmount`,
          value: String(line.chargeAmount),
        });
      }
      
      if (!line.quantity || line.quantity <= 0) {
        warnings.push({
          ruleId: 'SYN009',
          level: 1,
          category: 'SYNTAX',
          warningCode: 'W01',
          warningMessage: `Line ${line.lineNumber}: Quantity defaulted to 1`,
          field: `serviceLines[${line.lineNumber}].quantity`,
        });
      }
    }
    
    return { errors, warnings };
  }

  /**
   * Level 2: Business Validation
   */
  private validateBusiness(claim: ClaimForValidation): { errors: ValidationError[]; warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    
    const serviceDate = new Date(claim.serviceFromDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Future date check
    if (serviceDate > today) {
      errors.push({
        ruleId: 'BUS001',
        level: 2,
        category: 'BUSINESS',
        severity: 'DENY',
        errorCode: 'A7:77',
        errorMessage: 'Service date cannot be in the future',
        reasonCode: 'CO-16',
        field: 'serviceFromDate',
        value: claim.serviceFromDate,
      });
    }
    
    // Timely filing check
    const submittedDate = claim.submittedDate ? new Date(claim.submittedDate) : today;
    const daysSinceService = Math.floor((submittedDate.getTime() - serviceDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceService > TIMELY_FILING_DAYS) {
      errors.push({
        ruleId: 'BUS002',
        level: 2,
        category: 'BUSINESS',
        severity: 'DENY',
        errorCode: 'A7:29',
        errorMessage: `Timely filing limit exceeded (${daysSinceService} days > ${TIMELY_FILING_DAYS} days)`,
        reasonCode: 'CO-29',
        field: 'serviceFromDate',
      });
    } else if (daysSinceService > TIMELY_FILING_DAYS - 30) {
      warnings.push({
        ruleId: 'BUS003',
        level: 2,
        category: 'BUSINESS',
        warningCode: 'W02',
        warningMessage: `Claim approaching timely filing deadline (${TIMELY_FILING_DAYS - daysSinceService} days remaining)`,
      });
    }
    
    // Service date range check
    if (claim.serviceToDate) {
      const toDate = new Date(claim.serviceToDate);
      if (toDate < serviceDate) {
        errors.push({
          ruleId: 'BUS004',
          level: 2,
          category: 'BUSINESS',
          severity: 'REJECT',
          errorCode: 'A7:78',
          errorMessage: 'Service end date cannot be before start date',
          field: 'serviceToDate',
        });
      }
      
      const dateRange = Math.floor((toDate.getTime() - serviceDate.getTime()) / (1000 * 60 * 60 * 24));
      if (dateRange > 30 && claim.claimType === 'PROFESSIONAL') {
        warnings.push({
          ruleId: 'BUS005',
          level: 2,
          category: 'BUSINESS',
          warningCode: 'W03',
          warningMessage: `Unusual date range for professional claim (${dateRange} days)`,
        });
      }
    }
    
    // Total charges validation
    if (claim.totalCharges <= 0) {
      errors.push({
        ruleId: 'BUS006',
        level: 2,
        category: 'BUSINESS',
        severity: 'REJECT',
        errorCode: 'A7:80',
        errorMessage: 'Total charges must be positive',
        field: 'totalCharges',
        value: String(claim.totalCharges),
      });
    }
    
    // Line charges sum check
    const lineTotal = claim.serviceLines.reduce((sum, l) => sum + (l.chargeAmount * l.quantity), 0);
    if (Math.abs(lineTotal - claim.totalCharges) > 0.01) {
      warnings.push({
        ruleId: 'BUS007',
        level: 2,
        category: 'BUSINESS',
        warningCode: 'W04',
        warningMessage: `Line charges ($${lineTotal.toFixed(2)}) don't match total ($${claim.totalCharges.toFixed(2)})`,
      });
    }
    
    return { errors, warnings };
  }

  /**
   * Level 3: Eligibility Validation
   */
  private validateEligibility(claim: ClaimForValidation): { errors: ValidationError[]; warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    
    // Member active check
    if (!ACTIVE_MEMBERS.has(claim.memberId)) {
      errors.push({
        ruleId: 'ELG001',
        level: 3,
        category: 'ELIGIBILITY',
        severity: 'DENY',
        errorCode: 'A6:41',
        errorMessage: 'Member not found or not active on date of service',
        reasonCode: 'CO-27',
        field: 'memberId',
        value: claim.memberId,
      });
    }
    
    // Check coverage type matches service (simplified)
    // In production would check actual benefit plan
    
    return { errors, warnings };
  }

  /**
   * Level 4: Provider Validation
   */
  private validateProvider(claim: ClaimForValidation): { errors: ValidationError[]; warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    
    // NPI validation (Luhn algorithm check - simplified)
    if (claim.billingNpi && !this.validateNpiChecksum(claim.billingNpi)) {
      errors.push({
        ruleId: 'PRV001',
        level: 4,
        category: 'PROVIDER',
        severity: 'DENY',
        errorCode: 'A6:72',
        errorMessage: 'Invalid NPI checksum',
        reasonCode: 'CO-16',
        field: 'billingNpi',
        value: claim.billingNpi,
      });
    }
    
    // Excluded provider check
    if (EXCLUDED_PROVIDERS.has(claim.billingNpi)) {
      errors.push({
        ruleId: 'PRV002',
        level: 4,
        category: 'PROVIDER',
        severity: 'DENY',
        errorCode: 'A6:73',
        errorMessage: 'Provider is on OIG/SAM exclusion list',
        reasonCode: 'CO-96',
        field: 'billingNpi',
        value: claim.billingNpi,
      });
    }
    
    // Network status check
    const isInNetwork = IN_NETWORK_PROVIDERS.has(claim.billingNpi);
    if (!isInNetwork) {
      warnings.push({
        ruleId: 'PRV003',
        level: 4,
        category: 'PROVIDER',
        warningCode: 'W05',
        warningMessage: 'Provider is out-of-network - reduced benefits may apply',
        field: 'billingNpi',
      });
    }
    
    return { errors, warnings };
  }

  /**
   * Level 5: Clinical Validation
   */
  private validateClinical(claim: ClaimForValidation): { errors: ValidationError[]; warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    
    // Validate diagnosis codes
    for (const dx of claim.diagnosisCodes) {
      const codeWithoutDot = dx.code.replace('.', '');
      const codeWithDot = dx.code.includes('.') ? dx.code : 
        dx.code.slice(0, 3) + (dx.code.length > 3 ? '.' + dx.code.slice(3) : '');
      
      if (!VALID_ICD10_CODES.has(codeWithDot) && !VALID_ICD10_CODES.has(dx.code)) {
        warnings.push({
          ruleId: 'CLN001',
          level: 5,
          category: 'CLINICAL',
          warningCode: 'W06',
          warningMessage: `Diagnosis code ${dx.code} not found in reference database`,
          field: 'diagnosisCodes',
        });
      }
    }
    
    // Validate procedure codes
    for (const line of claim.serviceLines) {
      if (!VALID_CPT_CODES.has(line.procedureCode)) {
        errors.push({
          ruleId: 'CLN002',
          level: 5,
          category: 'CLINICAL',
          severity: 'PEND',
          errorCode: 'A7:B1:181',
          errorMessage: `Line ${line.lineNumber}: Procedure code ${line.procedureCode} not found`,
          pendQueue: 'coding_review',
          field: `serviceLines[${line.lineNumber}].procedureCode`,
          value: line.procedureCode,
        });
      }
      
      // Prior auth check
      if (PRIOR_AUTH_REQUIRED.has(line.procedureCode) && !claim.priorAuthNumber) {
        errors.push({
          ruleId: 'CLN003',
          level: 5,
          category: 'CLINICAL',
          severity: 'PEND',
          errorCode: 'A7:A1:15',
          errorMessage: `Line ${line.lineNumber}: Prior authorization required for ${line.procedureCode}`,
          pendQueue: 'auth_review',
          field: 'priorAuthNumber',
        });
      }
      
      // Age-appropriate check
      if (claim.memberDob && AGE_RESTRICTIONS[line.procedureCode]) {
        const age = this.calculateAge(claim.memberDob);
        const restriction = AGE_RESTRICTIONS[line.procedureCode];
        
        if (restriction.min !== undefined && age < restriction.min) {
          errors.push({
            ruleId: 'CLN004',
            level: 5,
            category: 'CLINICAL',
            severity: 'DENY',
            errorCode: 'A7:A1:66',
            errorMessage: `Line ${line.lineNumber}: ${line.procedureCode} not appropriate for age ${age} (min: ${restriction.min})`,
            reasonCode: 'CO-167',
            field: `serviceLines[${line.lineNumber}].procedureCode`,
          });
        }
        
        if (restriction.max !== undefined && age > restriction.max) {
          errors.push({
            ruleId: 'CLN005',
            level: 5,
            category: 'CLINICAL',
            severity: 'DENY',
            errorCode: 'A7:A1:67',
            errorMessage: `Line ${line.lineNumber}: ${line.procedureCode} not appropriate for age ${age} (max: ${restriction.max})`,
            reasonCode: 'CO-167',
            field: `serviceLines[${line.lineNumber}].procedureCode`,
          });
        }
      }
      
      // Gender-appropriate check
      if (claim.memberGender) {
        if (FEMALE_ONLY_CODES.has(line.procedureCode) && claim.memberGender.toUpperCase() === 'M') {
          errors.push({
            ruleId: 'CLN006',
            level: 5,
            category: 'CLINICAL',
            severity: 'DENY',
            errorCode: 'A7:A1:68',
            errorMessage: `Line ${line.lineNumber}: ${line.procedureCode} not appropriate for male patient`,
            reasonCode: 'CO-167',
            field: `serviceLines[${line.lineNumber}].procedureCode`,
          });
        }
        
        if (MALE_ONLY_CODES.has(line.procedureCode) && claim.memberGender.toUpperCase() === 'F') {
          errors.push({
            ruleId: 'CLN007',
            level: 5,
            category: 'CLINICAL',
            severity: 'DENY',
            errorCode: 'A7:A1:69',
            errorMessage: `Line ${line.lineNumber}: ${line.procedureCode} not appropriate for female patient`,
            reasonCode: 'CO-167',
            field: `serviceLines[${line.lineNumber}].procedureCode`,
          });
        }
      }
    }
    
    return { errors, warnings };
  }

  /**
   * Check if claim can be auto-adjudicated
   */
  private checkAutoAdjudication(claim: ClaimForValidation): { autoAdjudicate: boolean; reason?: string } {
    // Check charge threshold
    if (claim.totalCharges > AUTO_ADJ_CONFIG.maxChargeAmount) {
      return {
        autoAdjudicate: false,
        reason: `Charges $${claim.totalCharges.toFixed(2)} exceed auto-adj threshold $${AUTO_ADJ_CONFIG.maxChargeAmount}`,
      };
    }
    
    // Check line count
    if (claim.serviceLines.length > AUTO_ADJ_CONFIG.maxLineCount) {
      return {
        autoAdjudicate: false,
        reason: `${claim.serviceLines.length} lines exceed threshold ${AUTO_ADJ_CONFIG.maxLineCount}`,
      };
    }
    
    // Check claim type
    if (!AUTO_ADJ_CONFIG.autoAdjClaimTypes.includes(claim.claimType)) {
      return {
        autoAdjudicate: false,
        reason: `Claim type ${claim.claimType} requires manual review`,
      };
    }
    
    // Check network status
    const isInNetwork = IN_NETWORK_PROVIDERS.has(claim.billingNpi);
    if (!isInNetwork && !AUTO_ADJ_CONFIG.autoAdjOutOfNetwork) {
      return {
        autoAdjudicate: false,
        reason: 'Out-of-network claims require manual review',
      };
    }
    
    // Check modifiers
    for (const line of claim.serviceLines) {
      for (const mod of line.modifiers || []) {
        if (AUTO_ADJ_CONFIG.alwaysPendModifiers.includes(mod)) {
          return {
            autoAdjudicate: false,
            reason: `Modifier ${mod} requires clinical review`,
          };
        }
      }
    }
    
    return { autoAdjudicate: true };
  }

  /**
   * Validate NPI checksum (Luhn algorithm)
   */
  private validateNpiChecksum(npi: string): boolean {
    if (!/^\d{10}$/.test(npi)) return false;
    
    // For demo purposes, accept all properly formatted NPIs
    // Real implementation would use Luhn algorithm with prefix 80840
    return true;
  }

  /**
   * Calculate age from DOB
   */
  private calculateAge(dob: string): number {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Build final result object
   */
  private buildResult(
    claim: ClaimForValidation,
    transactionId: string,
    startTime: number,
    data: {
      passed: boolean;
      status: ClaimStatus;
      level: ValidationLevel;
      levelsCompleted: number[];
      errors: ValidationError[];
      warnings: ValidationWarning[];
      denialReasons?: string[];
      pendQueue?: string;
      pendReason?: string;
      autoAdjudicated?: boolean;
      autoAdjudicationReason?: string;
      summary: string;
    }
  ): ValidationResult {
    return {
      claimId: claim.claimId,
      transactionId,
      timestamp: new Date().toISOString(),
      processingTimeMs: Date.now() - startTime,
      passed: data.passed,
      status: data.status,
      validationLevel: data.level,
      levelsCompleted: data.levelsCompleted,
      errors: data.errors,
      warnings: data.warnings,
      denialReasons: data.denialReasons,
      pendQueue: data.pendQueue,
      pendReason: data.pendReason,
      autoAdjudicated: data.autoAdjudicated ?? false,
      autoAdjudicationReason: data.autoAdjudicationReason,
      summary: data.summary,
    };
  }

  /**
   * Get validation rules info
   */
  getRules(): Array<{ ruleId: string; level: ValidationLevel; category: ValidationCategory; description: string }> {
    return [
      { ruleId: 'SYN001', level: 1, category: 'SYNTAX', description: 'Billing NPI required' },
      { ruleId: 'SYN002', level: 1, category: 'SYNTAX', description: 'Member ID required' },
      { ruleId: 'SYN003', level: 1, category: 'SYNTAX', description: 'Service date required' },
      { ruleId: 'SYN004', level: 1, category: 'SYNTAX', description: 'At least one service line required' },
      { ruleId: 'SYN005', level: 1, category: 'SYNTAX', description: 'At least one diagnosis required' },
      { ruleId: 'SYN006', level: 1, category: 'SYNTAX', description: 'NPI must be 10 digits' },
      { ruleId: 'BUS001', level: 2, category: 'BUSINESS', description: 'Service date cannot be future' },
      { ruleId: 'BUS002', level: 2, category: 'BUSINESS', description: 'Timely filing check (365 days)' },
      { ruleId: 'ELG001', level: 3, category: 'ELIGIBILITY', description: 'Member must be active' },
      { ruleId: 'PRV001', level: 4, category: 'PROVIDER', description: 'NPI checksum validation' },
      { ruleId: 'PRV002', level: 4, category: 'PROVIDER', description: 'OIG/SAM exclusion check' },
      { ruleId: 'CLN001', level: 5, category: 'CLINICAL', description: 'ICD-10 code validation' },
      { ruleId: 'CLN002', level: 5, category: 'CLINICAL', description: 'CPT code validation' },
      { ruleId: 'CLN003', level: 5, category: 'CLINICAL', description: 'Prior auth requirement' },
      { ruleId: 'CLN004', level: 5, category: 'CLINICAL', description: 'Age-appropriate service' },
      { ruleId: 'CLN006', level: 5, category: 'CLINICAL', description: 'Gender-appropriate service' },
    ];
  }
}

// Export singleton
export const claimsValidationEngine = new ClaimsValidationEngine();
