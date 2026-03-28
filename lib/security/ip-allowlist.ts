/**
 * IP Allowlisting for Admin Access
 * 
 * Optional security layer - restrict admin access to specific IPs
 * Useful for HIPAA compliance (limit access to known office IPs)
 */

// Get client IP from request
export function getClientIp(headers: Headers): string {
  // Check common proxy headers
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    // Take the first IP (client IP)
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  
  // Cloudflare
  const cfIp = headers.get('cf-connecting-ip');
  if (cfIp) {
    return cfIp.trim();
  }
  
  return 'unknown';
}

// Check if IP is in allowlist
export function isIpAllowed(ip: string, allowlist: string[]): boolean {
  if (!allowlist || allowlist.length === 0) {
    // No allowlist = allow all
    return true;
  }
  
  // Check exact match first
  if (allowlist.includes(ip)) {
    return true;
  }
  
  // Check CIDR ranges
  for (const entry of allowlist) {
    if (entry.includes('/')) {
      if (isIpInCidr(ip, entry)) {
        return true;
      }
    }
  }
  
  return false;
}

// Check if IP is within CIDR range
function isIpInCidr(ip: string, cidr: string): boolean {
  try {
    const [range, bits] = cidr.split('/');
    const mask = parseInt(bits, 10);
    
    if (isNaN(mask) || mask < 0 || mask > 32) {
      return false;
    }
    
    const ipLong = ipToLong(ip);
    const rangeLong = ipToLong(range);
    const maskLong = (-1 << (32 - mask)) >>> 0;
    
    return (ipLong & maskLong) === (rangeLong & maskLong);
  } catch {
    return false;
  }
}

// Convert IP string to number
function ipToLong(ip: string): number {
  const parts = ip.split('.');
  if (parts.length !== 4) {
    return 0;
  }
  
  return parts.reduce((acc, part) => {
    const num = parseInt(part, 10);
    if (isNaN(num) || num < 0 || num > 255) {
      return acc;
    }
    return (acc << 8) + num;
  }, 0) >>> 0;
}

// Get allowlist from environment
export function getIpAllowlist(): string[] {
  const envList = process.env.ADMIN_IP_ALLOWLIST;
  if (!envList) {
    return [];
  }
  
  return envList
    .split(',')
    .map(ip => ip.trim())
    .filter(ip => ip.length > 0);
}

// Check admin access by IP
export function checkAdminIpAccess(headers: Headers): { allowed: boolean; ip: string; reason?: string } {
  const ip = getClientIp(headers);
  const allowlist = getIpAllowlist();
  
  // If no allowlist configured, allow all
  if (allowlist.length === 0) {
    return { allowed: true, ip };
  }
  
  const allowed = isIpAllowed(ip, allowlist);
  
  return {
    allowed,
    ip,
    reason: allowed ? undefined : `IP ${ip} not in admin allowlist`,
  };
}
