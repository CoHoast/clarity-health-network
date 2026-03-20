import { NextRequest, NextResponse } from 'next/server';
import contractPricingData from '@/data/contract-pricing.json';

const pricing = contractPricingData as Record<string, any>;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ contractNumber: string }> }
) {
  const { contractNumber } = await params;
  
  const contract = pricing[contractNumber];
  
  if (!contract) {
    return NextResponse.json({ 
      error: 'Contract pricing not found',
      contractNumber 
    }, { status: 404 });
  }
  
  // Calculate rate type for display
  let rateType = 'Fixed Rate';
  let rateDescription = '';
  
  // Check for rate type indicators (I, O, P, DEFAULT)
  const rateTypeIndicators = contract.rateTypeIndicators || [];
  const hasRateTypes = rateTypeIndicators.length > 0;
  
  if (contract.cptRates.length > 0) {
    rateType = 'CPT-Based';
    rateDescription = `${contract.cptRates.length} CPT codes with fixed pricing`;
  }
  
  if (contract.defaultRates.pctMedicare > 0) {
    if (rateType === 'Fixed Rate') {
      rateType = '% of Medicare';
      rateDescription = `${contract.defaultRates.pctMedicare}% of Medicare rates`;
    } else {
      rateDescription += `, default ${contract.defaultRates.pctMedicare}% Medicare`;
    }
  }
  
  if (contract.defaultRates.pctBilled > 0) {
    if (rateType === 'Fixed Rate' && contract.defaultRates.pctMedicare === 0) {
      rateType = '% of Billed';
      rateDescription = `${contract.defaultRates.pctBilled}% of billed charges`;
    } else if (contract.defaultRates.pctMedicare === 0) {
      rateDescription += `, fallback ${contract.defaultRates.pctBilled}% of billed`;
    }
  }
  
  return NextResponse.json({
    contractNumber,
    rateType,
    rateDescription,
    defaultRates: contract.defaultRates,
    // Rate type indicators (I=Inpatient, O=Outpatient, P=Professional, DEFAULT)
    rateTypeIndicators: rateTypeIndicators,
    // Actual CPT codes with fixed prices
    cptRates: contract.cptRates,
    revenueCodes: contract.revenueCodes || [],
    cptCount: contract.cptRates.length
  });
}
