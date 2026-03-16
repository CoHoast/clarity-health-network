/**
 * Claims Repricing Engine
 * 
 * Calculates allowed amounts based on provider contracts and fee schedules.
 * Adapted from DOKit Contract Management module for TrueCare Health Network.
 * 
 * Supports:
 * - % of Medicare
 * - % of Billed Charges
 * - Fixed Fee Schedule
 * - Case Rates (DRG-based or flat)
 * - Per Diem (daily rates)
 * - Capitation (PMPM)
 */

// ============================================================================
// TYPES
// ============================================================================

export type FeeStructureType = 
  | 'PERCENT_OF_MEDICARE'
  | 'PERCENT_OF_BILLED'
  | 'FIXED_FEE_SCHEDULE'
  | 'CASE_RATE'
  | 'PER_DIEM'
  | 'CAPITATION';

export type PlaceOfService = 
  | '11' // Office
  | '12' // Home
  | '21' // Inpatient Hospital
  | '22' // Outpatient Hospital
  | '23' // Emergency Room
  | '24' // Ambulatory Surgical Center
  | '31' // Skilled Nursing Facility
  | '81'; // Independent Lab

export interface ClaimLine {
  lineNumber: number;
  cptCode: string;
  modifier?: string;
  description?: string;
  quantity: number;
  billedAmount: number;
  placeOfService: string;
  diagnosisCodes?: string[];
  units?: number;
  serviceDate: string;
}

export interface RepricingRequest {
  claimId: string;
  memberId: string;
  providerNpi: string;
  providerName?: string;
  networkStatus: 'IN_NETWORK' | 'OUT_OF_NETWORK';
  claimType: 'PROFESSIONAL' | 'INSTITUTIONAL';
  serviceDate: string;
  totalBilledAmount: number;
  diagnosisCodes: string[];
  lines: ClaimLine[];
}

export interface RepricedLine {
  lineNumber: number;
  cptCode: string;
  modifier?: string;
  description?: string;
  billedAmount: number;
  allowedAmount: number;
  savingsAmount: number;
  savingsPercent: number;
  rateType: FeeStructureType;
  rateDetails: {
    baseRate?: number;
    adjustmentPercent?: number;
    modifierAdjustment?: number;
    rateSource: string;
  };
  status: 'APPROVED' | 'DENIED' | 'ADJUSTED' | 'PENDING_REVIEW';
  statusReason?: string;
}

export interface RepricingResponse {
  claimId: string;
  transactionId: string;
  timestamp: string;
  processingTimeMs: number;
  
  summary: {
    totalBilledAmount: number;
    totalAllowedAmount: number;
    totalSavings: number;
    savingsPercent: number;
    lineCount: number;
    approvedLines: number;
    deniedLines: number;
  };
  
  contract: {
    contractId: string;
    contractNumber: string;
    providerName: string;
    providerNpi: string;
    feeStructureType: FeeStructureType;
    baseRatePercent?: number;
    network: string;
    effectiveDate: string;
    terminationDate?: string;
  };
  
  lines: RepricedLine[];
  
  flags: string[];
  warnings: string[];
  
  auditTrail: {
    requestedBy?: string;
    requestedAt: string;
    calculationMethod: string;
    feeScheduleUsed?: string;
  };
}

// ============================================================================
// MOCK DATA - Medicare Fee Schedule (2024 National Average)
// ============================================================================

