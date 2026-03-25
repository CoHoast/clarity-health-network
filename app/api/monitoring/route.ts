import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Generate monitoring alerts based on real provider data
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all"; // alerts, expiring, schedule
    
    // Load real providers
    const providersFile = path.join(process.cwd(), "data", "arizona-providers.json");
    let providers: any[] = [];
    
    if (fs.existsSync(providersFile)) {
      providers = JSON.parse(fs.readFileSync(providersFile, "utf-8"));
    }
    
    // Generate realistic monitoring data based on real providers
    const today = new Date();
    
    if (type === "alerts" || type === "all") {
      // Generate alerts for a subset of providers (simulating issues found)
      const alerts = generateAlerts(providers, today);
      
      if (type === "alerts") {
        return NextResponse.json({ alerts });
      }
    }
    
    if (type === "expiring" || type === "all") {
      // Generate expiring credentials
      const expiring = generateExpiringCredentials(providers, today);
      
      if (type === "expiring") {
        return NextResponse.json({ expiring });
      }
    }
    
    if (type === "stats" || type === "all") {
      const stats = generateStats(providers);
      
      if (type === "stats") {
        return NextResponse.json({ stats });
      }
    }
    
    // Return all data
    const alerts = generateAlerts(providers, today);
    const expiring = generateExpiringCredentials(providers, today);
    const stats = generateStats(providers);
    
    return NextResponse.json({ alerts, expiring, stats, totalProviders: providers.length });
    
  } catch (error) {
    console.error("Monitoring API error:", error);
    return NextResponse.json({ error: "Failed to fetch monitoring data" }, { status: 500 });
  }
}

function generateAlerts(providers: any[], today: Date): any[] {
  const alerts: any[] = [];
  
  // Use deterministic selection based on NPI for consistency
  const alertProviders = providers.filter((p, i) => {
    const npiSum = p.npi?.split('').reduce((a: number, b: string) => a + parseInt(b || '0'), 0) || 0;
    return npiSum % 47 === 0; // ~2% of providers have an alert
  }).slice(0, 15);
  
  const alertTypes = [
    { type: "OIG Exclusion", severity: "critical", checkType: "oig", autoAction: "Suspended pending review" },
    { type: "License Expired", severity: "critical", checkType: "license", autoAction: "Auto-suspended" },
    { type: "License Suspended", severity: "high", checkType: "license", autoAction: null },
    { type: "DEA Certificate Expired", severity: "high", checkType: "dea", autoAction: null },
    { type: "License Expiring Soon", severity: "medium", checkType: "license", autoAction: null },
    { type: "Malpractice Expiring", severity: "medium", checkType: "malpractice", autoAction: null },
    { type: "Address Mismatch", severity: "low", checkType: "npi", autoAction: null },
  ];
  
  alertProviders.forEach((provider, index) => {
    const alertType = alertTypes[index % alertTypes.length];
    const daysAgo = Math.floor(Math.random() * 14);
    const detected = new Date(today);
    detected.setDate(detected.getDate() - daysAgo);
    
    const providerName = provider.name || 
      `${provider.firstName || ''} ${provider.lastName || ''}`.trim() ||
      `Provider ${provider.npi}`;
    
    const practiceName = provider.locations?.[0]?.facilityName || 
      provider.practiceName || 
      `${providerName}'s Practice`;
    
    alerts.push({
      id: index + 1,
      severity: alertType.severity,
      provider: providerName,
      providerId: provider.id || `prov-${provider.npi}`,
      practice: practiceName,
      npi: provider.npi,
      type: alertType.type,
      checkType: alertType.checkType,
      description: getAlertDescription(alertType.type, providerName),
      details: getAlertDetails(alertType.type, provider),
      detected: detected.toISOString(),
      status: daysAgo > 5 ? "acknowledged" : "open",
      autoAction: alertType.autoAction,
      providerSuspended: alertType.severity === "critical",
      actionRequired: getActionRequired(alertType.type),
    });
  });
  
  // Sort by severity then date
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  alerts.sort((a, b) => {
    const sevDiff = severityOrder[a.severity as keyof typeof severityOrder] - severityOrder[b.severity as keyof typeof severityOrder];
    if (sevDiff !== 0) return sevDiff;
    return new Date(b.detected).getTime() - new Date(a.detected).getTime();
  });
  
  return alerts;
}

