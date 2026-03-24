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
 * Output: "XX-XXXXXXX"
 */
export function maskTaxId(taxId: string | null | undefined): string {
  if (!taxId || !DEMO_MODE) return taxId || '';
  return 'XX-XXXXXXX';
}

/**
 * Mask an email address
 * Input: "doctor@hospital.com"
 * Output: "xxx@xxxxx.com"
 */
export function maskEmail(email: string | null | undefined): string {
  if (!email || !DEMO_MODE) return email || '';
  return 'xxx@xxxxx.com';
}

/**
 * Mask a phone number
 * Input: "(480) 555-1234" or "4805551234"
 * Output: "(XXX) XXX-XXXX"
 */
export function maskPhone(phone: string | null | undefined): string {
  if (!phone || !DEMO_MODE) return phone || '';
  if (phone.trim() === '') return '';
  return '(XXX) XXX-XXXX';
}

/**
 * Mask a fax number (same as phone)
 */
export function maskFax(fax: string | null | undefined): string {
  return maskPhone(fax);
}

/**
 * Mask sensitive fields in a provider object
 */
export function maskProviderPII<T extends Record<string, any>>(provider: T): T {
  if (!DEMO_MODE) return provider;
  
  return {
    ...provider,
    ...(provider.email && { email: maskEmail(provider.email) }),
    ...(provider.phone && { phone: maskPhone(provider.phone) }),
    ...(provider.fax && { fax: maskFax(provider.fax) }),
    // Mask nested locations if present
    ...(provider.locations && {
      locations: provider.locations.map((loc: any) => ({
        ...loc,
        email: maskEmail(loc.email),
        phone: maskPhone(loc.phone),
        fax: maskFax(loc.fax),
      })),
    }),
  };
}

/**
 * Mask sensitive fields in a practice object
 */
export function maskPracticePII<T extends Record<string, any>>(practice: T): T {
  if (!DEMO_MODE) return practice;
  
  return {
    ...practice,
    ...(practice.taxId && { taxId: maskTaxId(practice.taxId) }),
    ...(practice.phone && { phone: maskPhone(practice.phone) }),
    ...(practice.fax && { fax: maskFax(practice.fax) }),
    ...(practice.email && { email: maskEmail(practice.email) }),
  };
}

/**
 * Check if demo mode is active
 */
export function isDemoMode(): boolean {
  return DEMO_MODE;
}
