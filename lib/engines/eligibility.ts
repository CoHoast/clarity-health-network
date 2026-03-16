/**
 * Eligibility Engine
 * 
 * Real-time member eligibility verification.
 * Adapted from DOKit Eligibility Engine for TrueCare Health Network.
 */

import prisma from '../db';

// ============================================================================
// TYPES
// ============================================================================

export interface EligibilityRequest {
  memberId: string;           // Member number (e.g., "MEM-12345")
  dateOfBirth: string;        // YYYY-MM-DD
  firstName?: string;
  lastName?: string;
  serviceDate?: string;       // YYYY-MM-DD, defaults to today
  serviceTypeCode?: string;   // Default: 30 (Health Benefit Plan Coverage)
  providerNpi?: string;
  providerName?: string;
}

export interface EligibilityResponse {
  transactionId: string;
  timestamp: string;
  responseTimeMs: number;
  
  status: 'active' | 'inactive' | 'not_found' | 'pending' | 'cobra' | 'error';
  
  member?: {
    memberId: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender?: string;
    relationship: string;
    address?: {
      line1?: string;
      city?: string;
      state?: string;
      zip?: string;
    };
  };
  
  subscriber?: {
    subscriberId: string;
    firstName: string;
    lastName: string;
    groupNumber?: string;
    employerName?: string;
  };
  
  coverage?: {
    planName: string;
    planType: string;
    effectiveDate: string;
    terminationDate?: string;
    coverageLevel: string;
    isActive: boolean;
    pcpName?: string;
    pcpNpi?: string;
  };
  
  benefits?: {
    deductible?: {
      individual?: {
        inNetwork?: { amount: number; met: number; remaining: number };
        outOfNetwork?: { amount: number; met: number; remaining: number };
      };
      family?: {
        inNetwork?: { amount: number; met: number; remaining: number };
        outOfNetwork?: { amount: number; met: number; remaining: number };
      };
    };
    outOfPocketMax?: {
      individual?: {
        inNetwork?: { amount: number; met: number; remaining: number };
        outOfNetwork?: { amount: number; met: number; remaining: number };
      };
      family?: {
        inNetwork?: { amount: number; met: number; remaining: number };
        outOfNetwork?: { amount: number; met: number; remaining: number };
      };
    };
    coinsurance?: {
      inNetwork: number;
      outOfNetwork: number;
    };
    copays?: Array<{
      serviceType: string;
      amount: number;
    }>;
  };
  
  limitations?: Array<{
    serviceType: string;
    limit: string;
    used?: number;
  }>;
  
  priorAuthRequired?: string[];
  
  error?: {
    code: string;
    message: string;
    suggestions?: string[];
  };
}

// ============================================================================
// PLAN BENEFITS (by plan type)
// ============================================================================

const PLAN_BENEFITS: Record<string, {
  deductible: { individual: { in: number; out: number }; family: { in: number; out: number } };
  oopMax: { individual: { in: number; out: number }; family: { in: number; out: number } };
  coinsurance: { in: number; out: number };
  copays: Array<{ serviceType: string; amount: number }>;
  priorAuth: string[];
}> = {
  'PPO Gold': {
    deductible: { individual: { in: 500, out: 1000 }, family: { in: 1500, out: 3000 } },
    oopMax: { individual: { in: 3000, out: 6000 }, family: { in: 6000, out: 12000 } },
    coinsurance: { in: 80, out: 60 },
    copays: [
      { serviceType: 'PCP Visit', amount: 20 },
      { serviceType: 'Specialist Visit', amount: 40 },
      { serviceType: 'Urgent Care', amount: 50 },
      { serviceType: 'Emergency Room', amount: 150 },
      { serviceType: 'Generic Rx', amount: 10 },
      { serviceType: 'Brand Rx', amount: 35 },
    ],
    priorAuth: ['Inpatient Surgery', 'MRI/CT Scan', 'Specialty Drugs'],
  },
  'PPO Silver': {
    deductible: { individual: { in: 1000, out: 2000 }, family: { in: 3000, out: 6000 } },
    oopMax: { individual: { in: 5000, out: 10000 }, family: { in: 10000, out: 20000 } },
    coinsurance: { in: 70, out: 50 },
    copays: [
      { serviceType: 'PCP Visit', amount: 30 },
      { serviceType: 'Specialist Visit', amount: 60 },
      { serviceType: 'Urgent Care', amount: 75 },
      { serviceType: 'Emergency Room', amount: 250 },
      { serviceType: 'Generic Rx', amount: 15 },
      { serviceType: 'Brand Rx', amount: 50 },
    ],
    priorAuth: ['Inpatient Surgery', 'MRI/CT Scan', 'Specialty Drugs', 'DME'],
  },
  'PPO Platinum': {
    deductible: { individual: { in: 250, out: 500 }, family: { in: 750, out: 1500 } },
    oopMax: { individual: { in: 2000, out: 4000 }, family: { in: 4000, out: 8000 } },
    coinsurance: { in: 90, out: 70 },
    copays: [
      { serviceType: 'PCP Visit', amount: 10 },
      { serviceType: 'Specialist Visit', amount: 25 },
      { serviceType: 'Urgent Care', amount: 35 },
      { serviceType: 'Emergency Room', amount: 100 },
      { serviceType: 'Generic Rx', amount: 5 },
      { serviceType: 'Brand Rx', amount: 25 },
    ],
    priorAuth: ['Inpatient Surgery', 'Specialty Drugs'],
  },
};

