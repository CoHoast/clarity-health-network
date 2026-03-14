/**
 * Fraud Detection Engine
 * 
 * AI/ML-powered detection of healthcare fraud, waste, and abuse (FWA).
 * Adapted from DOKit Fraud Detection module for MedCare Health Network.
 * 
 * Features:
 * - Rule-based detection (20+ pre-built rules)
 * - Statistical anomaly detection
 * - Composite scoring (0-100)
 * - Risk level classification
 * - Case recommendations
 */

// ============================================================================
// TYPES
// ============================================================================

export type FraudCategory = 
  | 'upcoding'
  | 'unbundling'
  | 'duplicate'
  | 'impossible_day'
  | 'geographic'
  | 'doctor_shopping'
  | 'identity_fraud'
  | 'provider_exclusion'
  | 'phantom_billing'
  | 'kickback';

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export type RiskLevel = 'minimal' | 'low' | 'medium' | 'high' | 'critical';

export type RecommendedAction = 'approve' | 'flag' | 'pend' | 'deny' | 'investigate';

export interface ClaimForScoring {
  claimId: string;
  memberId: string;
  memberName?: string;
  memberDob?: string;
  providerNpi: string;
  providerName?: string;
  providerTaxonomy?: string;
  claimType: 'PROFESSIONAL' | 'INSTITUTIONAL';
  serviceDate: string;
  submittedDate?: string;
  totalBilledAmount: number;
  diagnosisCodes: string[];
  lines: Array<{
    cptCode: string;
    modifier?: string;
    quantity: number;
    billedAmount: number;
    placeOfService?: string;
  }>;
}

export interface TriggeredRule {
  ruleId: string;
  ruleName: string;
  category: FraudCategory;
  severity: Severity;
  score: number;
  details: string;
  evidence?: Record<string, unknown>;
}

export interface Anomaly {
  type: string;
  description: string;
  score: number;
  zScore?: number;
  percentile?: number;
  comparison?: {
    actual: number;
    peerAverage: number;
    peerStdDev: number;
  };
}

export interface FraudScore {
  claimId: string;
  transactionId: string;
  timestamp: string;
  processingTimeMs: number;
  
  // Scores
  ruleScore: number;
  statisticalScore: number;
  mlScore: number;
  networkScore: number;
  compositeScore: number;
  
  // Risk assessment
  riskLevel: RiskLevel;
  recommendedAction: RecommendedAction;
  
  // Details
  triggeredRules: TriggeredRule[];
  anomalies: Anomaly[];
  
  // Savings estimate
  potentialSavings?: number;
  
  // Provider & Member risk
  providerRiskFactors: string[];
  memberRiskFactors: string[];
  
  // Summary
  summary: string;
}

// ============================================================================
// FRAUD RULES DATABASE
// ============================================================================

interface FraudRule {
  ruleId: string;
  name: string;
  category: FraudCategory;
  severity: Severity;
  score: number;
  description: string;
  evaluate: (claim: ClaimForScoring, context: EvaluationContext) => RuleResult | null;
}

interface RuleResult {
  triggered: boolean;
  details: string;
  evidence?: Record<string, unknown>;
}

interface EvaluationContext {
  providerHistory: ProviderProfile | null;
  memberHistory: MemberProfile | null;
  recentClaims: ClaimForScoring[];
  peerAverages: PeerAverages | null;
}

interface ProviderProfile {
  npi: string;
  name: string;
  totalClaims: number;
  avgDailyPatients: number;
  avgClaimAmount: number;
  emLevelDistribution: Record<string, number>;
  modifier59Rate: number;
  modifier25Rate: number;
  denialRate: number;
  isNewProvider: boolean;
  lastClaimDate: string;
}

interface MemberProfile {
  memberId: string;
  name: string;
  totalClaims: number;
  erVisits: number;
  uniqueProviders: number;
  controlledSubstancePrescribers: number;
  avgMonthlySpend: number;
}

interface PeerAverages {
  avgDailyPatients: number;
  avgClaimAmount: number;
  modifier59Rate: number;
  modifier25Rate: number;
  emLevel4PlusRate: number;
}

// ============================================================================
// PRE-BUILT FRAUD RULES (20+)
// ============================================================================

