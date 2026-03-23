// PHI Field-Level Encryption
// AES-256-GCM encryption for sensitive data fields

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

// Encryption key from environment (32 bytes for AES-256)
// In production, use a proper key management service (AWS KMS, HashiCorp Vault)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'solidarity-demo-encryption-key-32b';
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 16;

// Derive a proper 32-byte key from the password
function deriveKey(password: string, salt: Buffer): Buffer {
  return scryptSync(password, salt, 32);
}

// Encrypt a string value
export function encrypt(plaintext: string): string {
  if (!plaintext) return '';
  
  try {
    const salt = randomBytes(SALT_LENGTH);
    const key = deriveKey(ENCRYPTION_KEY, salt);
    const iv = randomBytes(IV_LENGTH);
    
    const cipher = createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(plaintext, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    const authTag = cipher.getAuthTag();
    
    // Combine salt + iv + authTag + encrypted data
    const combined = Buffer.concat([
      salt,
      iv,
      authTag,
      Buffer.from(encrypted, 'base64'),
    ]);
    
    // Return as prefixed base64 string
    return 'enc:' + combined.toString('base64');
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

// Decrypt an encrypted string
export function decrypt(encryptedData: string): string {
  if (!encryptedData) return '';
  
  // Check if data is encrypted
  if (!encryptedData.startsWith('enc:')) {
    // Return as-is if not encrypted (for backwards compatibility)
    return encryptedData;
  }
  
  try {
    const combined = Buffer.from(encryptedData.slice(4), 'base64');
    
    // Extract components
    const salt = combined.subarray(0, SALT_LENGTH);
    const iv = combined.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const authTag = combined.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH);
    const encrypted = combined.subarray(SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH);
    
    const key = deriveKey(ENCRYPTION_KEY, salt);
    
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString('utf8');
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

// Check if a value is encrypted
export function isEncrypted(value: string): boolean {
  return value?.startsWith('enc:') ?? false;
}

// Mask sensitive data for display
export function maskSsn(ssn: string): string {
  if (!ssn) return '';
  const decrypted = isEncrypted(ssn) ? decrypt(ssn) : ssn;
  const digits = decrypted.replace(/\D/g, '');
  if (digits.length !== 9) return '***-**-****';
  return `***-**-${digits.slice(-4)}`;
}

export function maskDob(dob: string): string {
  if (!dob) return '';
  const decrypted = isEncrypted(dob) ? decrypt(dob) : dob;
  // Return just the year
  const year = decrypted.split('-')[0] || decrypted.split('/').pop();
  return `**/**/` + year;
}

export function maskPhone(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return '***-***-****';
  return `***-***-${digits.slice(-4)}`;
}

export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return '****@****.***';
  const [local, domain] = email.split('@');
  const maskedLocal = local.slice(0, 2) + '***';
  return `${maskedLocal}@${domain}`;
}

// Encrypt PHI fields in an object
export function encryptPhiFields<T extends Record<string, unknown>>(
  obj: T,
  fields: string[] = ['ssn', 'dateOfBirth', 'dob']
): T {
  const result = { ...obj };
  
  for (const field of fields) {
    if (result[field] && typeof result[field] === 'string' && !isEncrypted(result[field] as string)) {
      (result as Record<string, unknown>)[field] = encrypt(result[field] as string);
    }
  }
  
  return result;
}

// Decrypt PHI fields in an object
export function decryptPhiFields<T extends Record<string, unknown>>(
  obj: T,
  fields: string[] = ['ssn', 'dateOfBirth', 'dob']
): T {
  const result = { ...obj };
  
  for (const field of fields) {
    if (result[field] && typeof result[field] === 'string' && isEncrypted(result[field] as string)) {
      (result as Record<string, unknown>)[field] = decrypt(result[field] as string);
    }
  }
  
  return result;
}

// Mask PHI fields for display
export function maskPhiFields<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj };
  
  // Mask SSN
  if (result.ssn && typeof result.ssn === 'string') {
    (result as Record<string, unknown>).ssn = maskSsn(result.ssn as string);
  }
  
  // Mask DOB
  if (result.dateOfBirth && typeof result.dateOfBirth === 'string') {
    (result as Record<string, unknown>).dateOfBirth = maskDob(result.dateOfBirth as string);
  }
  if (result.dob && typeof result.dob === 'string') {
    (result as Record<string, unknown>).dob = maskDob(result.dob as string);
  }
  
  return result;
}
