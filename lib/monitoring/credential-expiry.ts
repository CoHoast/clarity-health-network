/**
 * Credential Expiry Monitoring
 * 
 * Monitors provider credentials for upcoming expirations.
 * Provides alerts and notifications for compliance.
 */

import fs from 'fs';
import path from 'path';

export interface ExpiringCredential {
  providerId: string;
  providerName: string;
  npi: string;
  credentialType: 'license' | 'dea' | 'malpractice' | 'board_certification' | 'cpr' | 'other';
  credentialName: string;
  expirationDate: string;
  daysUntilExpiry: number;
  status: 'expired' | 'critical' | 'warning' | 'upcoming' | 'ok';
  lastNotified?: string;
}

export interface ExpiryAlert {
  id: string;
  createdAt: string;
  providerId: string;
  providerName: string;
  credentialType: string;
  expirationDate: string;
  daysUntilExpiry: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

const ALERTS_FILE = path.join(process.cwd(), 'data', 'expiry-alerts.json');

// Thresholds for different warning levels
export const EXPIRY_THRESHOLDS = {
  critical: 7,    // 7 days or less
  warning: 30,    // 30 days or less  
  upcoming: 90,   // 90 days or less
};

/**
 * Calculate days until expiration
 */
export function getDaysUntilExpiry(expirationDate: string): number {
  const expiry = new Date(expirationDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);
  
  const diffMs = expiry.getTime() - today.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Get expiry status based on days remaining
 */
export function getExpiryStatus(daysUntilExpiry: number): ExpiringCredential['status'] {
  if (daysUntilExpiry <= 0) return 'expired';
  if (daysUntilExpiry <= EXPIRY_THRESHOLDS.critical) return 'critical';
  if (daysUntilExpiry <= EXPIRY_THRESHOLDS.warning) return 'warning';
  if (daysUntilExpiry <= EXPIRY_THRESHOLDS.upcoming) return 'upcoming';
  return 'ok';
}

/**
 * Check all providers for expiring credentials
 */
export function checkExpiringCredentials(): ExpiringCredential[] {
  const expiring: ExpiringCredential[] = [];
  
  try {
    const providersFile = path.join(process.cwd(), 'data', 'arizona-providers.json');
    const providers = JSON.parse(fs.readFileSync(providersFile, 'utf-8'));
    
    const today = new Date();
    const checkDate = new Date(today.getTime() + (EXPIRY_THRESHOLDS.upcoming * 24 * 60 * 60 * 1000));
    
    for (const provider of providers) {
      // Check various credential types
      const credentials = [
        { type: 'license', date: provider.licenseExpiration, name: 'Medical License' },
        { type: 'dea', date: provider.deaExpiration, name: 'DEA Certificate' },
        { type: 'malpractice', date: provider.malpracticeExpiration, name: 'Malpractice Insurance' },
        { type: 'board_certification', date: provider.boardCertExpiration, name: 'Board Certification' },
        { type: 'cpr', date: provider.cprExpiration, name: 'CPR/BLS Certification' },
      ];
      
      for (const cred of credentials) {
        if (cred.date) {
          const daysUntilExpiry = getDaysUntilExpiry(cred.date);
          const status = getExpiryStatus(daysUntilExpiry);
          
          // Only include if expiring soon or already expired
          if (status !== 'ok') {
            expiring.push({
              providerId: provider.id || `prov-${provider.npi}`,
              providerName: provider.name || `${provider.firstName} ${provider.lastName}`.trim(),
              npi: provider.npi,
              credentialType: cred.type as ExpiringCredential['credentialType'],
              credentialName: cred.name,
              expirationDate: cred.date,
              daysUntilExpiry,
              status,
            });
          }
        }
      }
    }
    
    // Sort by days until expiry (most urgent first)
    expiring.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
    
  } catch (error) {
    console.error('Error checking credentials:', error);
  }
  
  return expiring;
}

/**
 * Get summary statistics for dashboard
 */
export function getExpirySummary(): {
  expired: number;
  critical: number;
  warning: number;
  upcoming: number;
  total: number;
} {
  const expiring = checkExpiringCredentials();
  
  return {
    expired: expiring.filter(c => c.status === 'expired').length,
    critical: expiring.filter(c => c.status === 'critical').length,
    warning: expiring.filter(c => c.status === 'warning').length,
    upcoming: expiring.filter(c => c.status === 'upcoming').length,
    total: expiring.length,
  };
}

/**
 * Load expiry alerts
 */
export function loadExpiryAlerts(): ExpiryAlert[] {
  try {
    if (fs.existsSync(ALERTS_FILE)) {
      return JSON.parse(fs.readFileSync(ALERTS_FILE, 'utf-8'));
    }
  } catch (error) {
    console.error('Error loading expiry alerts:', error);
  }
  return [];
}

/**
 * Save expiry alerts
 */
function saveExpiryAlerts(alerts: ExpiryAlert[]): void {
  try {
    const dir = path.dirname(ALERTS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(ALERTS_FILE, JSON.stringify(alerts, null, 2));
  } catch (error) {
    console.error('Error saving expiry alerts:', error);
  }
}

/**
 * Create alert for expiring credential
 */
export function createExpiryAlert(credential: ExpiringCredential): ExpiryAlert {
  const alerts = loadExpiryAlerts();
  
  // Check if alert already exists
  const existing = alerts.find(a => 
    a.providerId === credential.providerId && 
    a.credentialType === credential.credentialType &&
    !a.acknowledged
  );
  
  if (existing) {
    return existing;
  }
  
  const severity = credential.status === 'expired' || credential.status === 'critical' 
    ? 'critical' 
    : credential.status === 'warning' 
      ? 'high' 
      : 'medium';
  
  const alert: ExpiryAlert = {
    id: `EXP-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    providerId: credential.providerId,
    providerName: credential.providerName,
    credentialType: credential.credentialName,
    expirationDate: credential.expirationDate,
    daysUntilExpiry: credential.daysUntilExpiry,
    severity,
    acknowledged: false,
  };
  
  alerts.unshift(alert);
  saveExpiryAlerts(alerts);
  
  return alert;
}

/**
 * Acknowledge an alert
 */
export function acknowledgeAlert(alertId: string, acknowledgedBy: string): boolean {
  const alerts = loadExpiryAlerts();
  const index = alerts.findIndex(a => a.id === alertId);
  
  if (index === -1) return false;
  
  alerts[index].acknowledged = true;
  alerts[index].acknowledgedBy = acknowledgedBy;
  alerts[index].acknowledgedAt = new Date().toISOString();
  
  saveExpiryAlerts(alerts);
  return true;
}

/**
 * Get unacknowledged alerts
 */
export function getUnacknowledgedAlerts(): ExpiryAlert[] {
  const alerts = loadExpiryAlerts();
  return alerts.filter(a => !a.acknowledged);
}

/**
 * Run daily credential check (call from cron job)
 */
export function runDailyCredentialCheck(): {
  checked: number;
  alertsCreated: number;
  expired: number;
  critical: number;
} {
  const expiring = checkExpiringCredentials();
  let alertsCreated = 0;
  
  // Create alerts for critical and expired
  for (const cred of expiring) {
    if (cred.status === 'expired' || cred.status === 'critical' || cred.status === 'warning') {
      const existing = loadExpiryAlerts().find(a => 
        a.providerId === cred.providerId && 
        a.credentialType === cred.credentialName &&
        !a.acknowledged
      );
      
      if (!existing) {
        createExpiryAlert(cred);
        alertsCreated++;
      }
    }
  }
  
  return {
    checked: expiring.length,
    alertsCreated,
    expired: expiring.filter(c => c.status === 'expired').length,
    critical: expiring.filter(c => c.status === 'critical').length,
  };
}
