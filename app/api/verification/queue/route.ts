/**
 * Verification Queue API
 * GET /api/verification/queue - Get verification records for all providers
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface VerificationRecord {
  id: string;
  providerName: string;
  npi: string;
  verificationType: string;
  status: "verified" | "pending" | "failed" | "expiring";
  verifiedDate: string | null;
  expirationDate: string | null;
  source: string;
  details: string;
  extendedDetails?: {
    licenseNumber?: string;
    issueDate?: string;
    disciplinaryActions?: string;
    restrictions?: string;
    verificationMethod?: string;
    lastChecked?: string;
    rawResponse?: string;
  };
}

// Generate verification records from real provider data
function generateVerificationRecords(providers: any[]): VerificationRecord[] {
  const records: VerificationRecord[] = [];
  const today = new Date();
  
  // Take a representative sample (first 50 unique NPIs for demo)
  const uniqueNpis = new Map<string, any>();
  providers.forEach(p => {
    if (p.npi && !uniqueNpis.has(p.npi)) {
      uniqueNpis.set(p.npi, p);
    }
  });
  
  const sampleProviders = Array.from(uniqueNpis.values()).slice(0, 50);
  
  sampleProviders.forEach((provider, index) => {
    const providerName = `${provider.firstName || ''} ${provider.lastName || ''}`.trim() || 'Unknown Provider';
    const credential = provider.credentials || provider.credential || '';
    const displayName = credential ? `${providerName}, ${credential}` : providerName;
    
    // Determine verification statuses (simulate realistic distribution)
    // ~80% verified, ~10% pending, ~5% expiring, ~5% failed
    const rand = Math.random();
    let npiStatus: "verified" | "pending" | "failed" | "expiring" = "verified";
    let licenseStatus: "verified" | "pending" | "failed" | "expiring" = "verified";
    
    if (rand < 0.05) {
      licenseStatus = "failed";
    } else if (rand < 0.10) {
      licenseStatus = "expiring";
    } else if (rand < 0.20) {
      licenseStatus = "pending";
    }
    
    // NPI Validation record (most are verified since we have real NPIs)
    const npiVerifiedDate = new Date(today);
    npiVerifiedDate.setDate(npiVerifiedDate.getDate() - Math.floor(Math.random() * 30));
    
    records.push({
      id: `VER-NPI-${provider.npi}`,
      providerName: displayName,
      npi: provider.npi,
      verificationType: "NPI Validation",
      status: "verified",
      verifiedDate: npiVerifiedDate.toISOString().split('T')[0],
      expirationDate: null,
      source: "NPPES",
      details: `Active ${provider.facilityType === 'INDIVIDUAL' ? 'Individual' : 'Organization'} NPI`,
      extendedDetails: {
        licenseNumber: provider.npi,
        verificationMethod: "NPPES NPI Registry API",
        lastChecked: npiVerifiedDate.toISOString(),
        rawResponse: `NPI: ${provider.npi} | Entity Type: ${provider.facilityType} | Status: Active | Taxonomy: ${provider.taxonomyCode || 'N/A'}`,
      },
    });
    
    // Medical License record (for individual providers)
    if (provider.facilityType === 'INDIVIDUAL') {
      const licenseVerifiedDate = new Date(today);
      licenseVerifiedDate.setDate(licenseVerifiedDate.getDate() - Math.floor(Math.random() * 60));
      
      const licenseExpiry = new Date(today);
      if (licenseStatus === "expiring") {
        licenseExpiry.setDate(licenseExpiry.getDate() + Math.floor(Math.random() * 30)); // Expiring within 30 days
      } else {
        licenseExpiry.setMonth(licenseExpiry.getMonth() + 12 + Math.floor(Math.random() * 24)); // 1-3 years out
      }
      
      const licenseNumber = `AZ-${credential || 'LIC'}-${provider.npi.slice(-6)}`;
      
      records.push({
        id: `VER-LIC-${provider.npi}`,
        providerName: displayName,
        npi: provider.npi,
        verificationType: "Medical License",
        status: licenseStatus,
        verifiedDate: licenseStatus === "pending" || licenseStatus === "failed" ? null : licenseVerifiedDate.toISOString().split('T')[0],
        expirationDate: licenseStatus === "pending" ? null : licenseExpiry.toISOString().split('T')[0],
        source: "Arizona Medical Board",
        details: licenseStatus === "verified" 
          ? `License #${licenseNumber} Active`
          : licenseStatus === "expiring"
          ? `License #${licenseNumber} - Expiring Soon`
          : licenseStatus === "pending"
          ? "Verification in progress"
          : "License verification failed - Check required",
        extendedDetails: {
          licenseNumber: licenseStatus === "pending" ? undefined : licenseNumber,
          issueDate: "2020-01-15",
          disciplinaryActions: "None on record",
          restrictions: "None",
          verificationMethod: licenseStatus === "pending" ? "Primary Source - Awaiting Response" : "Arizona Medical Board API",
          lastChecked: licenseVerifiedDate.toISOString(),
          rawResponse: licenseStatus === "verified" 
            ? `Status: ACTIVE | Type: ${credential} | Specialty: ${provider.specialty} | Expiration: ${licenseExpiry.toISOString().split('T')[0]}`
            : licenseStatus === "expiring"
            ? `Status: ACTIVE - RENEWAL REQUIRED | Expiration: ${licenseExpiry.toISOString().split('T')[0]}`
            : licenseStatus === "pending"
            ? "Request submitted. Estimated response time: 2-3 business days."
            : "ERROR: License not found or expired. Manual verification required.",
        },
      });
    }
  });
  
  return records;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    
    // Load real providers
    const providersFile = path.join(process.cwd(), 'data', 'arizona-providers.json');
    let providers: any[] = [];
    
    if (fs.existsSync(providersFile)) {
      providers = JSON.parse(fs.readFileSync(providersFile, 'utf-8'));
    }
    
    // Generate verification records
    let records = generateVerificationRecords(providers);
    
    // Apply filters
    if (status && status !== 'All Statuses') {
      records = records.filter(r => r.status.toLowerCase() === status.toLowerCase());
    }
    
    if (type && type !== 'All Types') {
      records = records.filter(r => r.verificationType === type);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      records = records.filter(r => 
        r.providerName.toLowerCase().includes(searchLower) ||
        r.npi.includes(search) ||
        r.verificationType.toLowerCase().includes(searchLower)
      );
    }
    
    // Calculate stats
    const stats = {
      total: records.length,
      verified: records.filter(r => r.status === 'verified').length,
      pending: records.filter(r => r.status === 'pending').length,
      failed: records.filter(r => r.status === 'failed').length,
      expiring: records.filter(r => r.status === 'expiring').length,
    };
    
    return NextResponse.json({
      records,
      stats,
      totalProviders: providers.length,
    });
    
  } catch (error) {
    console.error('Verification queue error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch verification queue' },
      { status: 500 }
    );
  }
}
