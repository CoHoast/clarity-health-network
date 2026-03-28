/**
 * PHI Field-Level Encryption
 * 
 * HIPAA requires encryption of PHI at rest
 * This provides field-level encryption for sensitive data:
 * - SSN
 * - Date of Birth
 * - Medical Record Numbers
 * - Bank Account Numbers
 * 
 * Uses AES-256-GCM (NIST approved)
 */

import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 32;

// Get encryption key from environment (must be 32 bytes for AES-256)
function getEncryptionKey(): Buffer {
  const key = process.env.PHI_ENCRYPTION_KEY;
  
  if (!key) {
    console.warn('[PHI Encryption] No encryption key configured - using derived key');
    // Derive a key from a secret (not ideal, but better than nothing)
    const secret = process.env.SESSION_SECRET || 'default-secret-change-me';
    return crypto.pbkdf2Sync(secret, 'phi-salt', 100000, 32, 'sha256');
  }
  
  // If key is base64 encoded
  if (key.length === 44) {
    return Buffer.from(key, 'base64');
  }
  
  // If key is hex encoded (64 chars = 32 bytes)
  if (key.length === 64) {
    return Buffer.from(key, 'hex');
  }
  
  // Use as-is if 32 bytes
  if (key.length === 32) {
    return Buffer.from(key);
  }
  
  // Hash to get 32 bytes
  return crypto.createHash('sha256').update(key).digest();
}

/**
 * Encrypt sensitive PHI field
 * Returns: base64 encoded string (IV + AuthTag + Ciphertext)
 */
export function encryptPhi(plaintext: string): string {
  if (!plaintext) return '';
  
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(plaintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  const authTag = cipher.getAuthTag();
  
  // Combine: IV (16) + AuthTag (16) + Ciphertext
  const combined = Buffer.concat([
    iv,
    authTag,
    Buffer.from(encrypted, 'base64'),
  ]);
  
  return combined.toString('base64');
}

/**
 * Decrypt sensitive PHI field
 */
export function decryptPhi(encryptedData: string): string {
  if (!encryptedData) return '';
  
  try {
    const key = getEncryptionKey();
    const combined = Buffer.from(encryptedData, 'base64');
    
    // Extract parts
    const iv = combined.subarray(0, IV_LENGTH);
    const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const ciphertext = combined.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(ciphertext);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString('utf8');
  } catch (error) {
    console.error('[PHI Encryption] Decryption failed:', error);
    return '[DECRYPTION_ERROR]';
  }
}

/**
 * Mask PHI for display (show only last 4 chars)
 */
export function maskPhiField(value: string, showLast: number = 4): string {
  if (!value || value.length <= showLast) {
    return '****';
  }
  const masked = '*'.repeat(value.length - showLast);
  return masked + value.slice(-showLast);
}

/**
 * Mask SSN for display (XXX-XX-1234)
 */
export function maskPhiSsn(ssn: string): string {
  const cleaned = ssn.replace(/\D/g, '');
  if (cleaned.length !== 9) {
    return '***-**-****';
  }
  return `***-**-${cleaned.slice(-4)}`;
}

/**
 * Mask date of birth (show only year)
 */
export function maskPhiDob(dob: string | Date): string {
  const date = typeof dob === 'string' ? new Date(dob) : dob;
  if (isNaN(date.getTime())) {
    return '**/**/****';
  }
  return `**/**/${date.getFullYear()}`;
}

/**
 * Check if a string appears to be PHI encrypted
 */
export function isPhiEncrypted(value: string): boolean {
  if (!value || value.length < 44) return false;
  
  try {
    const decoded = Buffer.from(value, 'base64');
    // Minimum size: IV (16) + AuthTag (16) + at least 1 byte ciphertext
    return decoded.length >= 33;
  } catch {
    return false;
  }
}

/**
 * Encrypt object fields that contain PHI (V2 - improved)
 */
export function encryptPhiFieldsV2<T extends Record<string, any>>(
  obj: T,
  fields: (keyof T)[]
): T {
  const result = { ...obj };
  
  for (const field of fields) {
    if (result[field] && typeof result[field] === 'string') {
      result[field] = encryptPhi(result[field] as string) as T[keyof T];
    }
  }
  
  return result;
}

/**
 * Decrypt object fields that contain PHI (V2 - improved)
 */
export function decryptPhiFieldsV2<T extends Record<string, any>>(
  obj: T,
  fields: (keyof T)[]
): T {
  const result = { ...obj };
  
  for (const field of fields) {
    if (result[field] && typeof result[field] === 'string' && isPhiEncrypted(result[field] as string)) {
      result[field] = decryptPhi(result[field] as string) as T[keyof T];
    }
  }
  
  return result;
}

// PHI field definitions for different entity types
export const PHI_FIELDS = {
  member: ['ssn', 'dateOfBirth', 'bankAccountNumber', 'bankRoutingNumber'],
  provider: ['ssn', 'taxId', 'dateOfBirth', 'deaNumber'],
  claim: ['memberSsn', 'diagnosisCodes', 'procedureCodes'],
} as const;
