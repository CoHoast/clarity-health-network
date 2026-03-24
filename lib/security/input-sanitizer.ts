/**
 * Input Sanitization
 * 
 * Prevents XSS, injection attacks, and validates input formats.
 */

/**
 * Sanitize HTML to prevent XSS attacks
 * Removes all HTML tags and encodes special characters
 */
export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Strip all HTML tags from input
 */
export function stripHtml(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  return input.replace(/<[^>]*>/g, '').trim();
}

/**
 * Sanitize object recursively
 * Applies sanitization to all string values in an object
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sanitized: any = Array.isArray(obj) ? [] : {};
  
  for (const key in obj) {
    const value = obj[key];
    
    if (typeof value === 'string') {
      sanitized[key] = stripHtml(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Validate and sanitize NPI
 */
export function sanitizeNpi(npi: string): string | null {
  if (!npi || typeof npi !== 'string') return null;
  
  // Remove any non-digits
  const cleaned = npi.replace(/\D/g, '');
  
  // NPI must be exactly 10 digits
  if (cleaned.length !== 10) return null;
  
  // Luhn algorithm check (NPI checksum validation)
  if (!isValidNpiChecksum(cleaned)) return null;
  
  return cleaned;
}

/**
 * Validate NPI using Luhn algorithm
 */
function isValidNpiChecksum(npi: string): boolean {
  // Add prefix 80840 for Luhn check
  const prefixed = '80840' + npi;
  
  let sum = 0;
  let alternate = false;
  
  for (let i = prefixed.length - 1; i >= 0; i--) {
    let digit = parseInt(prefixed[i], 10);
    
    if (alternate) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    alternate = !alternate;
  }
  
  return sum % 10 === 0;
}

/**
 * Validate and sanitize Tax ID (EIN)
 */
export function sanitizeTaxId(taxId: string): string | null {
  if (!taxId || typeof taxId !== 'string') return null;
  
  // Remove any non-digits
  const cleaned = taxId.replace(/\D/g, '');
  
  // Tax ID must be exactly 9 digits
  if (cleaned.length !== 9) return null;
  
  // Format as XX-XXXXXXX
  return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
}

/**
 * Validate and sanitize email
 */
export function sanitizeEmail(email: string): string | null {
  if (!email || typeof email !== 'string') return null;
  
  const cleaned = email.toLowerCase().trim();
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleaned)) return null;
  
  return cleaned;
}

/**
 * Validate and sanitize phone number
 */
export function sanitizePhone(phone: string): string | null {
  if (!phone || typeof phone !== 'string') return null;
  
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Must be 10 or 11 digits (with or without country code)
  if (cleaned.length < 10 || cleaned.length > 11) return null;
  
  // Get last 10 digits
  const digits = cleaned.slice(-10);
  
  // Format as (XXX) XXX-XXXX
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

/**
 * Validate and sanitize ZIP code
 */
export function sanitizeZip(zip: string): string | null {
  if (!zip || typeof zip !== 'string') return null;
  
  // Remove all non-digits and hyphens
  const cleaned = zip.replace(/[^\d-]/g, '');
  
  // 5-digit or 9-digit (ZIP+4)
  if (/^\d{5}$/.test(cleaned)) return cleaned;
  if (/^\d{5}-\d{4}$/.test(cleaned)) return cleaned;
  if (/^\d{9}$/.test(cleaned)) return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
  
  return null;
}

/**
 * Sanitize filename to prevent path traversal
 */
export function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== 'string') return 'unnamed';
  
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace unsafe chars
    .replace(/\.+/g, '.') // Collapse multiple dots
    .replace(/^\.+|\.+$/g, '') // Remove leading/trailing dots
    .slice(0, 255); // Limit length
}

/**
 * Sanitize search query
 */
export function sanitizeSearchQuery(query: string): string {
  if (!query || typeof query !== 'string') return '';
  
  return query
    .replace(/[<>\"\'&;]/g, '') // Remove dangerous characters
    .trim()
    .slice(0, 100); // Limit length
}

/**
 * Validate provider data object
 */
export function validateProviderData(data: Record<string, any>): {
  valid: boolean;
  errors: string[];
  sanitized: Record<string, any>;
} {
  const errors: string[] = [];
  const sanitized: Record<string, any> = {};
  
  // Required: NPI
  if (data.npi) {
    const npi = sanitizeNpi(data.npi);
    if (!npi) {
      errors.push('Invalid NPI format');
    } else {
      sanitized.npi = npi;
    }
  } else {
    errors.push('NPI is required');
  }
  
  // Required: Name
  if (data.firstName) {
    sanitized.firstName = stripHtml(data.firstName).slice(0, 50);
  }
  if (data.lastName) {
    sanitized.lastName = stripHtml(data.lastName).slice(0, 50);
  }
  if (!sanitized.firstName && !sanitized.lastName && !data.name) {
    errors.push('Name is required');
  }
  if (data.name) {
    sanitized.name = stripHtml(data.name).slice(0, 100);
  }
  
  // Optional: Email
  if (data.email) {
    const email = sanitizeEmail(data.email);
    if (email) sanitized.email = email;
  }
  
  // Optional: Phone
  if (data.phone) {
    const phone = sanitizePhone(data.phone);
    if (phone) sanitized.phone = phone;
  }
  
  // Optional: Tax ID
  if (data.taxId) {
    const taxId = sanitizeTaxId(data.taxId);
    if (taxId) sanitized.taxId = taxId;
  }
  
  // Optional: ZIP
  if (data.zip) {
    const zip = sanitizeZip(data.zip);
    if (zip) sanitized.zip = zip;
  }
  
  // Copy other fields with basic sanitization
  const otherFields = ['specialty', 'credentials', 'address', 'city', 'state', 'gender'];
  for (const field of otherFields) {
    if (data[field]) {
      sanitized[field] = stripHtml(String(data[field])).slice(0, 200);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    sanitized,
  };
}
