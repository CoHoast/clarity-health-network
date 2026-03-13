/**
 * Fraud Detection API
 * 
 * POST /api/admin/fraud/score - Score a claim for fraud indicators
 * GET /api/admin/fraud/score - Get fraud rules and configuration
 */

import { NextRequest, NextResponse } from 'next/server';
import { fraudDetectionEngine, ClaimForScoring } from '@/lib/engines/fraud';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.claimId || !body.providerNpi) {
      return NextResponse.json(
        { error: 'Missing required fields: claimId, providerNpi' },
        { status: 400 }
      );
    }
    
    // Build claim for scoring
    const claim: ClaimForScoring = {
      claimId: body.claimId,
      memberId: body.memberId || 'UNKNOWN',
      memberName: body.memberName,
      memberDob: body.memberDob,
      providerNpi: body.providerNpi,
      providerName: body.providerName,
      providerTaxonomy: body.providerTaxonomy,
      claimType: body.claimType || 'PROFESSIONAL',
      serviceDate: body.serviceDate || new Date().toISOString().split('T')[0],
      submittedDate: body.submittedDate,
      totalBilledAmount: body.totalBilledAmount || 
        (body.lines?.reduce((sum: number, l: { billedAmount: number }) => sum + l.billedAmount, 0) || 0),
      diagnosisCodes: body.diagnosisCodes || [],
      lines: (body.lines || []).map((line: {
        cptCode: string;
        modifier?: string;
        quantity?: number;
        billedAmount: number;
        placeOfService?: string;
      }) => ({
        cptCode: line.cptCode,
        modifier: line.modifier,
        quantity: line.quantity || 1,
        billedAmount: line.billedAmount,
        placeOfService: line.placeOfService || '11',
      })),
    };
    
    // Run fraud detection
    const result = await fraudDetectionEngine.scoreClaim(claim);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Fraud scoring error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  
  if (action === 'rules') {
    return NextResponse.json({
      rules: fraudDetectionEngine.getRules(),
      totalRules: fraudDetectionEngine.getRules().length,
    });
  }
  
  if (action === 'provider') {
    const npi = searchParams.get('npi');
    if (!npi) {
      return NextResponse.json({ error: 'Missing npi parameter' }, { status: 400 });
    }
    
    const profile = fraudDetectionEngine.getProviderProfile(npi);
    if (!profile) {
      return NextResponse.json({ error: 'Provider not found', npi }, { status: 404 });
    }
    
    return NextResponse.json({ profile });
  }
  
  if (action === 'member') {
    const memberId = searchParams.get('memberId');
    if (!memberId) {
      return NextResponse.json({ error: 'Missing memberId parameter' }, { status: 400 });
    }
    
    const profile = fraudDetectionEngine.getMemberProfile(memberId);
    if (!profile) {
      return NextResponse.json({ error: 'Member not found', memberId }, { status: 404 });
    }
    
    return NextResponse.json({ profile });
  }
  
  // Default: return config
  return NextResponse.json({
    availableActions: ['rules', 'provider', 'member'],
    riskLevels: ['minimal', 'low', 'medium', 'high', 'critical'],
    recommendedActions: ['approve', 'flag', 'pend', 'deny', 'investigate'],
    fraudCategories: [
      'upcoding', 'unbundling', 'duplicate', 'impossible_day',
      'geographic', 'doctor_shopping', 'identity_fraud', 'provider_exclusion',
      'phantom_billing', 'kickback'
    ],
    scoringWeights: {
      rules: 0.35,
      statistical: 0.25,
      ml: 0.30,
      network: 0.10,
    },
  });
}