// Default benefits for unknown plans
const DEFAULT_BENEFITS = PLAN_BENEFITS['PPO Silver'];

// ============================================================================
// SERVICE
// ============================================================================

export class EligibilityEngine {
  /**
   * Verify member eligibility
   */
  async verify(request: EligibilityRequest): Promise<EligibilityResponse> {
    const startTime = Date.now();
    const transactionId = `ELG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const serviceDate = request.serviceDate ? new Date(request.serviceDate) : new Date();
    
    try {
      // Find member by member number and DOB
      const member = await prisma.member.findFirst({
        where: {
          memberNumber: request.memberId,
          dateOfBirth: new Date(request.dateOfBirth),
        },
        include: {
          employer: true,
        },
      });
      
      if (!member) {
        // Try with partial match (in case format differs)
        const memberAlt = await prisma.member.findFirst({
          where: {
            OR: [
              { memberNumber: { contains: request.memberId.replace('MEM-', '') } },
              { memberNumber: request.memberId.replace('MEM-', '') },
            ],
            dateOfBirth: new Date(request.dateOfBirth),
          },
          include: {
            employer: true,
          },
        });
        
        if (!memberAlt) {
          return this.buildNotFoundResponse(request, transactionId, startTime);
        }
        
        return this.buildEligibilityResponse(memberAlt, serviceDate, transactionId, startTime);
      }
      
      return this.buildEligibilityResponse(member, serviceDate, transactionId, startTime);
      
    } catch (error) {
      console.error('Eligibility verification error:', error);
      return {
        transactionId,
        timestamp: new Date().toISOString(),
        responseTimeMs: Date.now() - startTime,
        status: 'error',
        error: {
          code: 'VERIFICATION_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
          suggestions: [
            'Check member ID and date of birth',
            'Contact support if problem persists',
          ],
        },
      };
    }
  }
  
  /**
   * Build eligibility response for found member
   */
  private buildEligibilityResponse(
    member: {
      id: string;
      memberNumber: string;
      firstName: string;
      lastName: string;
      dateOfBirth: Date;
      gender: string | null;
      relationship: string;
      address: string | null;
      city: string | null;
      state: string | null;
      zip: string | null;
      planType: string;
      subscriberId: string | null;
      status: string;
      effectiveDate: Date;
      terminationDate: Date | null;
      pcpId: string | null;
      employer: { name: string; groupNumber: string } | null;
    },
    serviceDate: Date,
    transactionId: string,
    startTime: number
  ): EligibilityResponse {
    // Check if coverage is active for service date
    const isEffective = member.effectiveDate <= serviceDate;
    const isTerminated = member.terminationDate && member.terminationDate < serviceDate;
    const isActive = member.status === 'active' && isEffective && !isTerminated;
    
    // Get benefits for this plan type
    const planBenefits = PLAN_BENEFITS[member.planType] || DEFAULT_BENEFITS;
    
    // Simulate some accumulator usage (in production, this would come from claims data)
    const usedDeductible = this.simulateAccumulator(member.id, 'deductible');
    const usedOOP = this.simulateAccumulator(member.id, 'oop');
    
    if (!isActive) {
      return {
        transactionId,
        timestamp: new Date().toISOString(),
        responseTimeMs: Date.now() - startTime,
        status: isTerminated ? 'inactive' : (isEffective ? 'inactive' : 'pending'),
        member: {
          memberId: member.memberNumber,
          firstName: member.firstName,
          lastName: member.lastName,
          dateOfBirth: member.dateOfBirth.toISOString().split('T')[0],
          gender: member.gender || undefined,
          relationship: member.relationship,
        },
        coverage: {
          planName: `TrueCare Health ${member.planType}`,
          planType: member.planType,
          effectiveDate: member.effectiveDate.toISOString().split('T')[0],
          terminationDate: member.terminationDate?.toISOString().split('T')[0],
          coverageLevel: member.relationship === 'subscriber' ? 'Employee' : 'Dependent',
          isActive: false,
        },
        error: {
          code: 'NO_ACTIVE_COVERAGE',
          message: isTerminated 
            ? 'Coverage was terminated prior to service date'
            : 'Coverage is not yet effective for service date',
          suggestions: [
            'Verify coverage dates with member',
            'Check for COBRA eligibility if recently terminated',
          ],
        },
      };
    }
    
    return {
      transactionId,
      timestamp: new Date().toISOString(),
      responseTimeMs: Date.now() - startTime,
      status: 'active',
      
      member: {
        memberId: member.memberNumber,
        firstName: member.firstName,
        lastName: member.lastName,
        dateOfBirth: member.dateOfBirth.toISOString().split('T')[0],
        gender: member.gender || undefined,
        relationship: member.relationship,
        address: member.address ? {
          line1: member.address,
          city: member.city || undefined,
          state: member.state || undefined,
          zip: member.zip || undefined,
        } : undefined,
      },
      
      subscriber: {
        subscriberId: member.subscriberId || member.memberNumber,
        firstName: member.firstName,
        lastName: member.lastName,
        groupNumber: member.employer?.groupNumber,
        employerName: member.employer?.name,
      },
      
      coverage: {
        planName: `TrueCare Health ${member.planType}`,
        planType: member.planType,
        effectiveDate: member.effectiveDate.toISOString().split('T')[0],
        terminationDate: member.terminationDate?.toISOString().split('T')[0],
        coverageLevel: member.relationship === 'subscriber' ? 'Employee + Family' : 'Dependent',
        isActive: true,
      },
      
      benefits: {
        deductible: {
          individual: {
            inNetwork: {
              amount: planBenefits.deductible.individual.in,
              met: usedDeductible.individual,
              remaining: Math.max(0, planBenefits.deductible.individual.in - usedDeductible.individual),
            },
            outOfNetwork: {
              amount: planBenefits.deductible.individual.out,
              met: Math.floor(usedDeductible.individual * 0.5),
              remaining: Math.max(0, planBenefits.deductible.individual.out - Math.floor(usedDeductible.individual * 0.5)),
            },
          },
          family: {
            inNetwork: {
              amount: planBenefits.deductible.family.in,
              met: usedDeductible.family,
              remaining: Math.max(0, planBenefits.deductible.family.in - usedDeductible.family),
            },
            outOfNetwork: {
              amount: planBenefits.deductible.family.out,
              met: Math.floor(usedDeductible.family * 0.5),
              remaining: Math.max(0, planBenefits.deductible.family.out - Math.floor(usedDeductible.family * 0.5)),
            },
          },
        },
        outOfPocketMax: {
          individual: {
            inNetwork: {
              amount: planBenefits.oopMax.individual.in,
              met: usedOOP.individual,
              remaining: Math.max(0, planBenefits.oopMax.individual.in - usedOOP.individual),
            },
            outOfNetwork: {
              amount: planBenefits.oopMax.individual.out,
              met: Math.floor(usedOOP.individual * 0.5),
              remaining: Math.max(0, planBenefits.oopMax.individual.out - Math.floor(usedOOP.individual * 0.5)),
            },
          },
          family: {
            inNetwork: {
              amount: planBenefits.oopMax.family.in,
              met: usedOOP.family,
              remaining: Math.max(0, planBenefits.oopMax.family.in - usedOOP.family),
            },
            outOfNetwork: {
              amount: planBenefits.oopMax.family.out,
              met: Math.floor(usedOOP.family * 0.5),
              remaining: Math.max(0, planBenefits.oopMax.family.out - Math.floor(usedOOP.family * 0.5)),
            },
          },
        },
        coinsurance: {
          inNetwork: planBenefits.coinsurance.in,
          outOfNetwork: planBenefits.coinsurance.out,
        },
        copays: planBenefits.copays,
      },
      
      limitations: [
        { serviceType: 'Physical Therapy', limit: '30 visits/year', used: 8 },
        { serviceType: 'Mental Health', limit: '52 visits/year', used: 12 },
        { serviceType: 'Chiropractic', limit: '20 visits/year', used: 4 },
      ],
      
      priorAuthRequired: planBenefits.priorAuth,
    };
  }
  
  /**
   * Build not found response
   */
  private buildNotFoundResponse(
    request: EligibilityRequest,
    transactionId: string,
    startTime: number
  ): EligibilityResponse {
    return {
      transactionId,
      timestamp: new Date().toISOString(),
      responseTimeMs: Date.now() - startTime,
      status: 'not_found',
      error: {
        code: 'MEMBER_NOT_FOUND',
        message: 'No member found matching the provided criteria',
        suggestions: [
          'Verify member ID is correct (check insurance card)',
          'Confirm date of birth matches exactly',
          'Member may be enrolled under different ID',
          'Contact TrueCare Health member services: 1-800-MEDCARE',
        ],
      },
    };
  }
  
  /**
   * Simulate accumulator values (in production, calculate from claims)
   */
  private simulateAccumulator(memberId: string, type: 'deductible' | 'oop'): { individual: number; family: number } {
    // Use member ID to generate consistent "random" values
    const hash = memberId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    if (type === 'deductible') {
      return {
        individual: (hash % 400) + 50,  // $50 - $450 used
        family: (hash % 800) + 100,     // $100 - $900 used
      };
    } else {
      return {
        individual: (hash % 1500) + 200,  // $200 - $1700 used
        family: (hash % 3000) + 500,      // $500 - $3500 used
      };
    }
  }
}

// Export singleton
export const eligibilityEngine = new EligibilityEngine();
