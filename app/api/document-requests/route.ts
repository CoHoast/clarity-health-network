/**
 * Document Requests API
 * GET - List all document requests
 * POST - Create a new document request and send email
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  loadDocumentRequests,
  createDocumentRequest,
  getDocumentRequests,
  recordEmailSent,
  getUploadPortalUrl,
} from '@/lib/document-requests';
import { sendDocumentRequestEmail, isSESConfigured } from '@/lib/aws/ses';
import fs from 'fs';
import path from 'path';

// GET - List document requests
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    
    // Get document requests from storage
    let requests = getDocumentRequests({ status, limit });
    
    // If no stored requests, generate from real provider data (for demo)
    if (requests.length === 0) {
      requests = await generateDemoRequests();
    }
    
    // Calculate stats
    const stats = {
      total: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      partial: requests.filter(r => r.status === 'partial').length,
      complete: requests.filter(r => r.status === 'complete').length,
      expired: requests.filter(r => r.status === 'expired').length,
    };
    
    return NextResponse.json({
      requests,
      stats,
      emailConfigured: isSESConfigured(),
    });
  } catch (error: any) {
    console.error('Error fetching document requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document requests', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new document request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      providerId,
      providerNpi,
      providerName,
      providerEmail,
      practiceName,
      requestedDocs,
      customMessage,
      expiresInDays,
      sendEmail: shouldSendEmail,
      createdBy,
    } = body;
    
    // Validate required fields
    if (!providerNpi || !providerName || !providerEmail || !requestedDocs?.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create the document request
    const docRequest = createDocumentRequest({
      providerId: providerId || `prov-${providerNpi}`,
      providerNpi,
      providerName,
      providerEmail,
      practiceName: practiceName || 'Unknown Practice',
      requestedDocs,
      createdBy: createdBy || 'admin',
      expiresInDays: expiresInDays || 14,
      customMessage,
    });
    
    // Generate upload URL
    const uploadUrl = getUploadPortalUrl(docRequest.token);
    
    // Send email if requested
    let emailResult = null;
    if (shouldSendEmail !== false) {
      emailResult = await sendDocumentRequestEmail({
        to: providerEmail,
        providerName,
        practiceName: practiceName || 'Unknown Practice',
        networkName: process.env.NETWORK_NAME || 'TrueCare Health Network',
        documents: requestedDocs,
        uploadUrl,
        expiresAt: new Date(docRequest.expiresAt),
        customMessage,
      });
      
      if (emailResult.success && emailResult.messageId) {
        recordEmailSent(docRequest.id, emailResult.messageId);
      }
    }
    
    return NextResponse.json({
      success: true,
      request: docRequest,
      uploadUrl,
      emailSent: emailResult?.success || false,
      emailMessageId: emailResult?.messageId,
    });
  } catch (error: any) {
    console.error('Error creating document request:', error);
    return NextResponse.json(
      { error: 'Failed to create document request', details: error.message },
      { status: 500 }
    );
  }
}

// Generate demo requests from real provider data
async function generateDemoRequests() {
  const providersFile = path.join(process.cwd(), 'data', 'arizona-providers.json');
  const practicesFile = path.join(process.cwd(), 'data', 'arizona-practices.json');
  
  let providers: any[] = [];
  let practices: any[] = [];
  
  try {
    if (fs.existsSync(providersFile)) {
      providers = JSON.parse(fs.readFileSync(providersFile, 'utf-8'));
    }
    if (fs.existsSync(practicesFile)) {
      practices = JSON.parse(fs.readFileSync(practicesFile, 'utf-8'));
    }
  } catch (error) {
    console.error('Error loading provider data:', error);
    return [];
  }
  
  if (providers.length === 0) return [];
  
  // Get unique providers by NPI
  const uniqueProviders = new Map<string, any>();
  providers.forEach(p => {
    if (p.npi && !uniqueProviders.has(p.npi)) {
      uniqueProviders.set(p.npi, p);
    }
  });
  
  const sampleProviders = Array.from(uniqueProviders.values()).slice(0, 40);
  const today = new Date();
  const docTypes = ["license", "dea", "malpractice_coi", "board_cert", "w9", "cv"];
  const staffNames = ["Jane Smith", "Mike Johnson", "Sarah Davis", "Tom Wilson"];
  
  return sampleProviders.map((provider, index) => {
    const providerName = `${provider.firstName || ''} ${provider.lastName || ''}`.trim();
    const credential = provider.credentials || provider.credential || '';
    const displayName = credential ? `${providerName}, ${credential}` : providerName;
    const practiceName = provider.billing?.name || 'Unknown Practice';
    
    // Generate email
    const emailName = providerName.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z.]/g, '');
    const email = `${emailName}@${practiceName.toLowerCase().replace(/[^a-z]/g, '').slice(0, 10) || 'provider'}.com`;
    
    // Random status
    const rand = Math.random();
    let status: 'pending' | 'partial' | 'complete' | 'expired';
    if (rand < 0.30) status = 'pending';
    else if (rand < 0.55) status = 'partial';
    else if (rand < 0.85) status = 'complete';
    else status = 'expired';
    
    // Random docs requested (2-5)
    const numDocs = Math.floor(Math.random() * 4) + 2;
    const shuffled = [...docTypes].sort(() => Math.random() - 0.5);
    const requestedDocs = shuffled.slice(0, numDocs);
    
    // Random docs uploaded based on status
    let uploadedDocs: any[] = [];
    if (status === 'partial') {
      const numUploaded = Math.floor(Math.random() * (requestedDocs.length - 1)) + 1;
      uploadedDocs = requestedDocs.slice(0, numUploaded).map(docType => ({
        docType,
        filename: `${docType}_${provider.npi}.pdf`,
        uploadedAt: new Date(today.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        fileSize: Math.floor(Math.random() * 500000) + 100000,
        contentType: 'application/pdf',
      }));
    } else if (status === 'complete') {
      uploadedDocs = requestedDocs.map(docType => ({
        docType,
        filename: `${docType}_${provider.npi}.pdf`,
        uploadedAt: new Date(today.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        fileSize: Math.floor(Math.random() * 500000) + 100000,
        contentType: 'application/pdf',
      }));
    }
    
    // Dates
    const createdAt = new Date(today.getTime() - (index + 1) * 24 * 60 * 60 * 1000);
    const expiresAt = new Date(createdAt.getTime() + 14 * 24 * 60 * 60 * 1000);
    
    return {
      id: `REQ-${(1000 + index).toString()}`,
      token: `demo-token-${provider.npi}`,
      providerId: `prov-${provider.npi}`,
      providerNpi: provider.npi,
      providerName: displayName,
      providerEmail: email,
      practiceName,
      requestedDocs,
      uploadedDocs,
      status,
      createdAt: createdAt.toISOString(),
      createdBy: staffNames[index % staffNames.length],
      expiresAt: expiresAt.toISOString(),
      remindersSent: status === 'pending' ? Math.floor(Math.random() * 3) : 0,
      lastReminderAt: status === 'pending' && Math.random() > 0.5 
        ? new Date(today.getTime() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString() 
        : null,
      emailSentAt: createdAt.toISOString(),
      emailMessageId: `demo-msg-${index}`,
    };
  });
}
