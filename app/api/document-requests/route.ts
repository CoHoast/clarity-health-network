/**
 * Document Requests API
 * GET /api/document-requests - Get document request records from real providers
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface DocumentRequest {
  id: string;
  provider: string;
  practice: string;
  npi: string;
  email: string;
  requested: string;
  expires: string;
  status: "pending" | "partial" | "complete" | "expired";
  requestedDocs: string[];
  uploadedDocs: string[];
  sentBy: string;
}

// Generate document requests from real provider data
function generateDocumentRequests(providers: any[], practices: any[]): DocumentRequest[] {
  const requests: DocumentRequest[] = [];
  const today = new Date();
  const staffNames = ["Jane Smith", "Mike Johnson", "Sarah Davis", "Tom Wilson"];
  const docTypes = ["license", "dea", "malpractice_coi", "board_cert", "w9", "cv", "clia"];
  
  // Get unique providers (by NPI) - take first 40 for document requests
  const uniqueProviders = new Map<string, any>();
  providers.forEach(p => {
    if (p.npi && !uniqueProviders.has(p.npi)) {
      uniqueProviders.set(p.npi, p);
    }
  });
  
  const sampleProviders = Array.from(uniqueProviders.values()).slice(0, 40);
  
  sampleProviders.forEach((provider, index) => {
    const providerName = `${provider.firstName || ''} ${provider.lastName || ''}`.trim();
    const credential = provider.credentials || provider.credential || '';
    const displayName = credential ? `${providerName}, ${credential}` : providerName;
    
    // Find the practice for this provider
    const practice = practices.find(p => p.taxId === provider.billing?.taxId);
    const practiceName = practice?.name || provider.billing?.name || 'Unknown Practice';
    
    // Generate email from name
    const emailName = providerName.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z.]/g, '');
    const email = `${emailName}@${practiceName.toLowerCase().replace(/[^a-z]/g, '').slice(0, 10)}.com`;
    
    // Randomize status distribution: 30% pending, 25% partial, 30% complete, 15% expired
    const rand = Math.random();
    let status: "pending" | "partial" | "complete" | "expired";
    if (rand < 0.30) status = "pending";
    else if (rand < 0.55) status = "partial";
    else if (rand < 0.85) status = "complete";
    else status = "expired";
    
    // Generate dates
    const requestedDate = new Date(today);
    requestedDate.setDate(requestedDate.getDate() - Math.floor(Math.random() * 30));
    
    const expiresDate = new Date(requestedDate);
    expiresDate.setDate(expiresDate.getDate() + 14); // 2 weeks to respond
    
    // If expired status, make sure expires date is in past
    if (status === "expired") {
      expiresDate.setDate(today.getDate() - Math.floor(Math.random() * 7 + 1));
    }
    
    // Generate requested docs (3-5 random docs)
    const numDocs = Math.floor(Math.random() * 3) + 3;
    const shuffledDocs = [...docTypes].sort(() => Math.random() - 0.5);
    const requestedDocs = shuffledDocs.slice(0, numDocs);
    
    // Generate uploaded docs based on status
    let uploadedDocs: string[] = [];
    if (status === "complete") {
      uploadedDocs = [...requestedDocs];
    } else if (status === "partial") {
      const numUploaded = Math.floor(requestedDocs.length / 2) + 1;
      uploadedDocs = requestedDocs.slice(0, numUploaded);
    } else if (status === "expired") {
      // Some docs uploaded before expiry
      const numUploaded = Math.floor(Math.random() * 2);
      uploadedDocs = requestedDocs.slice(0, numUploaded);
    }
    // pending = no docs uploaded
    
    requests.push({
      id: `REQ-${String(index + 1).padStart(3, '0')}`,
      provider: displayName,
      practice: practiceName,
      npi: provider.npi,
      email,
      requested: requestedDate.toISOString().split('T')[0],
      expires: expiresDate.toISOString().split('T')[0],
      status,
      requestedDocs,
      uploadedDocs,
      sentBy: staffNames[Math.floor(Math.random() * staffNames.length)],
    });
  });
  
  return requests;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    
    // Load real data
    const providersFile = path.join(process.cwd(), 'data', 'arizona-providers.json');
    const practicesFile = path.join(process.cwd(), 'data', 'arizona-practices.json');
    
    let providers: any[] = [];
    let practices: any[] = [];
    
    if (fs.existsSync(providersFile)) {
      providers = JSON.parse(fs.readFileSync(providersFile, 'utf-8'));
    }
    if (fs.existsSync(practicesFile)) {
      practices = JSON.parse(fs.readFileSync(practicesFile, 'utf-8'));
    }
    
    // Generate requests
    let requests = generateDocumentRequests(providers, practices);
    
    // Apply filters
    if (status && status !== 'all') {
      requests = requests.filter(r => r.status === status);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      requests = requests.filter(r => 
        r.provider.toLowerCase().includes(searchLower) ||
        r.practice.toLowerCase().includes(searchLower) ||
        r.npi.includes(search) ||
        r.id.toLowerCase().includes(searchLower)
      );
    }
    
    // Calculate stats
    const allRequests = generateDocumentRequests(providers, practices);
    const stats = {
      total: allRequests.length,
      pending: allRequests.filter(r => r.status === 'pending').length,
      partial: allRequests.filter(r => r.status === 'partial').length,
      complete: allRequests.filter(r => r.status === 'complete').length,
      expired: allRequests.filter(r => r.status === 'expired').length,
    };
    
    return NextResponse.json({
      requests,
      stats,
      totalProviders: providers.length,
    });
    
  } catch (error) {
    console.error('Document requests error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document requests' },
      { status: 500 }
    );
  }
}
