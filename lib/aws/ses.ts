/**
 * AWS SES Integration for HIPAA-Compliant Email
 * 
 * Features:
 * - Document request emails with secure upload links
 * - Reminder emails
 * - Confirmation emails
 * - HTML + plain text versions
 */

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

// Initialize SES client (only if configured)
function getSESClient(): SESClient | null {
  if (!process.env.SES_FROM_EMAIL || !process.env.AWS_ACCESS_KEY_ID) {
    return null;
  }
  
  return new SESClient({
    region: process.env.SES_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
}

// Check if SES is configured
export function isSESConfigured(): boolean {
  return !!(process.env.SES_FROM_EMAIL && process.env.AWS_ACCESS_KEY_ID);
}

// Base email sending function
async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const client = getSESClient();
  
  if (!client) {
    // Dev mode - log email instead of sending
    console.log('\n========== EMAIL (Dev Mode) ==========');
    console.log(`To: ${params.to}`);
    console.log(`Subject: ${params.subject}`);
    console.log(`Body: ${params.text.slice(0, 500)}...`);
    console.log('=======================================\n');
    return { success: true, messageId: 'dev-mode-' + Date.now() };
  }

  try {
    const command = new SendEmailCommand({
      Source: process.env.SES_FROM_EMAIL!,
      Destination: {
        ToAddresses: [params.to],
      },
      Message: {
        Subject: {
          Data: params.subject,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: params.html,
            Charset: 'UTF-8',
          },
          Text: {
            Data: params.text,
            Charset: 'UTF-8',
          },
        },
      },
    });

    const response = await client.send(command);
    return { success: true, messageId: response.MessageId };
  } catch (error: any) {
    console.error('[SES] Send error:', error);
    return { success: false, error: error.message };
  }
}