const MEDICARE_FEE_SCHEDULE: Record<string, { facility: number; nonFacility: number; description: string; pc?: number; tc?: number }> = {
  // E&M Codes - Office Visits
  '99201': { facility: 45.32, nonFacility: 45.32, description: 'Office visit, new patient, straightforward' },
  '99202': { facility: 66.48, nonFacility: 76.15, description: 'Office visit, new patient, low complexity' },
  '99203': { facility: 97.82, nonFacility: 115.26, description: 'Office visit, new patient, moderate complexity' },
  '99204': { facility: 147.65, nonFacility: 175.89, description: 'Office visit, new patient, moderate-high complexity' },
  '99205': { facility: 186.54, nonFacility: 221.12, description: 'Office visit, new patient, high complexity' },
  '99211': { facility: 21.18, nonFacility: 23.12, description: 'Office visit, established patient, minimal' },
  '99212': { facility: 45.32, nonFacility: 55.15, description: 'Office visit, established patient, straightforward' },
  '99213': { facility: 74.49, nonFacility: 92.15, description: 'Office visit, established patient, low complexity' },
  '99214': { facility: 109.85, nonFacility: 132.48, description: 'Office visit, established patient, moderate complexity' },
  '99215': { facility: 148.92, nonFacility: 180.65, description: 'Office visit, established patient, high complexity' },
  
  // E&M Codes - Preventive
  '99381': { facility: 115.50, nonFacility: 142.00, description: 'Preventive visit, new, infant' },
  '99382': { facility: 120.00, nonFacility: 148.00, description: 'Preventive visit, new, 1-4 years' },
  '99383': { facility: 118.50, nonFacility: 147.00, description: 'Preventive visit, new, 5-11 years' },
  '99384': { facility: 132.50, nonFacility: 165.00, description: 'Preventive visit, new, 12-17 years' },
  '99385': { facility: 128.00, nonFacility: 160.00, description: 'Preventive visit, new, 18-39 years' },
  '99386': { facility: 142.00, nonFacility: 178.00, description: 'Preventive visit, new, 40-64 years' },
  '99387': { facility: 155.00, nonFacility: 195.00, description: 'Preventive visit, new, 65+ years' },
  '99391': { facility: 95.00, nonFacility: 118.00, description: 'Preventive visit, established, infant' },
  '99392': { facility: 100.00, nonFacility: 125.00, description: 'Preventive visit, established, 1-4 years' },
  '99393': { facility: 98.00, nonFacility: 122.00, description: 'Preventive visit, established, 5-11 years' },
  '99394': { facility: 108.00, nonFacility: 135.00, description: 'Preventive visit, established, 12-17 years' },
  '99395': { facility: 112.00, nonFacility: 140.00, description: 'Preventive visit, established, 18-39 years' },
  '99396': { facility: 125.00, nonFacility: 158.00, description: 'Preventive visit, established, 40-64 years' },
  '99397': { facility: 138.00, nonFacility: 175.00, description: 'Preventive visit, established, 65+ years' },
  
  // Imaging - X-Ray
  '71046': { facility: 32.45, nonFacility: 32.45, description: 'X-ray chest, 2 views', pc: 8.12, tc: 24.33 },
  '71047': { facility: 38.50, nonFacility: 38.50, description: 'X-ray chest, 3 views', pc: 9.62, tc: 28.88 },
  '73030': { facility: 28.15, nonFacility: 28.15, description: 'X-ray shoulder, 2+ views', pc: 7.04, tc: 21.11 },
  '73060': { facility: 26.50, nonFacility: 26.50, description: 'X-ray humerus, 2+ views', pc: 6.62, tc: 19.88 },
  '73110': { facility: 28.00, nonFacility: 28.00, description: 'X-ray wrist, 3+ views', pc: 7.00, tc: 21.00 },
  '73130': { facility: 25.50, nonFacility: 25.50, description: 'X-ray hand, 3+ views', pc: 6.38, tc: 19.12 },
  '73510': { facility: 32.00, nonFacility: 32.00, description: 'X-ray hip, 1 view', pc: 8.00, tc: 24.00 },
  '73560': { facility: 29.50, nonFacility: 29.50, description: 'X-ray knee, 1-2 views', pc: 7.38, tc: 22.12 },
  '73600': { facility: 28.00, nonFacility: 28.00, description: 'X-ray ankle, 2 views', pc: 7.00, tc: 21.00 },
  '73630': { facility: 25.00, nonFacility: 25.00, description: 'X-ray foot, 3+ views', pc: 6.25, tc: 18.75 },
  
  // Imaging - Advanced
  '72148': { facility: 312.50, nonFacility: 312.50, description: 'MRI lumbar spine w/o contrast', pc: 62.50, tc: 250.00 },
  '72141': { facility: 325.00, nonFacility: 325.00, description: 'MRI cervical spine w/o contrast', pc: 65.00, tc: 260.00 },
  '70553': { facility: 425.00, nonFacility: 425.00, description: 'MRI brain w/ and w/o contrast', pc: 85.00, tc: 340.00 },
  '74177': { facility: 285.00, nonFacility: 285.00, description: 'CT abdomen/pelvis w/ contrast', pc: 57.00, tc: 228.00 },
  '74176': { facility: 215.00, nonFacility: 215.00, description: 'CT abdomen/pelvis w/o contrast', pc: 43.00, tc: 172.00 },
  '93306': { facility: 285.50, nonFacility: 380.00, description: 'Echocardiography complete', pc: 76.00, tc: 209.50 },
  '93307': { facility: 128.00, nonFacility: 175.00, description: 'Echocardiography, 2D', pc: 32.00, tc: 96.00 },
  
  // Lab - Common Tests
  '80048': { facility: 11.50, nonFacility: 11.50, description: 'Basic metabolic panel' },
  '80053': { facility: 14.50, nonFacility: 14.50, description: 'Comprehensive metabolic panel' },
  '80061': { facility: 18.50, nonFacility: 18.50, description: 'Lipid panel' },
  '85025': { facility: 10.50, nonFacility: 10.50, description: 'CBC with differential' },
  '85027': { facility: 8.50, nonFacility: 8.50, description: 'CBC automated' },
  '84443': { facility: 22.50, nonFacility: 22.50, description: 'TSH' },
  '82728': { facility: 18.00, nonFacility: 18.00, description: 'Ferritin' },
  '83036': { facility: 15.00, nonFacility: 15.00, description: 'Hemoglobin A1C' },
  '81001': { facility: 4.50, nonFacility: 4.50, description: 'Urinalysis, automated' },
  '87086': { facility: 9.50, nonFacility: 9.50, description: 'Urine culture' },
  
  // Procedures - Minor
  '11102': { facility: 115.00, nonFacility: 155.00, description: 'Tangential biopsy skin, single lesion' },
  '11104': { facility: 95.00, nonFacility: 125.00, description: 'Punch biopsy skin, single lesion' },
  '10060': { facility: 115.00, nonFacility: 145.00, description: 'I&D abscess, simple' },
  '10061': { facility: 185.00, nonFacility: 235.00, description: 'I&D abscess, complicated' },
  '12001': { facility: 165.00, nonFacility: 205.00, description: 'Repair superficial wound, 2.5cm or less' },
  '12002': { facility: 195.00, nonFacility: 245.00, description: 'Repair superficial wound, 2.6-7.5cm' },
  
  // Physical Therapy
  '97161': { facility: 85.00, nonFacility: 95.00, description: 'PT evaluation, low complexity' },
  '97162': { facility: 95.00, nonFacility: 115.00, description: 'PT evaluation, moderate complexity' },
  '97163': { facility: 115.00, nonFacility: 135.00, description: 'PT evaluation, high complexity' },
  '97110': { facility: 32.00, nonFacility: 38.00, description: 'Therapeutic exercises, 15 min' },
  '97140': { facility: 30.00, nonFacility: 36.00, description: 'Manual therapy, 15 min' },
  '97530': { facility: 35.00, nonFacility: 42.00, description: 'Therapeutic activities, 15 min' },
  
  // Chiropractic
  '98940': { facility: 32.00, nonFacility: 38.00, description: 'Chiropractic manipulation, 1-2 regions' },
  '98941': { facility: 42.00, nonFacility: 52.00, description: 'Chiropractic manipulation, 3-4 regions' },
  '98942': { facility: 52.00, nonFacility: 65.00, description: 'Chiropractic manipulation, 5 regions' },
  
  // Audiology
  '92557': { facility: 38.00, nonFacility: 48.00, description: 'Comprehensive audiometry' },
  
  // Sleep Studies
  '95810': { facility: 425.00, nonFacility: 525.00, description: 'Polysomnography, 6+ hours' },
  
  // Surgery - Major (sample)
  '27447': { facility: 1850.00, nonFacility: 1850.00, description: 'Total knee arthroplasty' },
  '27130': { facility: 1650.00, nonFacility: 1650.00, description: 'Total hip arthroplasty' },
  '29881': { facility: 485.00, nonFacility: 485.00, description: 'Knee arthroscopy w/ meniscectomy' },
  '63030': { facility: 1250.00, nonFacility: 1250.00, description: 'Lumbar discectomy, single level' },
  '33533': { facility: 2850.00, nonFacility: 2850.00, description: 'CABG, single arterial graft' },
};

