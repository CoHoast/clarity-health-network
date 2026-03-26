/**
 * Upload Portal API
 * GET /api/upload/[token] - Get document request details by token
 * POST /api/upload/[token] - Upload a document
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getDocumentRequestByToken,
  addUploadedDocument,
  UploadedDocument,
} from '@/lib/document-requests';
import { getUploadUrl, isS3Configured, isAllowedFileType, isAllowedFileSize } from '@/lib/aws/s3';
import { sendConfirmationEmail, isSESConfigured } from '@/lib/aws/ses';
import fs from 'fs';
import path from 'path';

// GET - Get document request details for upload portal
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    
    const docRequest = getDocumentRequestByToken(token);
    
    if (!docRequest) {
      return NextResponse.json(
        { error: 'invalid', message: 'Invalid or unknown upload link' },
        { status: 404 }
      );
    }
    
    if (docRequest.status === 'expired') {
      return NextResponse.json(
        { error: 'expired', message: 'This upload link has expired' },
        { status: 410 }
      );
    }
    
    // Return sanitized data for the portal
    return NextResponse.json({
      id: docRequest.id,
      token: docRequest.token,
      provider: {
        name: docRequest.providerName,
        practice: docRequest.practiceName,
        email: docRequest.providerEmail,
      },
      network: {
        name: process.env.NETWORK_NAME || 'TrueCare Health Network',
        logo: '/logo.svg',
      },
      requestedDocs: docRequest.requestedDocs,
      uploadedDocs: docRequest.uploadedDocs.map(d => d.docType),
      expiresAt: docRequest.expiresAt,
      createdAt: docRequest.createdAt,
      customMessage: docRequest.customMessage,
    });
  } catch (error: any) {
    console.error('Error fetching upload request:', error);
    return NextResponse.json(
      { error: 'server_error', message: 'Failed to load upload request' },
      { status: 500 }
    );
  }
}

// POST - Handle document upload
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    
    const docRequest = getDocumentRequestByToken(token);
    
    if (!docRequest) {
      return NextResponse.json(
        { error: 'Invalid upload link' },
        { status: 404 }
      );
    }
    
    if (docRequest.status === 'expired') {
      return NextResponse.json(
        { error: 'Upload link has expired' },
        { status: 410 }
      );
    }
    
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const docType = formData.get('docType') as string | null;
    
    if (!file || !docType) {
      return NextResponse.json(
        { error: 'File and document type are required' },
        { status: 400 }
      );
    }
    
    // Validate file type
    if (!isAllowedFileType(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: PDF, JPG, PNG' },
        { status: 400 }
      );
    }
    
    // Validate file size
    if (!isAllowedFileSize(file.size)) {
      return NextResponse.json(
        { error: 'File too large. Maximum size: 10MB' },
        { status: 400 }
      );
    }
    
    // Validate doc type is in requested docs
    if (!docRequest.requestedDocs.includes(docType)) {
      return NextResponse.json(
        { error: 'Document type not in request' },
        { status: 400 }
      );
    }
    
    let uploadResult: { s3Key?: string; localPath?: string };
    
    if (isS3Configured()) {
      // Upload to S3
      const presigned = await getUploadUrl({
        clientId: 'solidarity', // In multi-tenant, this would be dynamic
        providerId: docRequest.providerNpi,
        documentType: docType,
        filename: file.name,
        contentType: file.type,
      });
      
      if (presigned) {
        // Upload to S3 using presigned URL
        const buffer = await file.arrayBuffer();
        const uploadResponse = await fetch(presigned.uploadUrl, {
          method: 'PUT',
          body: buffer,
          headers: {
            'Content-Type': file.type,
          },
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload to S3');
        }
        
        uploadResult = { s3Key: presigned.key };
      } else {
        throw new Error('Failed to generate upload URL');
      }
    } else {
      // Save locally (dev mode)
      const uploadDir = path.join(process.cwd(), 'uploads', docRequest.providerNpi);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const filename = `${docType}_${Date.now()}_${file.name}`;
      const filepath = path.join(uploadDir, filename);
      
      const buffer = await file.arrayBuffer();
      fs.writeFileSync(filepath, Buffer.from(buffer));
      
      uploadResult = { localPath: filepath };
    }
    
    // Record the upload
    const uploadedDoc: UploadedDocument = {
      docType,
      filename: file.name,
      s3Key: uploadResult.s3Key,
      localPath: uploadResult.localPath,
      uploadedAt: new Date().toISOString(),
      fileSize: file.size,
      contentType: file.type,
    };
    
    const updatedRequest = addUploadedDocument(docRequest.id, uploadedDoc);
    
    // Check if all docs are now uploaded
    if (updatedRequest?.status === 'complete' && isSESConfigured()) {
      // Send confirmation email
      await sendConfirmationEmail({
        to: docRequest.providerEmail,
        providerName: docRequest.providerName,
        networkName: process.env.NETWORK_NAME || 'TrueCare Health Network',
        uploadedDocuments: updatedRequest.uploadedDocs.map(d => d.docType),
      });
    }
    
    return NextResponse.json({
      success: true,
      docType,
      filename: file.name,
      status: updatedRequest?.status || 'partial',
      uploadedCount: updatedRequest?.uploadedDocs.length || 0,
      totalRequested: docRequest.requestedDocs.length,
    });
  } catch (error: any) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { error: 'Failed to upload document', details: error.message },
      { status: 500 }
    );
  }
}
