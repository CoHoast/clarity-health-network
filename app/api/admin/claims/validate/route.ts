/**
 * Claims Validation API
 * 
 * POST /api/admin/claims/validate - Validate a claim through 5-level pipeline
 * GET /api/admin/claims/validate - Get validation rules info
 */

import { NextRequest, NextResponse } from 'next/server';
import { claimsValidationEngine, ClaimForValidation } from '@/lib/engines/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.claimId || !body.billingNpi || !body.memberId) {
      return NextResponse.json(
        { error: 'Missing required fields: claimId, billingNpi, memberId' },
        { status: 400 }
      );
    }
    
    // Build claim for validation
    const claim: ClaimForValidation = {
      claimId: body.claimId,
      memberId: body.memberId,
      memberDob: body.memberDob,
      memberGender: body.memberGender,
      billingNpi: body.billingNpi,
      providerName: body.providerName,
      renderingNpi: body.renderingNpi,
      claimType: body.claimType || 'PROFESSIONAL',
      serviceFromDate: body.serviceFromDate || body.serviceDate || new Date().toISOString().split('T')[0],
      serviceToDate: body.serviceToDate,
      submittedDate: body.submittedDate || new Date().toISOString().split('T')[0],
      placeOfService: body.placeOfService || '11',
      totalCharges: body.totalCharges || body.totalBilledAmount || 
        (body.serviceLines?.reduce((sum: number, l: { chargeAmount?: number; billedAmount?: number; quantity?: number }) => 
          sum + ((l.chargeAmount || l.billedAmount || 0) * (l.quantity || 1)), 0) || 0),
      priorAuthNumber: body.priorAuthNumber,
      diagnosisCodes: (body.diagnosisCodes || []).map((dx: string | { code: string; type?: string }) => 
        typeof dx === 'string' ? { code: dx } : dx
      ),
      serviceLines: (body.serviceLines || body.lines || []).map((line: {
        lineNumber?: number;
        procedureCode?: string;
        cptCode?: string;
        modifiers?: string[];
        modifier?: string;
        chargeAmount?: number;
        billedAmount?: number;
        quantity?: number;
        serviceDate?: string;
        diagnosisPointers?: number[];
        revenueCode?: string;
      }, index: number) => ({
        lineNumber: line.lineNumber || index + 1,
        procedureCode: line.procedureCode || line.cptCode || '',
        modifiers: line.modifiers || (line.modifier ? [line.modifier] : []),
        chargeAmount: line.chargeAmount || line.billedAmount || 0,
        quantity: line.quantity || 1,
        serviceDate: line.serviceDate,
        diagnosisPointers: line.diagnosisPointers,
        revenueCode: line.revenueCode,
      })),
    };
    
    // Run validation
    const result = await claimsValidationEngine.validateClaim(claim);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    validationLevels: [
      { level: 1, name: 'Syntax', description: 'Required fields, format validation' },
      { level: 2, name: 'Business', description: 'Timely filing, duplicates, future dates' },
      { level: 3, name: 'Eligibility', description: 'Member active, coverage applies' },
      { level: 4, name: 'Provider', description: 'NPI valid, network status, not excluded' },
      { level: 5, name: 'Clinical', description: 'ICD-10/CPT valid, age/gender appropriate' },
    ],
    rules: claimsValidationEngine.getRules(),
    autoAdjudicationConfig: {
      maxChargeAmount: 10000,
      maxLineCount: 10,
      autoAdjClaimTypes: ['PROFESSIONAL'],
    },
    timelyFilingDays: 365,
  });
}