const FRAUD_RULES: FraudRule[] = [
  // UPCODING RULES
  {
    ruleId: 'UPC001',
    name: 'E&M Level Inflation',
    category: 'upcoding',
    severity: 'high',
    score: 25,
    description: 'Provider bills high-level E&M codes (99215/99205) at rates significantly above peers',
    evaluate: (claim, ctx) => {
      const highLevelCodes = ['99215', '99205', '99214', '99204'];
      const hasHighLevel = claim.lines.some(l => highLevelCodes.includes(l.cptCode));
      if (!hasHighLevel || !ctx.providerHistory) return null;
      
      const highLevelRate = ctx.providerHistory.emLevelDistribution['99215'] || 0;
      const peerRate = ctx.peerAverages?.emLevel4PlusRate || 0.15;
      
      if (highLevelRate > peerRate * 2) {
        return {
          triggered: true,
          details: `Provider bills 99215 at ${(highLevelRate * 100).toFixed(1)}% vs peer average ${(peerRate * 100).toFixed(1)}%`,
          evidence: { providerRate: highLevelRate, peerRate }
        };
      }
      return null;
    }
  },
  {
    ruleId: 'UPC002',
    name: 'Consistent High-Level Billing',
    category: 'upcoding',
    severity: 'medium',
    score: 15,
    description: 'Provider rarely bills lower-level E&M codes',
    evaluate: (claim, ctx) => {
      if (!ctx.providerHistory) return null;
      const dist = ctx.providerHistory.emLevelDistribution;
      const lowLevelRate = (dist['99211'] || 0) + (dist['99212'] || 0) + (dist['99213'] || 0);
      
      if (lowLevelRate < 0.1 && ctx.providerHistory.totalClaims > 50) {
        return {
          triggered: true,
          details: `Only ${(lowLevelRate * 100).toFixed(1)}% of E&M claims are level 1-3`,
          evidence: { distribution: dist }
        };
      }
      return null;
    }
  },
  
  // UNBUNDLING RULES
  {
    ruleId: 'UNB001',
    name: 'CCI Edit Bypass - Modifier 59',
    category: 'unbundling',
    severity: 'medium',
    score: 20,
    description: 'Excessive use of modifier 59 to bypass bundling edits',
    evaluate: (claim, ctx) => {
      const mod59Lines = claim.lines.filter(l => l.modifier === '59');
      if (mod59Lines.length === 0 || !ctx.providerHistory) return null;
      
      const peerRate = ctx.peerAverages?.modifier59Rate || 0.05;
      if (ctx.providerHistory.modifier59Rate > peerRate * 3) {
        return {
          triggered: true,
          details: `Modifier 59 usage at ${(ctx.providerHistory.modifier59Rate * 100).toFixed(1)}% vs peer ${(peerRate * 100).toFixed(1)}%`,
          evidence: { providerRate: ctx.providerHistory.modifier59Rate, peerRate }
        };
      }
      return null;
    }
  },
  {
    ruleId: 'UNB002',
    name: 'Component Billing',
    category: 'unbundling',
    severity: 'medium',
    score: 18,
    description: 'Billing components separately that should be bundled',
    evaluate: (claim) => {
      // Check for common unbundling patterns
      const codes = claim.lines.map(l => l.cptCode);
      
      // CBC components billed separately
      if (codes.includes('85025') && (codes.includes('85027') || codes.includes('85004'))) {
        return {
          triggered: true,
          details: 'CBC components billed separately - should use 85025 only',
          evidence: { codes }
        };
      }
      
      // CMP components
      if (codes.includes('80053') && codes.some(c => ['80048', '84443', '82728'].includes(c))) {
        return {
          triggered: true,
          details: 'Metabolic panel components billed with comprehensive panel',
          evidence: { codes }
        };
      }
      
      return null;
    }
  },
  
  // DUPLICATE BILLING
  {
    ruleId: 'DUP001',
    name: 'Exact Duplicate Claim',
    category: 'duplicate',
    severity: 'high',
    score: 30,
    description: 'Claim appears to be exact duplicate of previous submission',
    evaluate: (claim, ctx) => {
      const duplicates = ctx.recentClaims.filter(c => 
        c.claimId !== claim.claimId &&
        c.memberId === claim.memberId &&
        c.providerNpi === claim.providerNpi &&
        c.serviceDate === claim.serviceDate &&
        c.totalBilledAmount === claim.totalBilledAmount
      );
      
      if (duplicates.length > 0) {
        return {
          triggered: true,
          details: `Exact duplicate of claim ${duplicates[0].claimId}`,
          evidence: { duplicateClaimId: duplicates[0].claimId }
        };
      }
      return null;
    }
  },
  {
    ruleId: 'DUP002',
    name: 'Near Duplicate Claim',
    category: 'duplicate',
    severity: 'medium',
    score: 20,
    description: 'Claim very similar to recent submission',
    evaluate: (claim, ctx) => {
      const nearDupes = ctx.recentClaims.filter(c => 
        c.claimId !== claim.claimId &&
        c.memberId === claim.memberId &&
        c.providerNpi === claim.providerNpi &&
        c.serviceDate === claim.serviceDate &&
        Math.abs(c.totalBilledAmount - claim.totalBilledAmount) < 50
      );
      
      if (nearDupes.length > 0) {
        return {
          triggered: true,
          details: `Near duplicate - same member/provider/date, similar amount`,
          evidence: { similarClaimId: nearDupes[0].claimId, amountDiff: Math.abs(nearDupes[0].totalBilledAmount - claim.totalBilledAmount) }
        };
      }
      return null;
    }
  },
  
  // IMPOSSIBLE DAY
  {
    ruleId: 'IMP001',
    name: 'Impossible Patient Volume',
    category: 'impossible_day',
    severity: 'critical',
    score: 40,
    description: 'Provider billed for impossibly high number of patients in single day',
    evaluate: (claim, ctx) => {
      if (!ctx.providerHistory) return null;
      
      // Count claims on same date
      const sameDayClaims = ctx.recentClaims.filter(c => 
        c.providerNpi === claim.providerNpi && 
        c.serviceDate === claim.serviceDate
      );
      
      if (sameDayClaims.length > 50) {
        return {
          triggered: true,
          details: `${sameDayClaims.length} patients billed on single day`,
          evidence: { patientCount: sameDayClaims.length }
        };
      }
      return null;
    }
  },
  {
    ruleId: 'IMP002',
    name: 'Excessive Daily Hours',
    category: 'impossible_day',
    severity: 'high',
    score: 35,
    description: 'Time-based services exceed 24 hours in a day',
    evaluate: (claim) => {
      // Check for time-based codes (therapy, psych)
      const timeCodes = ['90837', '90834', '97110', '97140', '97530'];
      const timeLines = claim.lines.filter(l => timeCodes.includes(l.cptCode));
      
      // Estimate total time (15-60 min per code depending on type)
      const totalMinutes = timeLines.reduce((sum, l) => {
        const mins = l.cptCode.startsWith('97') ? 15 : 45; // PT = 15min, therapy = 45min
        return sum + (mins * l.quantity);
      }, 0);
      
      if (totalMinutes > 720) { // 12 hours
        return {
          triggered: true,
          details: `${(totalMinutes / 60).toFixed(1)} hours of time-based services on single date`,
          evidence: { totalMinutes, totalHours: totalMinutes / 60 }
        };
      }
      return null;
    }
  },
  
  // GEOGRAPHIC IMPOSSIBILITY
  {
    ruleId: 'GEO001',
    name: 'Geographic Impossibility',
    category: 'geographic',
    severity: 'high',
    score: 30,
    description: 'Member received services at distant locations on same day',
    evaluate: (claim, ctx) => {
      // Check for services at multiple providers on same day
      const sameDayClaims = ctx.recentClaims.filter(c => 
        c.memberId === claim.memberId && 
        c.serviceDate === claim.serviceDate &&
        c.providerNpi !== claim.providerNpi
      );
      
      // Simplified - in real system would check actual distances
      if (sameDayClaims.length > 3) {
        return {
          triggered: true,
          details: `Member visited ${sameDayClaims.length + 1} different providers on same day`,
          evidence: { providerCount: sameDayClaims.length + 1 }
        };
      }
      return null;
    }
  },
  
  // DOCTOR SHOPPING
  {
    ruleId: 'RX001',
    name: 'Controlled Substance Doctor Shopping',
    category: 'doctor_shopping',
    severity: 'critical',
    score: 45,
    description: 'Member obtaining controlled substances from multiple prescribers',
    evaluate: (claim, ctx) => {
      if (!ctx.memberHistory) return null;
      
      if (ctx.memberHistory.controlledSubstancePrescribers > 4) {
        return {
          triggered: true,
          details: `Member has ${ctx.memberHistory.controlledSubstancePrescribers} different controlled substance prescribers`,
          evidence: { prescriberCount: ctx.memberHistory.controlledSubstancePrescribers }
        };
      }
      return null;
    }
  },
  
  // PROVIDER EXCLUSION
  {
    ruleId: 'EXC001',
    name: 'OIG Excluded Provider',
    category: 'provider_exclusion',
    severity: 'critical',
    score: 50,
    description: 'Provider is on OIG exclusion list',
    evaluate: (claim) => {
      // Mock check - in real system would query OIG LEIE database
      const excludedNPIs = ['9999999999', '8888888888'];
      
      if (excludedNPIs.includes(claim.providerNpi)) {
        return {
          triggered: true,
          details: 'Provider found on OIG exclusion list',
          evidence: { npi: claim.providerNpi, database: 'OIG LEIE' }
        };
      }
      return null;
    }
  },
  {
    ruleId: 'EXC002',
    name: 'SAM Excluded Entity',
    category: 'provider_exclusion',
    severity: 'critical',
    score: 50,
    description: 'Provider is in SAM exclusion database',
    evaluate: (claim) => {
      // Mock check
      const excludedNPIs = ['7777777777'];
      
      if (excludedNPIs.includes(claim.providerNpi)) {
        return {
          triggered: true,
          details: 'Provider found in SAM exclusion database',
          evidence: { npi: claim.providerNpi, database: 'SAM.gov' }
        };
      }
      return null;
    }
  },
  
  // IDENTITY FRAUD
  {
    ruleId: 'ID001',
    name: 'Deceased Member Billing',
    category: 'identity_fraud',
    severity: 'critical',
    score: 50,
    description: 'Claim submitted for deceased member',
    evaluate: (claim) => {
      // Mock check - would query death master file
      const deceasedMembers = ['DECEASED-001', 'DECEASED-002'];
      
      if (deceasedMembers.includes(claim.memberId)) {
        return {
          triggered: true,
          details: 'Member marked as deceased in SSA Death Master File',
          evidence: { memberId: claim.memberId }
        };
      }
      return null;
    }
  },
  {
    ruleId: 'ID002',
    name: 'High ID Card Velocity',
    category: 'identity_fraud',
    severity: 'high',
    score: 35,
    description: 'Member ID used at unusually high rate across providers',
    evaluate: (claim, ctx) => {
      if (!ctx.memberHistory) return null;
      
      // High number of unique providers in short time
      if (ctx.memberHistory.uniqueProviders > 15 && ctx.memberHistory.totalClaims < 30) {
        return {
          triggered: true,
          details: `${ctx.memberHistory.uniqueProviders} different providers for ${ctx.memberHistory.totalClaims} claims`,
          evidence: { uniqueProviders: ctx.memberHistory.uniqueProviders, totalClaims: ctx.memberHistory.totalClaims }
        };
      }
      return null;
    }
  },
  
  // PHANTOM BILLING
  {
    ruleId: 'PHT001',
    name: 'Services After Death',
    category: 'phantom_billing',
    severity: 'critical',
    score: 50,
    description: 'Services billed after member date of death',
    evaluate: (claim) => {
      // Would check DOD in real system
      return null;
    }
  },
  {
    ruleId: 'PHT002',
    name: 'Weekend/Holiday Anomaly',
    category: 'phantom_billing',
    severity: 'medium',
    score: 15,
    description: 'Non-emergency services billed on weekend or major holiday',
    evaluate: (claim) => {
      const serviceDate = new Date(claim.serviceDate);
      const dayOfWeek = serviceDate.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      // Check for non-emergency codes on weekend
      const emergencyCodes = ['99281', '99282', '99283', '99284', '99285'];
      const hasEmergency = claim.lines.some(l => emergencyCodes.includes(l.cptCode));
      
      if (isWeekend && !hasEmergency && claim.lines.some(l => l.cptCode.startsWith('992'))) {
        return {
          triggered: true,
          details: `Office visit billed on ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek]}`,
          evidence: { dayOfWeek, serviceDate: claim.serviceDate }
        };
      }
      return null;
    }
  },
  
  // HIGH AMOUNT
  {
    ruleId: 'AMT001',
    name: 'Unusually High Charge',
    category: 'upcoding',
    severity: 'medium',
    score: 15,
    description: 'Claim amount significantly higher than typical',
    evaluate: (claim, ctx) => {
      if (!ctx.peerAverages) return null;
      
      if (claim.totalBilledAmount > ctx.peerAverages.avgClaimAmount * 5) {
        return {
          triggered: true,
          details: `Claim amount $${claim.totalBilledAmount.toFixed(2)} is ${(claim.totalBilledAmount / ctx.peerAverages.avgClaimAmount).toFixed(1)}x peer average`,
          evidence: { claimAmount: claim.totalBilledAmount, peerAverage: ctx.peerAverages.avgClaimAmount }
        };
      }
      return null;
    }
  },
  
  // NEW PROVIDER
  {
    ruleId: 'NEW001',
    name: 'New Provider High Volume',
    category: 'phantom_billing',
    severity: 'medium',
    score: 20,
    description: 'Newly enrolled provider with unusually high claim volume',
    evaluate: (claim, ctx) => {
      if (!ctx.providerHistory) return null;
      
      if (ctx.providerHistory.isNewProvider && ctx.providerHistory.totalClaims > 100) {
        return {
          triggered: true,
          details: `New provider with ${ctx.providerHistory.totalClaims} claims in first 90 days`,
          evidence: { claimCount: ctx.providerHistory.totalClaims }
        };
      }
      return null;
    }
  },
  
  // MODIFIER 25 ABUSE
  {
    ruleId: 'MOD001',
    name: 'Modifier 25 Overuse',
    category: 'upcoding',
    severity: 'medium',
    score: 18,
    description: 'Excessive use of modifier 25 to bill E&M with procedures',
    evaluate: (claim, ctx) => {
      const mod25Lines = claim.lines.filter(l => l.modifier === '25');
      if (mod25Lines.length === 0 || !ctx.providerHistory) return null;
      
      const peerRate = ctx.peerAverages?.modifier25Rate || 0.1;
      if (ctx.providerHistory.modifier25Rate > peerRate * 2.5) {
        return {
          triggered: true,
          details: `Modifier 25 usage at ${(ctx.providerHistory.modifier25Rate * 100).toFixed(1)}% vs peer ${(peerRate * 100).toFixed(1)}%`,
          evidence: { providerRate: ctx.providerHistory.modifier25Rate, peerRate }
        };
      }
      return null;
    }
  },
];

