/**
 * Multi-Factor Authentication (MFA)
 * 
 * TOTP-based 2FA (compatible with Google Authenticator, Authy, etc.)
 * HIPAA requires MFA for accessing PHI
 */

import crypto from 'crypto';

// TOTP settings
const TOTP_DIGITS = 6;
const TOTP_PERIOD = 30; // seconds
const TOTP_ALGORITHM = 'sha1';

// Generate a secret key for TOTP
export function generateMfaSecret(): string {
  // 20 bytes = 160 bits, base32 encoded
  const buffer = crypto.randomBytes(20);
  return base32Encode(buffer);
}

// Base32 encoding (RFC 4648)
function base32Encode(buffer: Buffer): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = 0;
  let value = 0;
  let output = '';

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;

    while (bits >= 5) {
      output += alphabet[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += alphabet[(value << (5 - bits)) & 31];
  }

  return output;
}

// Base32 decoding
function base32Decode(encoded: string): Buffer {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const cleanInput = encoded.replace(/=+$/, '').toUpperCase();
  
  let bits = 0;
  let value = 0;
  const output: number[] = [];

  for (let i = 0; i < cleanInput.length; i++) {
    const idx = alphabet.indexOf(cleanInput[i]);
    if (idx === -1) continue;
    
    value = (value << 5) | idx;
    bits += 5;

    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(output);
}

// Generate TOTP code
export function generateTotp(secret: string, timestamp?: number): string {
  const time = timestamp || Date.now();
  const counter = Math.floor(time / 1000 / TOTP_PERIOD);
  
  // Convert counter to 8-byte buffer (big-endian)
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigInt64BE(BigInt(counter));
  
  // HMAC-SHA1
  const secretBuffer = base32Decode(secret);
  const hmac = crypto.createHmac(TOTP_ALGORITHM, secretBuffer);
  hmac.update(counterBuffer);
  const hash = hmac.digest();
  
  // Dynamic truncation
  const offset = hash[hash.length - 1] & 0xf;
  const code = (
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff)
  ) % Math.pow(10, TOTP_DIGITS);
  
  return code.toString().padStart(TOTP_DIGITS, '0');
}

// Verify TOTP code (allows 1 period drift for clock skew)
export function verifyTotp(secret: string, code: string, drift: number = 1): boolean {
  const now = Date.now();
  
  // Check current and adjacent time windows
  for (let i = -drift; i <= drift; i++) {
    const timestamp = now + (i * TOTP_PERIOD * 1000);
    const expected = generateTotp(secret, timestamp);
    
    // Constant-time comparison
    if (code.length === expected.length) {
      let match = true;
      for (let j = 0; j < code.length; j++) {
        if (code[j] !== expected[j]) match = false;
      }
      if (match) return true;
    }
  }
  
  return false;
}

// Generate QR code URL for authenticator apps
export function getMfaQrUrl(secret: string, email: string, issuer: string = 'TrueCare PPO'): string {
  const encodedIssuer = encodeURIComponent(issuer);
  const encodedEmail = encodeURIComponent(email);
  return `otpauth://totp/${encodedIssuer}:${encodedEmail}?secret=${secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
}

// Generate backup codes (one-time use)
export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    // 8 character codes, alphanumeric
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    codes.push(`${code.slice(0, 4)}-${code.slice(4)}`);
  }
  return codes;
}

// Verify backup code (returns true if valid, code should be removed after use)
export function verifyBackupCode(code: string, validCodes: string[]): boolean {
  const normalizedCode = code.toUpperCase().replace(/[^A-Z0-9]/g, '');
  return validCodes.some(valid => {
    const normalizedValid = valid.toUpperCase().replace(/[^A-Z0-9]/g, '');
    return normalizedCode === normalizedValid;
  });
}

// MFA status check
export interface MfaStatus {
  enabled: boolean;
  method: 'totp' | 'backup' | null;
  backupCodesRemaining: number;
}
