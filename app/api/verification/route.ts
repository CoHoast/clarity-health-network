/**
 * Verification API Route
 * POST /api/verification - Run verification checks on a provider
 */

import { NextRequest, NextResponse } from 'next/server';
import { runVerifications, ProviderVerificationRequest } from '@/lib/verification';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.npi) {
      return NextResponse.json(
        { error: 'NPI is required' },
        { status: 400 }
      );
    }

    // Build verification request
    const verificationRequest: ProviderVerificationRequest = {
      npi: body.npi,
      firstName: body.firstName,
      lastName: body.lastName,
      organizationName: body.organizationName,
      providerType: body.providerType || 'individual',
      verificationsToRun: body.verificationsToRun,
    };

    // Run verifications
    const { results, summary } = await runVerifications(verificationRequest);

    return NextResponse.json({
      success: true,
      results,
      summary,
    });

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Verification failed' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/verification?npi=1234567890 - Quick NPI lookup
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const npi = searchParams.get('npi');

    if (!npi) {
      return NextResponse.json(
        { error: 'NPI query parameter is required' },
        { status: 400 }
      );
    }

    // Run basic verification
    const { results, summary } = await runVerifications({
      npi,
      providerType: 'individual',
      verificationsToRun: ['NPI_VALIDATION'],
    });

    return NextResponse.json({
      success: true,
      results,
      summary,
    });

  } catch (error) {
    console.error('Verification lookup error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Lookup failed' },
      { status: 500 }
    );
  }
}