// ============================================================================
// MOCK DATA - Provider Profiles
// ============================================================================

const PROVIDER_PROFILES: Record<string, ProviderProfile> = {
  '1234567890': {
    npi: '1234567890',
    name: 'Cleveland Family Medicine',
    totalClaims: 2450,
    avgDailyPatients: 18,
    avgClaimAmount: 165,
    emLevelDistribution: { '99211': 0.05, '99212': 0.15, '99213': 0.45, '99214': 0.30, '99215': 0.05 },
    modifier59Rate: 0.03,
    modifier25Rate: 0.08,
    denialRate: 0.04,
    isNewProvider: false,
    lastClaimDate: '2024-03-10'
  },
  '3456789012': {
    npi: '3456789012',
    name: 'Metro Imaging Center',
    totalClaims: 1850,
    avgDailyPatients: 45,
    avgClaimAmount: 485,
    emLevelDistribution: {},
    modifier59Rate: 0.12,
    modifier25Rate: 0.02,
    denialRate: 0.06,
    isNewProvider: false,
    lastClaimDate: '2024-03-11'
  },
  '9012345678': {
    npi: '9012345678',
    name: 'Cleveland Cardiology',
    totalClaims: 890,
    avgDailyPatients: 12,
    avgClaimAmount: 380,
    emLevelDistribution: { '99213': 0.20, '99214': 0.55, '99215': 0.25 },
    modifier59Rate: 0.08,
    modifier25Rate: 0.15,
    denialRate: 0.03,
    isNewProvider: false,
    lastClaimDate: '2024-03-09'
  },
  // Suspicious provider
  '1111111111': {
    npi: '1111111111',
    name: 'ABC Medical Group',
    totalClaims: 450,
    avgDailyPatients: 65,
    avgClaimAmount: 890,
    emLevelDistribution: { '99214': 0.35, '99215': 0.65 },
    modifier59Rate: 0.28,
    modifier25Rate: 0.45,
    denialRate: 0.18,
    isNewProvider: true,
    lastClaimDate: '2024-03-10'
  },
};

