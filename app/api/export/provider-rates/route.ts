import { NextRequest, NextResponse } from 'next/server';
import providersData from '@/data/arizona-providers.json';
import contractPricingData from '@/data/contract-pricing.json';

const providers = providersData as any[];
const pricing = contractPricingData as Record<string, any>;

// Convert Excel date serial number to MM/DD/YYYY
function excelDateToString(excelDate: number): string {
  if (!excelDate || excelDate === 0) return '';
  // Excel dates start from Jan 1, 1900 (serial 1)
  // But Excel incorrectly thinks 1900 was a leap year, so we adjust
  const msPerDay = 24 * 60 * 60 * 1000;
  const excelEpoch = new Date(1899, 11, 30); // Dec 30, 1899
  const date = new Date(excelEpoch.getTime() + excelDate * msPerDay);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') || 'csv';
  const contractFilter = searchParams.get('contract') || '';
  
  // Build export data
  const rows: string[][] = [];
  
  // Header row matching the template
  rows.push([
    'Reference #',
    'Contract #',
    'From Date',
    'To Date',
    'CPT Code',
    'Hospital Type Code',
    'Contract Priced Amt',
    '% of Medicare',
    '% of Medicaid',
    'Type Of Contract',
    'Mod 1',
    'Mod 2',
    'Place of Service',
    'Revenue Code',
    '% of Billed Charges'
  ]);
  
  // Process each provider
  for (const provider of providers) {
    const contractNum = String(provider.contractNumber || '');
    
    // Skip if filtering by contract and doesn't match
    if (contractFilter && contractNum !== contractFilter) continue;
    
    const contract = pricing[contractNum];
    const referenceNum = provider.entityNumber || provider.referenceNumber || '';
    
    if (contract) {
      // Has contract pricing data
      const fromDate = excelDateToString(contract.fromDate);
      const toDate = excelDateToString(contract.toDate);
      
      // Add rate type indicators (I, O, P, DEFAULT) as rows
      if (contract.rateTypeIndicators && contract.rateTypeIndicators.length > 0) {
        for (const indicator of contract.rateTypeIndicators) {
          rows.push([
            referenceNum,
            contractNum,
            fromDate,
            toDate,
            '', // CPT Code (blank for rate type indicators)
            indicator.type === 'DEFAULT' ? '' : indicator.type, // Hospital Type Code
            '0', // Contract Priced Amt (not used for % rates)
            String(indicator.pctMedicare || 0),
            '0', // % of Medicaid
            '', // Type Of Contract
            '', // Mod 1
            '', // Mod 2
            '', // Place of Service
            '', // Revenue Code
            String(indicator.pctBilled || 0)
          ]);
        }
      } else if (contract.defaultRates) {
        // Has default rates but no type indicators
        rows.push([
          referenceNum,
          contractNum,
          fromDate,
          toDate,
          '', // CPT Code
          '', // Hospital Type Code
          '0', // Contract Priced Amt
          String(contract.defaultRates.pctMedicare || 0),
          '0', // % of Medicaid
          '', // Type Of Contract
          '', // Mod 1
          '', // Mod 2
          '', // Place of Service
          '', // Revenue Code
          String(contract.defaultRates.pctBilled || 0)
        ]);
      }
      
      // Add CPT-specific rates
      if (contract.cptRates && contract.cptRates.length > 0) {
        for (const cpt of contract.cptRates) {
          rows.push([
            referenceNum,
            contractNum,
            fromDate,
            toDate,
            cpt.cptCode,
            '', // Hospital Type Code (empty for CPT codes)
            String(cpt.pricedAmt || 0),
            '0', // % of Medicare (not used for CPT rates)
            '0', // % of Medicaid
            '', // Type Of Contract
            '', // Mod 1
            '', // Mod 2
            '', // Place of Service
            cpt.revenueCode || '',
            '0' // % of Billed Charges
          ]);
        }
      }
    } else {
      // No contract pricing - just add a row with provider info
      rows.push([
        referenceNum,
        contractNum,
        '', // From Date
        '', // To Date
        '', // CPT Code
        '', // Hospital Type Code
        '0', // Contract Priced Amt
        '0', // % of Medicare
        '0', // % of Medicaid
        '', // Type Of Contract
        '', // Mod 1
        '', // Mod 2
        '', // Place of Service
        '', // Revenue Code
        '0' // % of Billed Charges
      ]);
    }
  }
  
  // Convert to CSV
  const csv = rows.map(row => 
    row.map(cell => {
      // Escape quotes and wrap in quotes if contains comma
      const str = String(cell);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }).join(',')
  ).join('\n');
  
  // Return CSV file
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="provider-discount-rates-${new Date().toISOString().split('T')[0]}.csv"`
    }
  });
}
