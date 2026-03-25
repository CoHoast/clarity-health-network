/**
 * Demo Mode Configuration
 * 
 * When DEMO_MODE is true, sensitive PII fields are masked.
 * Set to false for production with proper authentication.
 */

export const DEMO_MODE = true;

/**
 * Mask a Tax ID (EIN or SSN)
 */
export function maskTaxId(taxId: string | null | undefined): string {
  if (!taxId || !DEMO_MODE) return taxId || '';
  const clean = taxId.replace(/\D/g, '');
  if (clean.length >= 4) {
    return `XX-XXX${clean.slice(-4)}`;
  }
  return 'XX-XXXXXXX';
}

/**
 * Mask an email address
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
 */
export function maskAddress(address: string | null | undefined): string {
  if (!address || !DEMO_MODE) return address || '';
  if (address.trim() === '') return '';
  return address.replace(/^\d+/, 'XXX');
}

/**
 * Mask sensitive fields in a provider object
 */
export function maskProviderPII(provider: Record<string, any>): Record<string, any> {
  if (!DEMO_MODE) return provider;
  
  const masked = { ...provider };
  
  // Top-level fields
  if (masked.email) masked.email = maskEmail(masked.email);
  if (masked.phone) masked.phone = maskPhone(masked.phone);
  if (masked.fax) masked.fax = maskFax(masked.fax);
  
  // Mask nested locations
  if (masked.locations && Array.isArray(masked.locations)) {
    masked.locations = masked.locations.map((loc: Record<string, any>) => ({
      ...loc,
      email: loc.email ? maskEmail(loc.email) : loc.email,
      phone: loc.phone ? maskPhone(loc.phone) : loc.phone,
      fax: loc.fax ? maskFax(loc.fax) : loc.fax,
      address1: loc.address1 ? maskAddress(loc.address1) : loc.address1,
    }));
  }
  
  // Mask nested billing info
  if (masked.billing && typeof masked.billing === 'object') {
    masked.billing = {
      ...masked.billing,
      taxId: masked.billing.taxId ? maskTaxId(masked.billing.taxId) : masked.billing.taxId,
      phone: masked.billing.phone ? maskPhone(masked.billing.phone) : masked.billing.phone,
      fax: masked.billing.fax ? maskFax(masked.billing.fax) : masked.billing.fax,
      address1: masked.billing.address1 ? maskAddress(masked.billing.address1) : masked.billing.address1,
    };
  }
  
  // Mask nested corresponding address
  if (masked.correspondingAddress && typeof masked.correspondingAddress === 'object') {
    masked.correspondingAddress = {
      ...masked.correspondingAddress,
      fax: masked.correspondingAddress.fax ? maskFax(masked.correspondingAddress.fax) : masked.correspondingAddress.fax,
      address1: masked.correspondingAddress.address1 ? maskAddress(masked.correspondingAddress.address1) : masked.correspondingAddress.address1,
    };
  }
  
  return masked;
}

/**
 * Mask sensitive fields in a practice object
 */
export function maskPracticePII(practice: Record<string, any>): Record<string, any> {
  if (!DEMO_MODE) return practice;
  
  return {
    ...practice,
    taxId: practice.taxId ? maskTaxId(practice.taxId) : practice.taxId,
    phone: practice.phone ? maskPhone(practice.phone) : practice.phone,
    fax: practice.fax ? maskFax(practice.fax) : practice.fax,
    email: practice.email ? maskEmail(practice.email) : practice.email,
    address1: practice.address1 ? maskAddress(practice.address1) : practice.address1,
  };
}

/**
 * Check if demo mode is active
 */
export function isDemoMode(): boolean {
  return DEMO_MODE;
}