// ============================================================================
// MOCK DATA - Provider Contracts
// ============================================================================

interface ProviderContract {
  id: string;
  contractNumber: string;
  providerNpi: string;
  providerName: string;
  feeStructureType: FeeStructureType;
  baseRatePercent?: number;
  network: string;
  effectiveDate: string;
  terminationDate?: string;
  feeScheduleId?: string;
}

const PROVIDER_CONTRACTS: ProviderContract[] = [
  { id: 'CTR-001', contractNumber: '2024-PCP-001', providerNpi: '1234567890', providerName: 'Cleveland Family Medicine', feeStructureType: 'PERCENT_OF_MEDICARE', baseRatePercent: 125, network: 'Premier', effectiveDate: '2024-01-01' },
  { id: 'CTR-002', contractNumber: '2024-SPEC-001', providerNpi: '2345678901', providerName: 'Dr. James Wilson', feeStructureType: 'PERCENT_OF_MEDICARE', baseRatePercent: 130, network: 'Premier', effectiveDate: '2024-01-01' },
  { id: 'CTR-003', contractNumber: '2024-IMG-001', providerNpi: '3456789012', providerName: 'Metro Imaging Center', feeStructureType: 'FIXED_FEE_SCHEDULE', network: 'Premier', effectiveDate: '2024-01-01', feeScheduleId: 'FS-IMAGING' },
  { id: 'CTR-004', contractNumber: '2024-ORTHO-001', providerNpi: '4567890123', providerName: 'Cleveland Orthopedic', feeStructureType: 'CASE_RATE', network: 'Premier', effectiveDate: '2024-01-01' },
  { id: 'CTR-005', contractNumber: '2024-UC-001', providerNpi: '5678901234', providerName: 'Quick Care Urgent', feeStructureType: 'PERCENT_OF_MEDICARE', baseRatePercent: 140, network: 'Premier', effectiveDate: '2024-01-01' },
  { id: 'CTR-006', contractNumber: '2024-LAB-001', providerNpi: '6789012345', providerName: 'Quest Diagnostics', feeStructureType: 'FIXED_FEE_SCHEDULE', network: 'Premier', effectiveDate: '2024-01-01', feeScheduleId: 'FS-LAB' },
  { id: 'CTR-007', contractNumber: '2024-RX-001', providerNpi: '8901234567', providerName: 'PharmaCare Specialty', feeStructureType: 'PERCENT_OF_BILLED', baseRatePercent: 90, network: 'Premier', effectiveDate: '2024-01-01' },
  { id: 'CTR-008', contractNumber: '2024-CARD-001', providerNpi: '9012345678', providerName: 'Cleveland Cardiology', feeStructureType: 'PERCENT_OF_MEDICARE', baseRatePercent: 135, network: 'Premier', effectiveDate: '2024-01-01' },
  { id: 'CTR-009', contractNumber: '2024-OBGYN-001', providerNpi: '0123456789', providerName: 'Women\'s Health Center', feeStructureType: 'PERCENT_OF_MEDICARE', baseRatePercent: 128, network: 'Premier', effectiveDate: '2024-01-01' },
  { id: 'CTR-010', contractNumber: '2024-PT-001', providerNpi: '1122334455', providerName: 'Physical Therapy Plus', feeStructureType: 'PERCENT_OF_MEDICARE', baseRatePercent: 115, network: 'Premier', effectiveDate: '2024-01-01' },
  { id: 'CTR-011', contractNumber: '2024-DERM-001', providerNpi: '2233445566', providerName: 'Westlake Dermatology', feeStructureType: 'PERCENT_OF_MEDICARE', baseRatePercent: 132, network: 'Premier', effectiveDate: '2024-01-01' },
  { id: 'CTR-012', contractNumber: '2024-ENT-001', providerNpi: '3344556677', providerName: 'Cleveland ENT Associates', feeStructureType: 'PERCENT_OF_MEDICARE', baseRatePercent: 125, network: 'Premier', effectiveDate: '2024-01-01' },
  { id: 'CTR-013', contractNumber: '2024-SLEEP-001', providerNpi: '4455667788', providerName: 'Sleep Center of Ohio', feeStructureType: 'PERCENT_OF_MEDICARE', baseRatePercent: 120, network: 'Premier', effectiveDate: '2024-01-01' },
];

