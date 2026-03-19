import { NextRequest, NextResponse } from 'next/server';
import { checkSAMExclusion, checkSAMIndividualExclusion } from '@/lib/verification/sam';

/**
 * SAM.gov Exclusion Check API
 * 
 * GET /api/sam/check?name=ENTITY_NAME
 * GET /api/sam/check?firstName=John&lastName=Doe
 * GET /api/sam/check?name=ENTITY&taxId=123456789
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const name = searchParams.get('name');
  const firstName = searchParams.get('firstName');
  const lastName = searchParams.get('lastName');
  const taxId = searchParams.get('taxId');
  const uei = searchParams.get('uei');
  
  if (!name && !(firstName && lastName)) {
    return NextResponse.json(
      { error: 'Missing required parameter: name or (firstName and lastName)' },
      { status: 400 }
    );
  }
  
  try {
    let result;
    
    if (firstName && lastName) {
      // Individual check
      result = await checkSAMIndividualExclusion(firstName, lastName);
    } else if (name) {
      // Entity check
      result = await checkSAMExclusion(name, { taxId: taxId || undefined, uei: uei || undefined });
    }
    
    return NextResponse.json({
      success: true,
      query: { name, firstName, lastName, taxId, uei },
      result,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('SAM.gov check error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
