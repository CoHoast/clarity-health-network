/**
 * Credentialing Verification API
 * 
 * POST /api/admin/credentialing/verify - Verify provider credentials
 * GET /api/admin/credentialing/verify - Get test NPIs
 */

import { NextRequest, NextResponse } from 'next/server';
import { credentialingEngine, CredentialingRequest } from '@/lib/engines/credentialing';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.npi) {
      return NextResponse.json(
        { error: 'Missing required field: npi' },
        { status: 400 }
      );
    }
    
    const credRequest: CredentialingRequest = {
      npi: body.npi,
      firstName: body.firstName,
      lastName: body.lastName,
      organizationName: body.organizationName,
      providerType: body.providerType || 'INDIVIDUAL',
      stateLicenseNumber: body.stateLicenseNumber,
      stateLicenseState: body.stateLicenseState || 'OH',
      deaNumber: body.deaNumber,
      taxonomyCode: body.taxonomyCode,
    };
    
    const result = await credentialingEngine.verifyProvider(credRequest);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Credentialing verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    testNPIs: credentialingEngine.getTestNPIs(),
    verificationTypes: [
      'NPI - NPPES Registry',
      'STATE_LICENSE - State Medical Boards',
      'DEA - Drug Enforcement Administration',
      'BOARD_CERTIFICATION - ABMS',
      'MALPRACTICE - NPDB / Insurance',
      'SANCTIONS - OIG LEIE, SAM.gov, State Boards',
    ],
  });
}