// ============================================================================
// MOCK DATA - Custom Fee Schedules
// ============================================================================

const CUSTOM_FEE_SCHEDULES: Record<string, Record<string, number>> = {
  'FS-IMAGING': {
    '71046': 95.00,
    '71047': 115.00,
    '72148': 950.00,
    '72141': 975.00,
    '70553': 1150.00,
    '74177': 785.00,
    '74176': 625.00,
    '73030': 85.00,
    '73560': 88.00,
  },
  'FS-LAB': {
    '80048': 18.50,
    '80053': 24.00,
    '80061': 32.00,
    '85025': 12.50,
    '85027': 10.00,
    '84443': 35.00,
    '82728': 28.00,
    '83036': 22.00,
    '81001': 6.50,
    '87086': 15.00,
  },
};

// ============================================================================
// MOCK DATA - Case Rates
// ============================================================================

const CASE_RATES: Record<string, { description: string; rate: number }> = {
  '27447': { description: 'Total Knee Replacement', rate: 15500.00 },
  '27130': { description: 'Total Hip Replacement', rate: 14800.00 },
  '29881': { description: 'Knee Arthroscopy', rate: 4200.00 },
  '63030': { description: 'Lumbar Discectomy', rate: 12500.00 },
  '33533': { description: 'CABG Single Graft', rate: 38500.00 },
};