const MEMBER_PROFILES: Record<string, MemberProfile> = {
  'CHN-123456': {
    memberId: 'CHN-123456',
    name: 'John Doe',
    totalClaims: 12,
    erVisits: 1,
    uniqueProviders: 4,
    controlledSubstancePrescribers: 1,
    avgMonthlySpend: 185
  },
  'CHN-789012': {
    memberId: 'CHN-789012',
    name: 'David Kim',
    totalClaims: 45,
    erVisits: 8,
    uniqueProviders: 18,
    controlledSubstancePrescribers: 6,
    avgMonthlySpend: 2850
  },
};

const PEER_AVERAGES: PeerAverages = {
  avgDailyPatients: 22,
  avgClaimAmount: 215,
  modifier59Rate: 0.05,
  modifier25Rate: 0.12,
  emLevel4PlusRate: 0.25
};

// ============================================================================
// FRAUD DETECTION ENGINE
// ============================================================================

export class FraudDetectionEngine {
  private weights = {
    rules: 0.35,
    statistical: 0.25,
    ml: 0.30,
    network: 0.10,
  };

  /**
   * Score a single claim for fraud indicators
   */
  async scoreClaim(claim: ClaimForScoring): Promise<FraudScore> {
    const startTime = Date.now();
    const transactionId = `FRD-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    
    // Build evaluation context
    const context = this.buildContext(claim);
    
    // Run rule-based detection
    const triggeredRules: TriggeredRule[] = [];
    let ruleScore = 0;
    
    for (const rule of FRAUD_RULES) {
      try {
        const result = rule.evaluate(claim, context);
        if (result?.triggered) {
          triggeredRules.push({
            ruleId: rule.ruleId,
            ruleName: rule.name,
            category: rule.category,
            severity: rule.severity,
            score: rule.score,
            details: result.details,
            evidence: result.evidence,
          });
          ruleScore += rule.score;
        }
      } catch (e) {
        console.error(`Rule ${rule.ruleId} failed:`, e);
      }
    }
    ruleScore = Math.min(ruleScore, 100);
    
    // Run statistical anomaly detection
    const anomalies = this.detectAnomalies(claim, context);
    const statisticalScore = this.calculateStatisticalScore(anomalies);
    
    // Mock ML score (in production would call ML model)
    const mlScore = this.mockMLScore(claim, context);
    
    // Mock network score (would analyze provider-member graphs)
    const networkScore = this.mockNetworkScore(claim, context);
    
    // Calculate composite score
    const compositeScore = Math.round(
      (ruleScore * this.weights.rules) +
      (statisticalScore * this.weights.statistical) +
      (mlScore * this.weights.ml) +
      (networkScore * this.weights.network)
    );
    
    // Determine risk level and action
    const riskLevel = this.determineRiskLevel(compositeScore);
    const recommendedAction = this.determineAction(compositeScore, triggeredRules);
    
    // Calculate potential savings
    const potentialSavings = this.calculatePotentialSavings(claim, triggeredRules);
    
    // Build risk factors summary
    const providerRiskFactors = this.getProviderRiskFactors(context.providerHistory);
    const memberRiskFactors = this.getMemberRiskFactors(context.memberHistory);
    
    // Generate summary
    const summary = this.generateSummary(compositeScore, triggeredRules, riskLevel);
    
    return {
      claimId: claim.claimId,
      transactionId,
      timestamp: new Date().toISOString(),
      processingTimeMs: Date.now() - startTime,
      ruleScore,
      statisticalScore,
      mlScore,
      networkScore,
      compositeScore: Math.min(compositeScore, 100),
      riskLevel,
      recommendedAction,
      triggeredRules,
      anomalies,
      potentialSavings,
      providerRiskFactors,
      memberRiskFactors,
      summary,
    };
  }

  /**
   * Batch score multiple claims
   */
  async scoreClaimsBatch(claims: ClaimForScoring[]): Promise<FraudScore[]> {
    return Promise.all(claims.map(c => this.scoreClaim(c)));
  }

  private buildContext(claim: ClaimForScoring): EvaluationContext {
    return {
      providerHistory: PROVIDER_PROFILES[claim.providerNpi] || null,
      memberHistory: MEMBER_PROFILES[claim.memberId] || null,
      recentClaims: [], // Would query recent claims in production
      peerAverages: PEER_AVERAGES,
    };
  }

  private detectAnomalies(claim: ClaimForScoring, ctx: EvaluationContext): Anomaly[] {
    const anomalies: Anomaly[] = [];
    
    // Provider anomalies
    if (ctx.providerHistory && ctx.peerAverages) {
      const provider = ctx.providerHistory;
      const peers = ctx.peerAverages;
      
      // Daily patient volume
      if (provider.avgDailyPatients > peers.avgDailyPatients * 2) {
        const zScore = (provider.avgDailyPatients - peers.avgDailyPatients) / (peers.avgDailyPatients * 0.3);
        anomalies.push({
          type: 'provider_volume',
          description: 'Daily patient volume significantly above peers',
          score: Math.min(zScore * 10, 30),
          zScore,
          comparison: {
            actual: provider.avgDailyPatients,
            peerAverage: peers.avgDailyPatients,
            peerStdDev: peers.avgDailyPatients * 0.3
          }
        });
      }
      
      // Modifier 59 usage
      if (provider.modifier59Rate > peers.modifier59Rate * 2) {
        anomalies.push({
          type: 'modifier_59_usage',
          description: 'Modifier 59 usage above peer threshold',
          score: 15,
          comparison: {
            actual: provider.modifier59Rate,
            peerAverage: peers.modifier59Rate,
            peerStdDev: peers.modifier59Rate * 0.5
          }
        });
      }
    }
    
    // Claim amount anomaly
    if (ctx.peerAverages && claim.totalBilledAmount > ctx.peerAverages.avgClaimAmount * 3) {
      anomalies.push({
        type: 'high_claim_amount',
        description: 'Claim amount significantly above average',
        score: 10,
        comparison: {
          actual: claim.totalBilledAmount,
          peerAverage: ctx.peerAverages.avgClaimAmount,
          peerStdDev: ctx.peerAverages.avgClaimAmount * 0.5
        }
      });
    }
    
    // Member anomalies
    if (ctx.memberHistory) {
      if (ctx.memberHistory.erVisits > 6) {
        anomalies.push({
          type: 'high_er_utilization',
          description: 'High ER visit frequency',
          score: 12,
        });
      }
      
      if (ctx.memberHistory.controlledSubstancePrescribers > 3) {
        anomalies.push({
          type: 'multiple_prescribers',
          description: 'Multiple controlled substance prescribers',
          score: 25,
        });
      }
    }
    
    return anomalies;
  }

  private calculateStatisticalScore(anomalies: Anomaly[]): number {
    return Math.min(anomalies.reduce((sum, a) => sum + a.score, 0), 100);
  }

  private mockMLScore(claim: ClaimForScoring, ctx: EvaluationContext): number {
    // Simulated ML model output (0-100)
    let score = 10; // Base score
    
    // High amount
    if (claim.totalBilledAmount > 5000) score += 15;
    if (claim.totalBilledAmount > 10000) score += 20;
    
    // Provider risk
    if (ctx.providerHistory?.isNewProvider) score += 10;
    if (ctx.providerHistory?.denialRate && ctx.providerHistory.denialRate > 0.15) score += 15;
    
    // Member risk
    if (ctx.memberHistory?.erVisits && ctx.memberHistory.erVisits > 5) score += 10;
    
    // Add some randomness to simulate ML uncertainty
    score += Math.random() * 10 - 5;
    
    return Math.max(0, Math.min(score, 100));
  }

  private mockNetworkScore(claim: ClaimForScoring, ctx: EvaluationContext): number {
    // Simulated network analysis (0-100)
    let score = 5;
    
    // High unique providers for member
    if (ctx.memberHistory?.uniqueProviders && ctx.memberHistory.uniqueProviders > 10) {
      score += 15;
    }
    
    return Math.min(score, 100);
  }

  private determineRiskLevel(score: number): RiskLevel {
    if (score < 20) return 'minimal';
    if (score < 40) return 'low';
    if (score < 60) return 'medium';
    if (score < 80) return 'high';
    return 'critical';
  }

  private determineAction(score: number, rules: TriggeredRule[]): RecommendedAction {
    // Critical rules always require investigation
    if (rules.some(r => r.severity === 'critical')) return 'investigate';
    
    if (score < 20) return 'approve';
    if (score < 40) return 'flag';
    if (score < 60) return 'pend';
    if (score < 80) return 'deny';
    return 'investigate';
  }

  private calculatePotentialSavings(claim: ClaimForScoring, rules: TriggeredRule[]): number {
    if (rules.length === 0) return 0;
    
    // Estimate savings based on triggered rules
    const hasDuplicate = rules.some(r => r.category === 'duplicate');
    const hasUpcoding = rules.some(r => r.category === 'upcoding');
    const hasUnbundling = rules.some(r => r.category === 'unbundling');
    
    let savings = 0;
    if (hasDuplicate) savings = claim.totalBilledAmount; // Full claim
    if (hasUpcoding) savings = Math.max(savings, claim.totalBilledAmount * 0.25);
    if (hasUnbundling) savings = Math.max(savings, claim.totalBilledAmount * 0.15);
    
    return Math.round(savings * 100) / 100;
  }

  private getProviderRiskFactors(profile: ProviderProfile | null): string[] {
    if (!profile) return [];
    
    const factors: string[] = [];
    if (profile.isNewProvider) factors.push('New provider (< 90 days)');
    if (profile.denialRate > 0.1) factors.push(`High denial rate (${(profile.denialRate * 100).toFixed(1)}%)`);
    if (profile.modifier59Rate > 0.1) factors.push('Elevated modifier 59 usage');
    if (profile.modifier25Rate > 0.2) factors.push('Elevated modifier 25 usage');
    if (profile.avgDailyPatients > 40) factors.push(`High daily volume (${profile.avgDailyPatients} patients/day)`);
    
    return factors;
  }

  private getMemberRiskFactors(profile: MemberProfile | null): string[] {
    if (!profile) return [];
    
    const factors: string[] = [];
    if (profile.erVisits > 5) factors.push(`Frequent ER visits (${profile.erVisits})`);
    if (profile.controlledSubstancePrescribers > 3) factors.push(`Multiple opioid prescribers (${profile.controlledSubstancePrescribers})`);
    if (profile.uniqueProviders > 12) factors.push(`High provider count (${profile.uniqueProviders})`);
    if (profile.avgMonthlySpend > 2000) factors.push(`High monthly spend ($${profile.avgMonthlySpend.toLocaleString()})`);
    
    return factors;
  }

  private generateSummary(score: number, rules: TriggeredRule[], level: RiskLevel): string {
    if (rules.length === 0) {
      return 'No fraud indicators detected. Claim appears clean.';
    }
    
    const topRule = rules.sort((a, b) => b.score - a.score)[0];
    const categories = [...new Set(rules.map(r => r.category))];
    
    return `${rules.length} fraud indicator(s) detected across ${categories.length} categor${categories.length > 1 ? 'ies' : 'y'}. ` +
      `Primary concern: ${topRule.ruleName}. Risk level: ${level.toUpperCase()}.`;
  }

  /**
   * Get all available fraud rules
   */
  getRules(): Array<{
    ruleId: string;
    name: string;
    category: FraudCategory;
    severity: Severity;
    score: number;
    description: string;
  }> {
    return FRAUD_RULES.map(r => ({
      ruleId: r.ruleId,
      name: r.name,
      category: r.category,
      severity: r.severity,
      score: r.score,
      description: r.description,
    }));
  }

  /**
   * Get provider profile
   */
  getProviderProfile(npi: string): ProviderProfile | null {
    return PROVIDER_PROFILES[npi] || null;
  }

  /**
   * Get member profile
   */
  getMemberProfile(memberId: string): MemberProfile | null {
    return MEMBER_PROFILES[memberId] || null;
  }
}

// Export singleton
export const fraudDetectionEngine = new FraudDetectionEngine();
