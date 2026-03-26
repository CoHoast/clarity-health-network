/**
 * Document Request Reminder API
 * POST /api/document-requests/[id]/reminder - Send reminder email
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getDocumentRequestById,
  recordReminderSent,
  getUploadPortalUrl,
} from '@/lib/document-requests';
import { sendReminderEmail, isSESConfigured } from '@/lib/aws/ses';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const docRequest = getDocumentRequestById(id);
    
    if (!docRequest) {
      return NextResponse.json(
        { error: 'Document request not found' },
        { status: 404 }
      );
    }
    
    if (docRequest.status === 'complete') {
      return NextResponse.json(
        { error: 'Cannot send reminder for completed request' },
        { status: 400 }
      );
    }
    
    if (docRequest.status === 'expired') {
      return NextResponse.json(
        { error: 'Cannot send reminder for expired request' },
        { status: 400 }
      );
    }
    
    // Calculate pending documents
    const uploadedDocTypes = new Set(docRequest.uploadedDocs.map(d => d.docType));
    const pendingDocs = docRequest.requestedDocs.filter(doc => !uploadedDocTypes.has(doc));
    
    if (pendingDocs.length === 0) {
      return NextResponse.json(
        { error: 'All documents have been uploaded' },
        { status: 400 }
      );
    }
    
    // Generate upload URL
    const uploadUrl = getUploadPortalUrl(docRequest.token);
    
    // Send reminder email
    const emailResult = await sendReminderEmail({
      to: docRequest.providerEmail,
      providerName: docRequest.providerName,
      networkName: process.env.NETWORK_NAME || 'TrueCare Health Network',
      pendingDocuments: pendingDocs,
      uploadUrl,
      expiresAt: new Date(docRequest.expiresAt),
      reminderNumber: docRequest.remindersSent + 1,
    });
    
    if (emailResult.success) {
      // Record the reminder
      recordReminderSent(id, emailResult.messageId);
      
      return NextResponse.json({
        success: true,
        message: 'Reminder email sent successfully',
        messageId: emailResult.messageId,
        reminderCount: docRequest.remindersSent + 1,
        pendingDocs,
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send email', details: emailResult.error },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error sending reminder:', error);
    return NextResponse.json(
      { error: 'Failed to send reminder', details: error.message },
      { status: 500 }
    );
  }
}