// ============================================================================
// MODIFIER ADJUSTMENTS
// ============================================================================

const MODIFIER_ADJUSTMENTS: Record<string, { percent: number; description: string }> = {
  '26': { percent: 0.26, description: 'Professional component only' },
  'TC': { percent: 0.74, description: 'Technical component only' },
  '50': { percent: 1.50, description: 'Bilateral procedure' },
  '51': { percent: 0.50, description: 'Multiple procedures (2nd+)' },
  '52': { percent: 0.50, description: 'Reduced services' },
  '22': { percent: 1.25, description: 'Increased procedural services' },
  '59': { percent: 1.00, description: 'Distinct procedural service' },
  '80': { percent: 0.16, description: 'Assistant surgeon' },
  '82': { percent: 0.16, description: 'Assistant surgeon (no resident)' },
  '25': { percent: 1.00, description: 'Significant, separately identifiable E/M' },
};

// ============================================================================
// REPRICING ENGINE CLASS
// ============================================================================

export class RepricingEngine {
  /**
   * Reprice a complete claim with all service lines
   */
  async repriceClaim(request: RepricingRequest): Promise<RepricingResponse> {
    const startTime = Date.now();
    const transactionId = `RPR-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    
    // Find provider contract
    const contract = this.findContract(request.providerNpi, request.serviceDate);
    
    if (!contract && request.networkStatus === 'IN_NETWORK') {
      // No contract found - treat as out of network
      return this.createOutOfNetworkResponse(request, transactionId, startTime);
    }
    
    // Reprice each line
    const lines: RepricedLine[] = [];
    const warnings: string[] = [];
    const flags: string[] = [];
    
    for (const line of request.lines) {
      const repricedLine = await this.repriceLine(line, contract, request);
      lines.push(repricedLine);
      
      // Track high-value services
      if (line.billedAmount > 5000) {
        flags.push(`high-value-line-${line.lineNumber}`);
      }
      
      // Track significant savings
      if (repricedLine.savingsPercent > 50) {
        warnings.push(`Line ${line.lineNumber}: ${repricedLine.savingsPercent.toFixed(0)}% reduction from billed charges`);
      }
    }
    
    // Calculate totals
    const totalAllowedAmount = lines.reduce((sum, l) => sum + l.allowedAmount, 0);
    const totalSavings = request.totalBilledAmount - totalAllowedAmount;
    
    return {
      claimId: request.claimId,
      transactionId,
      timestamp: new Date().toISOString(),
      processingTimeMs: Date.now() - startTime,
      
      summary: {
        totalBilledAmount: request.totalBilledAmount,
        totalAllowedAmount: Math.round(totalAllowedAmount * 100) / 100,
        totalSavings: Math.round(totalSavings * 100) / 100,
        savingsPercent: Math.round((totalSavings / request.totalBilledAmount) * 100 * 10) / 10,
        lineCount: lines.length,
        approvedLines: lines.filter(l => l.status === 'APPROVED').length,
        deniedLines: lines.filter(l => l.status === 'DENIED').length,
      },
      
      contract: contract ? {
        contractId: contract.id,
        contractNumber: contract.contractNumber,
        providerName: contract.providerName,
        providerNpi: contract.providerNpi,
        feeStructureType: contract.feeStructureType,
        baseRatePercent: contract.baseRatePercent,
        network: contract.network,
        effectiveDate: contract.effectiveDate,
        terminationDate: contract.terminationDate,
      } : {
        contractId: 'OON',
        contractNumber: 'OUT-OF-NETWORK',
        providerName: request.providerName || 'Unknown Provider',
        providerNpi: request.providerNpi,
        feeStructureType: 'PERCENT_OF_MEDICARE',
        baseRatePercent: 80,
        network: 'Out of Network',
        effectiveDate: '2024-01-01',
      },
      
      lines,
      flags,
      warnings,
      
      auditTrail: {
        requestedAt: new Date().toISOString(),
        calculationMethod: contract?.feeStructureType || 'OUT_OF_NETWORK',
        feeScheduleUsed: contract?.feeScheduleId,
      },
    };
  }
  
  /**
   * Reprice a single service line
   */
  private async repriceLine(
    line: ClaimLine,
    contract: ProviderContract | null,
    request: RepricingRequest
  ): Promise<RepricedLine> {
    // If no contract, use OON rates
    if (!contract) {
      return this.repriceOutOfNetwork(line);
    }
    
    let allowedAmount: number;
    let rateDetails: RepricedLine['rateDetails'];
    
    switch (contract.feeStructureType) {
      case 'PERCENT_OF_MEDICARE':
        const medicareResult = this.calculateMedicarePercent(line, contract.baseRatePercent || 100);
        allowedAmount = medicareResult.allowedAmount;
        rateDetails = medicareResult.details;
        break;
        
      case 'PERCENT_OF_BILLED':
        allowedAmount = line.billedAmount * ((contract.baseRatePercent || 80) / 100);
        rateDetails = {
          baseRate: line.billedAmount,
          adjustmentPercent: contract.baseRatePercent,
          rateSource: `${contract.baseRatePercent}% of billed charges`,
        };
        break;
        
      case 'FIXED_FEE_SCHEDULE':
        const fsResult = this.calculateFeeSchedule(line, contract.feeScheduleId!);
        allowedAmount = fsResult.allowedAmount;
        rateDetails = fsResult.details;
        break;
        
      case 'CASE_RATE':
        const caseResult = this.calculateCaseRate(line);
        allowedAmount = caseResult.allowedAmount;
        rateDetails = caseResult.details;
        break;
        
      case 'CAPITATION':
        allowedAmount = 0;
        rateDetails = {
          rateSource: 'Capitated - no fee-for-service payment',
        };
        break;
        
      default:
        const defaultResult = this.calculateMedicarePercent(line, 100);
        allowedAmount = defaultResult.allowedAmount;
        rateDetails = defaultResult.details;
    }
    
    // Apply modifier adjustments
    if (line.modifier && MODIFIER_ADJUSTMENTS[line.modifier]) {
      const modAdj = MODIFIER_ADJUSTMENTS[line.modifier];
      const originalAllowed = allowedAmount;
      allowedAmount = allowedAmount * modAdj.percent;
      rateDetails.modifierAdjustment = allowedAmount - originalAllowed;
      rateDetails.rateSource += ` (${line.modifier}: ${modAdj.description})`;
    }
    
    // Apply quantity
    allowedAmount = allowedAmount * line.quantity;
    
    // Round to cents
    allowedAmount = Math.round(allowedAmount * 100) / 100;
    
    const savingsAmount = line.billedAmount - allowedAmount;
    const savingsPercent = (savingsAmount / line.billedAmount) * 100;
    
    // Determine status
    let status: RepricedLine['status'] = 'APPROVED';
    let statusReason: string | undefined;
    
    if (allowedAmount === 0 && contract.feeStructureType !== 'CAPITATION') {
      status = 'DENIED';
      statusReason = 'No rate found for procedure';
    } else if (savingsPercent > 70) {
      status = 'PENDING_REVIEW';
      statusReason = 'Significant price reduction - requires review';
    } else if (line.billedAmount > 10000) {
      status = 'PENDING_REVIEW';
      statusReason = 'High-value service - requires review';
    }
    
    return {
      lineNumber: line.lineNumber,
      cptCode: line.cptCode,
      modifier: line.modifier,
      description: line.description || MEDICARE_FEE_SCHEDULE[line.cptCode]?.description || 'Unknown procedure',
      billedAmount: line.billedAmount,
      allowedAmount,
      savingsAmount: Math.round(savingsAmount * 100) / 100,
      savingsPercent: Math.round(savingsPercent * 10) / 10,
      rateType: contract.feeStructureType,
      rateDetails,
      status,
      statusReason,
    };
  }
  
  /**
   * Calculate allowed amount based on Medicare fee schedule percentage
   */
  private calculateMedicarePercent(
    line: ClaimLine,
    percentOfMedicare: number
  ): { allowedAmount: number; details: RepricedLine['rateDetails'] } {
    const medicareRate = MEDICARE_FEE_SCHEDULE[line.cptCode];
    
    if (!medicareRate) {
      // No Medicare rate found - use 80% of billed as fallback
      const fallbackRate = line.billedAmount * 0.4;
      return {
        allowedAmount: fallbackRate * (percentOfMedicare / 100),
        details: {
          baseRate: fallbackRate,
          adjustmentPercent: percentOfMedicare,
          rateSource: `${percentOfMedicare}% of estimated rate (no Medicare rate found)`,
        },
      };
    }
    
    // Determine facility vs non-facility rate
    const isFacility = ['21', '22', '23', '24'].includes(line.placeOfService);
    const baseRate = isFacility ? medicareRate.facility : medicareRate.nonFacility;
    const allowedAmount = baseRate * (percentOfMedicare / 100);
    
    return {
      allowedAmount,
      details: {
        baseRate,
        adjustmentPercent: percentOfMedicare,
        rateSource: `${percentOfMedicare}% of Medicare (${isFacility ? 'facility' : 'non-facility'} rate)`,
      },
    };
  }
  
  /**
   * Calculate allowed amount from custom fee schedule
   */
  private calculateFeeSchedule(
    line: ClaimLine,
    feeScheduleId: string
  ): { allowedAmount: number; details: RepricedLine['rateDetails'] } {
    const schedule = CUSTOM_FEE_SCHEDULES[feeScheduleId];
    
    if (!schedule || !schedule[line.cptCode]) {
      // Fall back to Medicare 100%
      return this.calculateMedicarePercent(line, 100);
    }
    
    const allowedAmount = schedule[line.cptCode];
    
    return {
      allowedAmount,
      details: {
        baseRate: allowedAmount,
        rateSource: `Custom fee schedule: ${feeScheduleId}`,
      },
    };
  }
  
  /**
   * Calculate case rate for surgical procedures
   */
  private calculateCaseRate(
    line: ClaimLine
  ): { allowedAmount: number; details: RepricedLine['rateDetails'] } {
    const caseRate = CASE_RATES[line.cptCode];
    
    if (!caseRate) {
      // No case rate - fall back to Medicare 100%
      return this.calculateMedicarePercent(line, 100);
    }
    
    return {
      allowedAmount: caseRate.rate,
      details: {
        baseRate: caseRate.rate,
        rateSource: `Case rate: ${caseRate.description}`,
      },
    };
  }
  
  /**
   * Reprice out-of-network services
   */
  private repriceOutOfNetwork(line: ClaimLine): RepricedLine {
    // OON typically pays 60-80% of Medicare
    const { allowedAmount, details } = this.calculateMedicarePercent(line, 60);
    
    return {
      lineNumber: line.lineNumber,
      cptCode: line.cptCode,
      modifier: line.modifier,
      description: line.description || MEDICARE_FEE_SCHEDULE[line.cptCode]?.description || 'Unknown procedure',
      billedAmount: line.billedAmount,
      allowedAmount: Math.round(allowedAmount * line.quantity * 100) / 100,
      savingsAmount: Math.round((line.billedAmount - allowedAmount * line.quantity) * 100) / 100,
      savingsPercent: Math.round(((line.billedAmount - allowedAmount * line.quantity) / line.billedAmount) * 100 * 10) / 10,
      rateType: 'PERCENT_OF_MEDICARE',
      rateDetails: {
        ...details,
        rateSource: 'Out-of-network: 60% of Medicare',
      },
      status: 'ADJUSTED',
      statusReason: 'Out-of-network provider - reduced reimbursement',
    };
  }
  
  /**
   * Create response for claims with no contract
   */
  private createOutOfNetworkResponse(
    request: RepricingRequest,
    transactionId: string,
    startTime: number
  ): RepricingResponse {
    const lines: RepricedLine[] = request.lines.map(line => this.repriceOutOfNetwork(line));
    const totalAllowedAmount = lines.reduce((sum, l) => sum + l.allowedAmount, 0);
    const totalSavings = request.totalBilledAmount - totalAllowedAmount;
    
    return {
      claimId: request.claimId,
      transactionId,
      timestamp: new Date().toISOString(),
      processingTimeMs: Date.now() - startTime,
      
      summary: {
        totalBilledAmount: request.totalBilledAmount,
        totalAllowedAmount: Math.round(totalAllowedAmount * 100) / 100,
        totalSavings: Math.round(totalSavings * 100) / 100,
        savingsPercent: Math.round((totalSavings / request.totalBilledAmount) * 100 * 10) / 10,
        lineCount: lines.length,
        approvedLines: 0,
        deniedLines: 0,
      },
      
      contract: {
        contractId: 'OON',
        contractNumber: 'OUT-OF-NETWORK',
        providerName: request.providerName || 'Unknown Provider',
        providerNpi: request.providerNpi,
        feeStructureType: 'PERCENT_OF_MEDICARE',
        baseRatePercent: 60,
        network: 'Out of Network',
        effectiveDate: '2024-01-01',
      },
      
      lines,
      flags: ['out-of-network'],
      warnings: ['Provider is out of network - member may be balance billed'],
      
      auditTrail: {
        requestedAt: new Date().toISOString(),
        calculationMethod: 'OUT_OF_NETWORK',
      },
    };
  }
  
  /**
   * Find active contract for provider
   */
  private findContract(providerNpi: string, serviceDate: string): ProviderContract | null {
    const date = new Date(serviceDate);
    
    return PROVIDER_CONTRACTS.find(c => {
      if (c.providerNpi !== providerNpi) return false;
      if (new Date(c.effectiveDate) > date) return false;
      if (c.terminationDate && new Date(c.terminationDate) < date) return false;
      return true;
    }) || null;
  }
  
  /**
   * Get all provider contracts
   */
  getContracts(): ProviderContract[] {
    return PROVIDER_CONTRACTS;
  }
  
  /**
   * Get Medicare fee schedule
   */
  getMedicareFeeSchedule(): typeof MEDICARE_FEE_SCHEDULE {
    return MEDICARE_FEE_SCHEDULE;
  }
  
  /**
   * Lookup a single CPT code
   */
  lookupCptCode(cptCode: string): typeof MEDICARE_FEE_SCHEDULE[string] | null {
    return MEDICARE_FEE_SCHEDULE[cptCode] || null;
  }
}

// Export singleton instance
export const repricingEngine = new RepricingEngine();

// Export types
export type { ProviderContract };