// Email template: Document Request
export async function sendDocumentRequestEmail(params: {
  to: string;
  providerName: string;
  practiceName: string;
  networkName: string;
  documents: string[];
  uploadUrl: string;
  expiresAt: Date;
  customMessage?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const documentList = params.documents
    .map(doc => `• ${getDocumentLabel(doc)}`)
    .join('\n');
  
  const documentListHtml = params.documents
    .map(doc => `<li>${getDocumentLabel(doc)}</li>`)
    .join('');

  const expiresFormatted = params.expiresAt.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const subject = `Document Request from ${params.networkName}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%); padding: 30px; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">${params.networkName}</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Credentialing Document Request</p>
  </div>
  
  <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none;">
    <p style="margin-top: 0;">Dear <strong>${params.providerName}</strong>,</p>
    
    <p>We are requesting the following documents to complete your credentialing with ${params.networkName}:</p>
    
    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <p style="margin: 0 0 10px 0; font-weight: 600; color: #1e293b;">Required Documents:</p>
      <ul style="margin: 0; padding-left: 20px; color: #475569;">
        ${documentListHtml}
      </ul>
    </div>
    
    ${params.customMessage ? `
    <div style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; color: #92400e;"><strong>Note:</strong> ${params.customMessage}</p>
    </div>
    ` : ''}
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${params.uploadUrl}" style="display: inline-block; background: #3B82F6; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Upload Documents Securely
      </a>
    </div>
    
    <p style="color: #64748b; font-size: 14px;">
      <strong>This link expires:</strong> ${expiresFormatted}<br>
      <strong>Practice:</strong> ${params.practiceName}
    </p>
    
    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
    
    <p style="color: #64748b; font-size: 13px; margin-bottom: 0;">
      If you have questions, please contact our credentialing team.<br>
      This is a secure link - do not forward this email.
    </p>
  </div>
  
  <div style="background: #1e293b; color: #94a3b8; padding: 20px; border-radius: 0 0 12px 12px; font-size: 12px; text-align: center;">
    <p style="margin: 0;">© ${new Date().getFullYear()} ${params.networkName}. All rights reserved.</p>
    <p style="margin: 10px 0 0 0;">This email contains confidential information intended for healthcare credentialing purposes.</p>
  </div>
</body>
</html>
  `.trim();

  const text = `
Document Request from ${params.networkName}

Dear ${params.providerName},

We are requesting the following documents to complete your credentialing with ${params.networkName}:

Required Documents:
${documentList}

${params.customMessage ? `Note: ${params.customMessage}\n` : ''}

Upload your documents securely at:
${params.uploadUrl}

This link expires: ${expiresFormatted}
Practice: ${params.practiceName}

If you have questions, please contact our credentialing team.

This email contains confidential information intended for healthcare credentialing purposes.
  `.trim();

  return sendEmail({ to: params.to, subject, html, text });
}

// Email template: Reminder
export async function sendReminderEmail(params: {
  to: string;
  providerName: string;
  networkName: string;
  pendingDocuments: string[];
  uploadUrl: string;
  expiresAt: Date;
  reminderNumber: number;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const documentList = params.pendingDocuments
    .map(doc => `• ${getDocumentLabel(doc)}`)
    .join('\n');

  const documentListHtml = params.pendingDocuments
    .map(doc => `<li>${getDocumentLabel(doc)}</li>`)
    .join('');

  const expiresFormatted = params.expiresAt.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const urgency = params.reminderNumber >= 3 ? 'URGENT: ' : '';
  const subject = `${urgency}Reminder: Documents Still Needed - ${params.networkName}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: ${params.reminderNumber >= 3 ? '#DC2626' : '#F59E0B'}; padding: 30px; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">📋 Reminder: Documents Needed</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">${params.networkName}</p>
  </div>
  
  <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none;">
    <p style="margin-top: 0;">Dear <strong>${params.providerName}</strong>,</p>
    
    <p>This is a friendly reminder that we are still waiting for the following documents:</p>
    
    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <p style="margin: 0 0 10px 0; font-weight: 600; color: #1e293b;">Still Needed:</p>
      <ul style="margin: 0; padding-left: 20px; color: #475569;">
        ${documentListHtml}
      </ul>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${params.uploadUrl}" style="display: inline-block; background: #3B82F6; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Upload Documents Now
      </a>
    </div>
    
    <p style="color: #DC2626; font-size: 14px; font-weight: 600;">
      ⚠️ This link expires: ${expiresFormatted}
    </p>
  </div>
  
  <div style="background: #1e293b; color: #94a3b8; padding: 20px; border-radius: 0 0 12px 12px; font-size: 12px; text-align: center;">
    <p style="margin: 0;">© ${new Date().getFullYear()} ${params.networkName}. All rights reserved.</p>
  </div>
</body>
</html>
  `.trim();

  const text = `
REMINDER: Documents Still Needed - ${params.networkName}

Dear ${params.providerName},

This is a friendly reminder that we are still waiting for the following documents:

Still Needed:
${documentList}

Upload your documents now at:
${params.uploadUrl}

⚠️ This link expires: ${expiresFormatted}

If you have questions, please contact our credentialing team.
  `.trim();

  return sendEmail({ to: params.to, subject, html, text });
}

// Email template: Submission Confirmation
export async function sendConfirmationEmail(params: {
  to: string;
  providerName: string;
  networkName: string;
  uploadedDocuments: string[];
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const documentListHtml = params.uploadedDocuments
    .map(doc => `<li>✓ ${getDocumentLabel(doc)}</li>`)
    .join('');

  const subject = `Documents Received - ${params.networkName}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #10B981; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
    <div style="font-size: 48px; margin-bottom: 10px;">✓</div>
    <h1 style="color: white; margin: 0; font-size: 24px;">Documents Received!</h1>
  </div>
  
  <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none;">
    <p style="margin-top: 0;">Dear <strong>${params.providerName}</strong>,</p>
    
    <p>Thank you! We have received the following documents:</p>
    
    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <ul style="margin: 0; padding-left: 20px; color: #059669;">
        ${documentListHtml}
      </ul>
    </div>
    
    <p>Our credentialing team will review your documents and contact you if any additional information is needed.</p>
    
    <p style="color: #64748b; font-size: 14px;">
      You may close this email. No further action is required at this time.
    </p>
  </div>
  
  <div style="background: #1e293b; color: #94a3b8; padding: 20px; border-radius: 0 0 12px 12px; font-size: 12px; text-align: center;">
    <p style="margin: 0;">© ${new Date().getFullYear()} ${params.networkName}. All rights reserved.</p>
  </div>
</body>
</html>
  `.trim();

  const text = `
Documents Received - ${params.networkName}

Dear ${params.providerName},

Thank you! We have received your documents.

Our credentialing team will review your documents and contact you if any additional information is needed.

No further action is required at this time.
  `.trim();

  return sendEmail({ to: params.to, subject, html, text });
}

// Helper: Get human-readable document label
function getDocumentLabel(docType: string): string {
  const labels: Record<string, string> = {
    license: 'State Medical License',
    dea: 'DEA Certificate',
    board_cert: 'Board Certification',
    malpractice_coi: 'Malpractice Insurance (COI)',
    cv: 'CV / Resume',
    w9: 'W-9 Form',
    attestation: 'Attestation Form',
    collaborative: 'Collaborative Agreement',
    clia: 'CLIA Certificate',
    immunization: 'Immunization Records',
    background_check: 'Background Check Authorization',
    references: 'Professional References',
  };
  return labels[docType] || docType;
}