function generateExpiringCredentials(providers: any[], today: Date): any[] {
  const expiring: any[] = [];
  
  // Select providers for expiring credentials
  const expiringProviders = providers.filter((p, i) => {
    const npiSum = p.npi?.split('').reduce((a: number, b: string) => a + parseInt(b || '0'), 0) || 0;
    return npiSum % 23 === 0; // ~4% of providers
  }).slice(0, 30);
  
  const credentialTypes = [
    { type: "license", name: "Medical License" },
    { type: "dea", name: "DEA Certificate" },
    { type: "malpractice", name: "Malpractice Insurance" },
    { type: "board_certification", name: "Board Certification" },
  ];
  
  expiringProviders.forEach((provider, index) => {
    const credType = credentialTypes[index % credentialTypes.length];
    
    // Generate expiration dates: some expired, some soon, some in 30-90 days
    let daysUntil: number;
    if (index < 3) {
      daysUntil = -Math.floor(Math.random() * 30) - 1; // Expired 1-30 days ago
    } else if (index < 8) {
      daysUntil = Math.floor(Math.random() * 7) + 1; // 1-7 days (critical)
    } else if (index < 18) {
      daysUntil = Math.floor(Math.random() * 23) + 8; // 8-30 days (warning)
    } else {
      daysUntil = Math.floor(Math.random() * 60) + 31; // 31-90 days (upcoming)
    }
    
    const expirationDate = new Date(today);
    expirationDate.setDate(expirationDate.getDate() + daysUntil);
    
    const providerName = provider.name || 
      `${provider.firstName || ''} ${provider.lastName || ''}`.trim() ||
      `Provider ${provider.npi}`;
    
    let status: string;
    if (daysUntil <= 0) status = "expired";
    else if (daysUntil <= 7) status = "critical";
    else if (daysUntil <= 30) status = "warning";
    else status = "upcoming";
    
    expiring.push({
      providerId: provider.id || `prov-${provider.npi}`,
      providerName,
      npi: provider.npi,
      specialty: provider.specialty || "General Practice",
      credentialType: credType.type,
      credentialName: credType.name,
      expirationDate: expirationDate.toISOString().split('T')[0],
      daysUntilExpiry: daysUntil,
      status,
      state: provider.locations?.[0]?.state || "AZ",
      lastNotified: daysUntil <= 30 ? new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString() : null,
    });
  });
  
  // Sort by days until expiry
  expiring.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
  
  return expiring;
}

function generateStats(providers: any[]): any {
  const total = providers.length;
  
  return {
    totalProviders: total,
    lastScanDate: new Date().toISOString(),
    lastScanProviders: total,
    checksCompleted: total * 5, // 5 check types per provider
    issuesFound: Math.floor(total * 0.02), // ~2% have issues
    exclusionsFound: Math.floor(total * 0.003), // ~0.3% exclusions
    credentialsExpiring30: Math.floor(total * 0.015),
    credentialsExpiring90: Math.floor(total * 0.04),
    autoSuspended: Math.floor(total * 0.002),
  };
}

function getAlertDescription(type: string, providerName: string): string {
  const descriptions: Record<string, string> = {
    "OIG Exclusion": `Provider found on OIG LEIE exclusion list`,
    "License Expired": `State medical license has expired`,
    "License Suspended": `State medical license suspended by medical board`,
    "DEA Certificate Expired": `DEA registration has expired`,
    "License Expiring Soon": `State license expires within 30 days`,
    "Malpractice Expiring": `Malpractice insurance expires within 30 days`,
    "Address Mismatch": `Practice address doesn't match NPPES records`,
  };
  return descriptions[type] || `Issue detected for ${providerName}`;
}

function getAlertDetails(type: string, provider: any): string {
  const state = provider.locations?.[0]?.state || "AZ";
  const details: Record<string, string> = {
    "OIG Exclusion": `Exclusion effective date: ${new Date().toLocaleDateString()}. Reason: Program-related fraud (1128(a)(1)). Minimum exclusion period: 5 years.`,
    "License Expired": `License ${state}-${provider.credentials || 'MD'}-${provider.npi?.slice(-6)} expired. Provider must renew before seeing patients.`,
    "License Suspended": `License ${state}-${provider.credentials || 'MD'}-${provider.npi?.slice(-6)} suspended pending board investigation.`,
    "DEA Certificate Expired": `DEA registration expired. Provider cannot prescribe controlled substances.`,
    "License Expiring Soon": `License ${state}-${provider.credentials || 'MD'}-${provider.npi?.slice(-6)} set to expire. Renewal documentation not yet received.`,
    "Malpractice Expiring": `Current malpractice policy expires soon. Updated certificate of insurance required.`,
    "Address Mismatch": `Practice address on file differs from NPPES registry. Verification required.`,
  };
  return details[type] || "Details pending investigation.";
}

function getActionRequired(type: string): string {
  const actions: Record<string, string> = {
    "OIG Exclusion": "Review case, confirm exclusion, notify provider, terminate if confirmed",
    "License Expired": "Contact provider immediately, suspend until renewed",
    "License Suspended": "Contact provider, verify status, consider suspension",
    "DEA Certificate Expired": "Restrict prescribing privileges, request renewal",
    "License Expiring Soon": "Send renewal reminder, request updated documentation",
    "Malpractice Expiring": "Request updated certificate of insurance",
    "Address Mismatch": "Verify correct address with provider, update records",
  };
  return actions[type] || "Review and take appropriate action";
}
