/**
 * Demo Mode Configuration
 * 
 * When DEMO_MODE is true, sensitive PII fields are masked.
 * Set to false for production with proper authentication.
 */

export const DEMO_MODE = true;

/**
 * Mask a Tax ID (EIN or SSN)
 * Input: "260904640" or "26-0904640"
 * Output: "XX-XXX1234" (shows last 4)
 */
export function maskTaxId(taxId: string | null | undefined): string {
  if (!taxId || !DEMO_MODE) return taxId || '';
  // Show last 4 digits for reference
  const clean = taxId.replace(/\D/g, '');
  if (clean.length >= 4) {
    return `XX-XXX${clean.slice(-4)}`;
  }
  return 'XX-XXXXXXX';
}

/**
 * Mask an email address
 * Input: "doctor@hospital.com"
 * Output: "d***@*****.com"
 */
export function maskEmail(email: string | null | undefined): string {
  if (!email || !DEMO_MODE) return email || '';
  if (email.trim() === '') return '';
  const [local, domain] = email.split('@');
  if (!domain) return 'xxx@xxxxx.com';
  const domainParts = domain.split('.');
  const ext = domainParts.pop() || 'com';
  return `${local[0]}***@*****.${ext}`;
}

/**
 * Mask a phone number
 * Input: "(480) 555-1234" or "4805551234"
 * Output: "(XXX) XXX-1234" (shows last 4)
 */
export function maskPhone(phone: string | null | undefined): string {
  if (!phone || !DEMO_MODE) return phone || '';
  if (phone.trim() === '') return '';
  const clean = phone.replace(/\D/g, '');
  if (clean.length >= 4) {
    return `(XXX) XXX-${clean.slice(-4)}`;
  }
  return '(XXX) XXX-XXXX';
}

/**
 * Mask a fax number (same as phone)
 */
export function maskFax(fax: string | null | undefined): string {
  return maskPhone(fax);
}

/**
 * Mask an address
 * Input: "123 Main Street"
 * Output: "XXX Main Street" (hides street number)
 */
export function maskAddress(address: string | null | undefined): string {
  if (!address || !DEMO_MODE) return address || '';
  if (address.trim() === '') return '';
  // Replace leading numbers with XXX
  return address.replace(/^\d+/, 'XXX');
}

/**
 * Mask sensitive fields in a provider object
 * Handles all nested objects that may contain PII
 */
export function maskProviderPII<T extends Record<string, any>>(provider: T): T {
  if (!DEMO_MODE) return provider;
  
  const masked = { ...provider };
  
  // Top-level fields
  if (masked.email) masked.email = maskEmail(masked.email);
  if (masked.phone) masked.phone = maskPhone(masked.phone);
  if (masked.fax) masked.fax = maskFax(masked.fax);
  
  // Mask nested locations
  if (masked.locations && Array.isArray(masked.locations)) {
    masked.locations = masked.locations.map((loc: any) => ({
      ...loc,
      email: maskEmail(loc.email),
      phone: maskPhone(loc.phone),
      fax: maskFax(loc.fax),
      address1: maskAddress(loc.address1),
    }));
  }
  
  // Mask nested billing info
  if (masked.billing && typeof masked.billing === 'object') {
    masked.billing = {
      ...masked.billing,
      taxId: maskTaxId(masked.billing.taxId),
      phone: maskPhone(masked.billing.phone),
      fax: maskFax(masked.billing.fax),
      address1: maskAddress(masked.billing.address1),
    };
  }
  
  // Mask nested corresponding address
  if (masked.correspondingAddress && typeof masked.correspondingAddress === 'object') {
    masked.correspondingAddress = {
      ...masked.correspondingAddress,
      fax: maskFax(masked.correspondingAddress.fax),
      address1: maskAddress(masked.correspondingAddress.address1),
    };
  }
  
  return masked as T;
}

/**
 * Mask sensitive fields in a practice object
 */
export function maskPracticePII<T extends Record<string, any>>(practice: T): T {
  if (!DEMO_MODE) return practice;
  
  return {
    ...practice,
    taxId: maskTaxId(practice.taxId),
    phone: maskPhone(practice.phone),
    fax: maskFax(practice.fax),
    email: maskEmail(practice.email),
    address1: maskAddress(practice.address1),
  };
}

/**
 * Check if demo mode is active
 */
export function isDemoMode(): boolean {
  return DEMO_MODE;
}
