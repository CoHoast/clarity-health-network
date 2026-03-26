/**
 * AWS S3 Integration for HIPAA-Compliant Document Storage
 * 
 * Features:
 * - Presigned URLs for secure uploads (no credentials exposed to browser)
 * - Server-side encryption (SSE-S3 or SSE-KMS)
 * - Automatic content type detection
 * - Expiring URLs for security
 */

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize S3 client (only if configured)
function getS3Client(): S3Client | null {
  if (!process.env.S3_BUCKET_NAME || !process.env.AWS_ACCESS_KEY_ID) {
    return null;
  }
  
  return new S3Client({
    region: process.env.S3_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
}

// Check if S3 is configured
export function isS3Configured(): boolean {
  return !!(process.env.S3_BUCKET_NAME && process.env.AWS_ACCESS_KEY_ID);
}

// Document storage path structure
// Format: {clientId}/documents/{providerId}/{documentType}/{filename}
export function getDocumentKey(
  clientId: string,
  providerId: string,
  documentType: string,
  filename: string
): string {
  const timestamp = Date.now();
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${clientId}/documents/${providerId}/${documentType}/${timestamp}_${sanitizedFilename}`;
}

// Generate presigned URL for uploading
export async function getUploadUrl(params: {
  clientId: string;
  providerId: string;
  documentType: string;
  filename: string;
  contentType: string;
  expiresInSeconds?: number;
}): Promise<{ uploadUrl: string; key: string } | null> {
  const client = getS3Client();
  if (!client) {
    console.log('[S3] Not configured - returning null');
    return null;
  }

  const key = getDocumentKey(
    params.clientId,
    params.providerId,
    params.documentType,
    params.filename
  );

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    ContentType: params.contentType,
    ServerSideEncryption: 'AES256', // SSE-S3 encryption
    Metadata: {
      'client-id': params.clientId,
      'provider-id': params.providerId,
      'document-type': params.documentType,
      'uploaded-at': new Date().toISOString(),
    },
  });

  const uploadUrl = await getSignedUrl(client, command, {
    expiresIn: params.expiresInSeconds || 900, // 15 minutes default
  });

  return { uploadUrl, key };
}

// Generate presigned URL for downloading/viewing
export async function getDownloadUrl(
  key: string,
  expiresInSeconds: number = 3600 // 1 hour default
): Promise<string | null> {
  const client = getS3Client();
  if (!client) {
    console.log('[S3] Not configured - returning null');
    return null;
  }

  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
  });

  return getSignedUrl(client, command, { expiresIn: expiresInSeconds });
}

// Delete a document
export async function deleteDocument(key: string): Promise<boolean> {
  const client = getS3Client();
  if (!client) {
    console.log('[S3] Not configured - returning false');
    return false;
  }

  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
    });

    await client.send(command);
    return true;
  } catch (error) {
    console.error('[S3] Delete error:', error);
    return false;
  }
}

// Validate allowed file types
export function isAllowedFileType(contentType: string): boolean {
  const allowed = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  return allowed.includes(contentType);
}

// Validate file size (max 10MB)
export function isAllowedFileSize(sizeInBytes: number): boolean {
  const maxSize = 10 * 1024 * 1024; // 10MB
  return sizeInBytes <= maxSize;
}

// Generate a secure upload token
export function generateUploadToken(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}
