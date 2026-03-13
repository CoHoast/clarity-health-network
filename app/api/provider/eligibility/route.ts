import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/db';
import { eligibilityEngine, EligibilityResponse } from '@/lib/engines/eligibility';
import { Prisma } from '@prisma/client';

/**
 * POST /api/provider/eligibility
 * 
 * Real-time eligibility verification for providers.
 * Returns comprehensive benefits, deductibles, copays, and prior auth requirements.
 */
export async function POST(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    if (payload.role !== 'provider') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { memberNumber, dateOfBirth, serviceDate, serviceTypeCode } = await req.json();

    if (!memberNumber || !dateOfBirth) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        details: 'memberNumber and dateOfBirth are required'
      }, { status: 400 });
    }

    // Call the eligibility engine
    const response: EligibilityResponse = await eligibilityEngine.verify({
      memberId: memberNumber,
      dateOfBirth,
      serviceDate: serviceDate || new Date().toISOString().split('T')[0],
      serviceTypeCode: serviceTypeCode || '30',
    });

    // Log the eligibility check
    try {
      await prisma.eligibilityCheck.create({
        data: {
          memberNumber,
          requestedBy: payload.id,
          requestType: 'real_time',
          serviceDate: new Date(serviceDate || Date.now()),
          status: response.status === 'active' ? 'eligible' : 'ineligible',
          response: response as unknown as Prisma.InputJsonValue,
          ...(response.member?.memberId && {
            memberId: await getMemberIdByNumber(response.member.memberId),
          }),
        }
      });
    } catch (logError) {
      console.error('Failed to log eligibility check:', logError);
      // Continue - don't fail the request due to logging error
    }

    // Return appropriate status code
    if (response.status === 'error') {
      return NextResponse.json(response, { status: 422 });
    }

    if (response.status === 'not_found') {
      return NextResponse.json(response, { status: 404 });
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Eligibility check error:', error);
    return NextResponse.json({ 
      error: 'Eligibility check failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Helper to get member ID by member number
async function getMemberIdByNumber(memberNumber: string): Promise<string | undefined> {
  const member = await prisma.member.findFirst({
    where: { memberNumber },
    select: { id: true }
  });
  return member?.id;
}

/**
 * GET /api/provider/eligibility
 * 
 * Get recent eligibility checks for the provider.
 */
export async function GET(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    if (payload.role !== 'provider') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const checks = await prisma.eligibilityCheck.findMany({
      where: { requestedBy: payload.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        member: {
          select: {
            firstName: true,
            lastName: true,
            memberNumber: true,
          }
        }
      }
    });

    return NextResponse.json({ 
      checks,
      total: checks.length 
    });

  } catch (error) {
    console.error('Get eligibility checks error:', error);
    return NextResponse.json({ error: 'Failed to fetch eligibility checks' }, { status: 500 });
  }
}
