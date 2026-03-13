/**
 * Claims Repricing API
 * 
 * POST /api/admin/claims/reprice
 * Reprice a claim using the repricing engine
 */

import { NextRequest, NextResponse } from 'next/server';
import { repricingEngine, RepricingRequest } from '@/lib/engines/repricing';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.claimId || !body.providerNpi || !body.lines || body.lines.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: claimId, providerNpi, lines' },
        { status: 400 }
      );
    }
    
    // Build repricing request
    const repricingRequest: RepricingRequest = {
      claimId: body.claimId,
      memberId: body.memberId || 'UNKNOWN',
      providerNpi: body.providerNpi,
      providerName: body.providerName,
      networkStatus: body.networkStatus || 'IN_NETWORK',
      claimType: body.claimType || 'PROFESSIONAL',
      serviceDate: body.serviceDate || new Date().toISOString().split('T')[0],
      totalBilledAmount: body.totalBilledAmount || body.lines.reduce((sum: number, l: { billedAmount: number }) => sum + l.billedAmount, 0),
      diagnosisCodes: body.diagnosisCodes || [],
      lines: body.lines.map((line: {
        lineNumber?: number;
        cptCode: string;
        modifier?: string;
        description?: string;
        quantity?: number;
        billedAmount: number;
        placeOfService?: string;
        diagnosisCodes?: string[];
        serviceDate?: string;
      }, index: number) => ({
        lineNumber: line.lineNumber || index + 1,
        cptCode: line.cptCode,
        modifier: line.modifier,
        description: line.description,
        quantity: line.quantity || 1,
        billedAmount: line.billedAmount,
        placeOfService: line.placeOfService || '11',
        diagnosisCodes: line.diagnosisCodes || [],
        serviceDate: line.serviceDate || body.serviceDate || new Date().toISOString().split('T')[0],
      })),
    };
    
    // Run repricing
    const result = await repricingEngine.repriceClaim(repricingRequest);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Repricing error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/claims/reprice
 * Get repricing configuration and rate info
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  
  if (action === 'contracts') {
    // Return all provider contracts
    return NextResponse.json({
      contracts: repricingEngine.getContracts(),
    });
  }
  
  if (action === 'lookup') {
    const cptCode = searchParams.get('cpt');
    if (!cptCode) {
      return NextResponse.json({ error: 'Missing cpt parameter' }, { status: 400 });
    }
    
    const rate = repricingEngine.lookupCptCode(cptCode);
    if (!rate) {
      return NextResponse.json({ error: 'CPT code not found', cptCode }, { status: 404 });
    }
    
    return NextResponse.json({ cptCode, rate });
  }
  
  // Default: return available actions
  return NextResponse.json({
    availableActions: ['contracts', 'lookup'],
    usage: {
      contracts: 'GET /api/admin/claims/reprice?action=contracts',
      lookup: 'GET /api/admin/claims/reprice?action=lookup&cpt=99213',
    },
  });
}
