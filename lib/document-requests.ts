/**
 * Document Request Management
 * Handles creation, storage, and retrieval of document requests
 */

import fs from 'fs';
import path from 'path';
import { generateUploadToken } from './aws/s3';

const DATA_FILE = path.join(process.cwd(), 'data', 'document-requests.json');

export interface DocumentRequest {
  id: string;
  token: string;
  
  // Provider info
  providerId: string;
  providerNpi: string;
  providerName: string;
  providerEmail: string;
  practiceName: string;
  
  // Request details
  requestedDocs: string[];
  uploadedDocs: UploadedDocument[];
  
  // Status
  status: 'pending' | 'partial' | 'complete' | 'expired';
  
  // Tracking
  createdAt: string;
  createdBy: string;
  expiresAt: string;
  
  // Reminders
  remindersSent: number;
  lastReminderAt: string | null;
  
  // Custom message
  customMessage?: string;
  
  // Email tracking
  emailSentAt: string | null;
  emailMessageId: string | null;
}

export interface UploadedDocument {
  docType: string;
  filename: string;
  s3Key?: string;
  localPath?: string;
  uploadedAt: string;
  fileSize: number;
  contentType: string;
}

// Load all document requests
export function loadDocumentRequests(): DocumentRequest[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading document requests:', error);
  }
  return [];
}

// Save all document requests
function saveDocumentRequests(requests: DocumentRequest[]): void {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(requests, null, 2));
  } catch (error) {
    console.error('Error saving document requests:', error);
  }
}

// Create a new document request
export function createDocumentRequest(params: {
  providerId: string;
  providerNpi: string;
  providerName: string;
  providerEmail: string;
  practiceName: string;
  requestedDocs: string[];
  createdBy: string;
  expiresInDays?: number;
  customMessage?: string;
}): DocumentRequest {
  const requests = loadDocumentRequests();
  
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + (params.expiresInDays || 14));
  
  const request: DocumentRequest = {
    id: `REQ-${Date.now().toString(36).toUpperCase()}`,
    token: generateUploadToken(),
    
    providerId: params.providerId,
    providerNpi: params.providerNpi,
    providerName: params.providerName,
    providerEmail: params.providerEmail,
    practiceName: params.practiceName,
    
    requestedDocs: params.requestedDocs,
    uploadedDocs: [],
    
    status: 'pending',
    
    createdAt: new Date().toISOString(),
    createdBy: params.createdBy,
    expiresAt: expiresAt.toISOString(),
    
    remindersSent: 0,
    lastReminderAt: null,
    
    customMessage: params.customMessage,
    
    emailSentAt: null,
    emailMessageId: null,
  };
  
  requests.push(request);
  saveDocumentRequests(requests);
  
  return request;
}

// Get document request by ID
export function getDocumentRequestById(id: string): DocumentRequest | null {
  const requests = loadDocumentRequests();
  return requests.find(r => r.id === id) || null;
}

// Get document request by token (for upload portal)
export function getDocumentRequestByToken(token: string): DocumentRequest | null {
  const requests = loadDocumentRequests();
  const request = requests.find(r => r.token === token);
  
  if (!request) return null;
  
  // Check if expired
  if (new Date(request.expiresAt) < new Date()) {
    // Mark as expired
    updateDocumentRequest(request.id, { status: 'expired' });
    return { ...request, status: 'expired' };
  }
  
  return request;
}

// Update document request
export function updateDocumentRequest(
  id: string,
  updates: Partial<DocumentRequest>
): DocumentRequest | null {
  const requests = loadDocumentRequests();
  const index = requests.findIndex(r => r.id === id);
  
  if (index === -1) return null;
  
  requests[index] = { ...requests[index], ...updates };
  saveDocumentRequests(requests);
  
  return requests[index];
}

// Add uploaded document
export function addUploadedDocument(
  requestId: string,
  doc: UploadedDocument
): DocumentRequest | null {
  const requests = loadDocumentRequests();
  const index = requests.findIndex(r => r.id === requestId);
  
  if (index === -1) return null;
  
  const request = requests[index];
  
  // Remove any existing upload for this doc type
  request.uploadedDocs = request.uploadedDocs.filter(d => d.docType !== doc.docType);
  request.uploadedDocs.push(doc);
  
  // Update status based on uploads
  const uploadedTypes = new Set(request.uploadedDocs.map(d => d.docType));
  const allUploaded = request.requestedDocs.every(docType => uploadedTypes.has(docType));
  
  if (allUploaded) {
    request.status = 'complete';
  } else if (request.uploadedDocs.length > 0) {
    request.status = 'partial';
  }
  
  saveDocumentRequests(requests);
  return request;
}

// Record reminder sent
export function recordReminderSent(
  requestId: string,
  messageId?: string
): DocumentRequest | null {
  const request = getDocumentRequestById(requestId);
  if (!request) return null;
  
  return updateDocumentRequest(requestId, {
    remindersSent: request.remindersSent + 1,
    lastReminderAt: new Date().toISOString(),
  });
}

// Record initial email sent
export function recordEmailSent(
  requestId: string,
  messageId: string
): DocumentRequest | null {
  return updateDocumentRequest(requestId, {
    emailSentAt: new Date().toISOString(),
    emailMessageId: messageId,
  });
}

// Get pending document requests for a provider
export function getRequestsForProvider(providerNpi: string): DocumentRequest[] {
  const requests = loadDocumentRequests();
  return requests.filter(r => r.providerNpi === providerNpi);
}

// Get all requests with filtering
export function getDocumentRequests(params?: {
  status?: string;
  limit?: number;
}): DocumentRequest[] {
  let requests = loadDocumentRequests();
  
  // Check for expired requests and update them
  const now = new Date();
  requests = requests.map(r => {
    if (r.status !== 'complete' && r.status !== 'expired' && new Date(r.expiresAt) < now) {
      return { ...r, status: 'expired' as const };
    }
    return r;
  });
  
  if (params?.status) {
    requests = requests.filter(r => r.status === params.status);
  }
  
  // Sort by created date, newest first
  requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  if (params?.limit) {
    requests = requests.slice(0, params.limit);
  }
  
  return requests;
}

// Delete document request
export function deleteDocumentRequest(id: string): boolean {
  const requests = loadDocumentRequests();
  const filtered = requests.filter(r => r.id !== id);
  
  if (filtered.length === requests.length) return false;
  
  saveDocumentRequests(filtered);
  return true;
}

// Generate upload URL for the portal
export function getUploadPortalUrl(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/upload/${token}`;
}
