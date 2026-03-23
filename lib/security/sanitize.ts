// Input Sanitization Utilities
// Prevents XSS, SQL injection, and other injection attacks

// HTML entities to escape
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

// Escape HTML special characters
export function escapeHtml(str: string): string {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>"'`=/]/g, (char) => HTML_ENTITIES[char] || char);
}

// Remove potentially dangerous patterns
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  
  let sanitized = input
    // Remove null bytes
    .replace(/\0/g, '')
    // Remove script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove on* event handlers
    .replace(/\bon\w+\s*=/gi, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove data: protocol (can be used for XSS)
    .replace(/data:/gi, '')
    // Trim whitespace
    .trim();
  
  return sanitized;
}

// Sanitize object recursively
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => {
      if (typeof item === 'string') return sanitizeString(item);
      if (typeof item === 'object') return sanitizeObject(item as Record<string, unknown>);
      return item;
    }) as unknown as T;
  }
  
  if (typeof obj === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      // Sanitize keys too
      const sanitizedKey = sanitizeString(key);
      
      if (typeof value === 'string') {
        sanitized[sanitizedKey] = sanitizeString(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[sanitizedKey] = sanitizeObject(value as Record<string, unknown>);
      } else {
        sanitized[sanitizedKey] = value;
      }
    }
    return sanitized as T;
  }
  
  return obj;
}

// Validate and sanitize email
export function sanitizeEmail(email: string): string | null {
  if (typeof email !== 'string') return null;
  
  const sanitized = email.toLowerCase().trim();
  
  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) {
    return null;
  }
  
  return sanitized;
}

// Validate and sanitize phone number
export function sanitizePhone(phone: string): string | null {
  if (typeof phone !== 'string') return null;
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Must be 10 or 11 digits (with country code)
  if (digits.length < 10 || digits.length > 11) {
    return null;
  }
  
  return digits;
}

// Validate and sanitize NPI (10 digits)
export function sanitizeNpi(npi: string): string | null {
  if (typeof npi !== 'string') return null;
  
  const digits = npi.replace(/\D/g, '');
  
  if (digits.length !== 10) {
    return null;
  }
  
  return digits;
}

// Validate and sanitize SSN
export function sanitizeSsn(ssn: string): string | null {
  if (typeof ssn !== 'string') return null;
  
  const digits = ssn.replace(/\D/g, '');
  
  if (digits.length !== 9) {
    return null;
  }
  
  return digits;
}

// Validate and sanitize date
export function sanitizeDate(date: string): string | null {
  if (typeof date !== 'string') return null;
  
  // Try to parse as ISO date
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) {
    return null;
  }
  
  return parsed.toISOString().split('T')[0];
}

// Sanitize SQL-like input (for search queries)
export function sanitizeSearchQuery(query: string): string {
  if (typeof query !== 'string') return '';
  
  return query
    // Remove SQL injection patterns
    .replace(/['";\\]/g, '')
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '')
    .replace(/\bOR\b/gi, '')
    .replace(/\bAND\b/gi, '')
    .replace(/\bUNION\b/gi, '')
    .replace(/\bSELECT\b/gi, '')
    .replace(/\bDROP\b/gi, '')
    .replace(/\bDELETE\b/gi, '')
    .replace(/\bINSERT\b/gi, '')
    .replace(/\bUPDATE\b/gi, '')
    .trim()
    .slice(0, 200); // Limit length
}

// Middleware to sanitize request body
export async function sanitizeRequestBody(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const contentType = request.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      const body = await request.json();
      return sanitizeObject(body);
    }
    
    if (contentType?.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      const obj: Record<string, unknown> = {};
      for (const [key, value] of formData.entries()) {
        if (typeof value === 'string') {
          obj[sanitizeString(key)] = sanitizeString(value);
        }
      }
      return obj;
    }
    
    return null;
  } catch {
    return null;
  }
}
