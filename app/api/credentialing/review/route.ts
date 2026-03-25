import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Generate review queue from real provider data
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    
    // Load real providers
    const providersFile = path.join(process.cwd(), "data", "arizona-providers.json");
    let providers: any[] = [];
    
    if (fs.existsSync(providersFile)) {
      providers = JSON.parse(fs.readFileSync(providersFile, "utf-8"));
    }
    
    const today = new Date();
    
    // Select providers for review queue (deterministic based on NPI)
    const reviewProviders = providers.filter((p, i) => {
      const npiSum = p.npi?.split('').reduce((a: number, b: string) => a + parseInt(b || '0'), 0) || 0;
      return npiSum % 67 === 0; // ~1.5% of providers ready for review
    }).slice(0, limit);
    
    const applications = reviewProviders.map((provider, index) => {
      const daysAgo = Math.floor(index * 3) + 5;
      const submitted = new Date(today);
      submitted.setDate(submitted.getDate() - daysAgo);
      
      const providerName = provider.name || 
        `${provider.firstName || ''} ${provider.lastName || ''}`.trim() ||
        `Provider ${provider.npi}`;
      
      const credentials = provider.credentials || "MD";
      const fullName = providerName.includes(",") ? providerName : 
        (providerName.startsWith("Dr.") ? providerName : `${providerName}, ${credentials}`);
      
      const location = provider.locations?.[0] || {};
      
      // Generate verification statuses
      const hasOigIssue = index === 2; // One provider with OIG issue
      const hasLicenseWarning = index === 3; // One with license expiring soon
      
      const flags: string[] = [];
      let recommendation = "approve";
      
      if (hasOigIssue) {
        flags.push("OIG Exclusion Found - Immediate Review Required");
        recommendation = "deny";
      } else if (hasLicenseWarning) {
        flags.push("License expires in 45 days");
        recommendation = "approve_conditions";
      }
      
      const verifications: Record<string, any> = {
        nppes: { status: "passed", verifiedAt: submitted.toISOString().split('T')[0] },
        oig: hasOigIssue 
          ? { status: "failed", verifiedAt: submitted.toISOString().split('T')[0], reason: "Exclusion found - Program Violation" }
          : { status: "passed", verifiedAt: submitted.toISOString().split('T')[0] },
        sam: { status: "passed", verifiedAt: submitted.toISOString().split('T')[0] },
        license: hasLicenseWarning
          ? { status: "warning", verifiedAt: submitted.toISOString().split('T')[0], expires: getExpiringDate(45), reason: "Expires in 45 days" }
          : { status: "passed", verifiedAt: submitted.toISOString().split('T')[0], expires: getExpiringDate(365) },
      };
      
      // Add DEA for prescribers
      if (["MD", "DO", "NP", "PA"].includes(credentials)) {
        verifications.dea = { status: "passed", verifiedAt: submitted.toISOString().split('T')[0], expires: getExpiringDate(300) };
      }
      
      // Add board cert for physicians
      if (["MD", "DO"].includes(credentials)) {
        verifications.boardCert = { status: "passed", verifiedAt: submitted.toISOString().split('T')[0] };
      }
      
      verifications.malpractice = { status: "passed", verifiedAt: submitted.toISOString().split('T')[0], coverage: "$1M/$3M" };
      
      return {
        id: `CRED-2026-${(2000 + index).toString()}`,
        provider: fullName,
        practice: location.facilityName || provider.practiceName || fullName,
        npi: provider.npi,
        specialty: provider.specialty || "General Practice",
        type: index % 5 === 0 ? "recredential" : "initial",
        submitted: submitted.toISOString().split('T')[0],
        email: `${(provider.firstName || 'provider').toLowerCase()}@practice.com`,
        phone: location.phone || "(480) 555-0100",
        address: location.address1 ? 
          `${location.address1}${location.address2 ? ', ' + location.address2 : ''}, ${location.city || 'Phoenix'}, ${location.state || 'AZ'} ${location.zip || '85001'}` :
          "123 Medical Dr, Phoenix, AZ 85001",
        verifications,
        documents: getDocumentList(credentials),
        flags,
        recommendation,
        status: "pending",
        decisionHistory: [],
      };
    });
    
    return NextResponse.json({ 
      applications,
      stats: {
        total: applications.length,
        pendingReview: applications.filter(a => a.status === "pending").length,
        flagged: applications.filter(a => a.flags.length > 0).length,
      }
    });
    
  } catch (error) {
    console.error("Review API error:", error);
    return NextResponse.json({ error: "Failed to fetch review queue" }, { status: 500 });
  }
}

function getExpiringDate(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}

function getDocumentList(credentials: string): string[] {
  const baseDocs = ["license", "malpractice_coi", "w9"];
  
  if (["MD", "DO"].includes(credentials)) {
    return ["license", "dea", "board_cert", "malpractice_coi", "cv", "w9"];
  } else if (["NP", "PA"].includes(credentials)) {
    return ["license", "dea", "malpractice_coi", "cv", "w9"];
  } else if (credentials === "FAC") {
    return ["license", "accreditation", "malpractice_coi", "w9"];
  }
  
  return baseDocs;
}
