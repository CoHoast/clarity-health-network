import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Generate credentialing applications based on real provider data
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // pending, verification, review, approved, denied
    const limit = parseInt(searchParams.get("limit") || "50");
    
    // Load real providers
    const providersFile = path.join(process.cwd(), "data", "arizona-providers.json");
    let providers: any[] = [];
    
    if (fs.existsSync(providersFile)) {
      providers = JSON.parse(fs.readFileSync(providersFile, "utf-8"));
    }
    
    const today = new Date();
    
    // Select providers for applications (deterministic based on NPI)
    const applicationProviders = providers.filter((p, i) => {
      const npiSum = p.npi?.split('').reduce((a: number, b: string) => a + parseInt(b || '0'), 0) || 0;
      return npiSum % 31 === 0; // ~3% of providers have applications in progress
    }).slice(0, limit);
    
    const statuses = ["pending", "verification", "review", "approved", "denied"];
    const stages = {
      pending: "Application Received",
      verification: "PSV In Progress",
      review: "Ready for Review",
      approved: "Complete",
      denied: "Denied",
    };
    
    const applications = applicationProviders.map((provider, index) => {
      // Deterministic status based on index
      let appStatus: string;
      if (index < 3) appStatus = "pending";
      else if (index < 8) appStatus = "verification";
      else if (index < 15) appStatus = "review";
      else if (index < applicationProviders.length - 2) appStatus = "approved";
      else appStatus = "denied";
      
      // Generate submission date (1-30 days ago)
      const daysAgo = Math.floor((index * 7) % 30) + 1;
      const submitted = new Date(today);
      submitted.setDate(submitted.getDate() - daysAgo);
      
      const providerName = provider.name || 
        `${provider.firstName || ''} ${provider.lastName || ''}`.trim() ||
        `Provider ${provider.npi}`;
      
      const credentials = provider.credentials || "MD";
      const fullName = providerName.includes(",") ? providerName : 
        (providerName.startsWith("Dr.") ? providerName : `${providerName}, ${credentials}`);
      
      // Generate documents
      const docStatuses = ["received", "received", "received", "pending", "received", "pending"];
      const documents = [
        { name: "Medical License", status: index < 5 ? "pending" : docStatuses[0], date: index < 5 ? null : submitted.toISOString().split('T')[0] },
        { name: "DEA Certificate", status: docStatuses[1], date: submitted.toISOString().split('T')[0] },
        { name: credentials === "NP" || credentials === "PA" ? "State License" : "Board Certification", status: docStatuses[2], date: submitted.toISOString().split('T')[0] },
        { name: "Malpractice Insurance COI", status: index < 8 ? "pending" : "received", date: index < 8 ? null : submitted.toISOString().split('T')[0] },
        { name: "CV/Resume", status: "received", date: submitted.toISOString().split('T')[0] },
        { name: "W-9 Form", status: index < 5 ? "pending" : "received", date: index < 5 ? null : submitted.toISOString().split('T')[0] },
      ];
      
      // Generate verifications
      const verifications = [
        { type: "NPI Validation", status: "passed", date: submitted.toISOString().split('T')[0] },
        { type: "OIG Exclusion", status: "passed", date: submitted.toISOString().split('T')[0] },
        { type: "SAM.gov", status: "passed", date: submitted.toISOString().split('T')[0] },
        { type: "License Verification", status: index < 10 ? "pending" : "passed", date: index < 10 ? null : submitted.toISOString().split('T')[0] },
      ];
      
      const location = provider.locations?.[0] || {};
      
      return {
        id: `CRED-2026-${(1000 + index).toString()}`,
        provider: fullName,
        npi: provider.npi,
        specialty: provider.specialty || "General Practice",
        status: appStatus,
        submitted: submitted.toISOString().split('T')[0],
        stage: stages[appStatus as keyof typeof stages],
        type: "initial",
        practice: location.facilityName || provider.practiceName || fullName,
        email: `${(provider.firstName || 'provider').toLowerCase()}@${(provider.lastName || 'practice').toLowerCase().replace(/\s/g, '')}.com`,
        phone: location.phone || "(480) 555-0100",
        address: location.address1 ? 
          `${location.address1}${location.address2 ? ', ' + location.address2 : ''}, ${location.city || 'Phoenix'}, ${location.state || 'AZ'} ${location.zip || '85001'}` :
          "123 Medical Dr, Phoenix, AZ 85001",
        licenseNumber: `${location.state || 'AZ'}-${credentials}-${provider.npi?.slice(-6) || '000000'}`,
        licenseState: location.state || "AZ",
        licenseExpiry: new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        deaNumber: credentials === "MD" || credentials === "DO" ? `A${provider.npi?.slice(0, 7) || '0000000'}` : null,
        boardCertified: Math.random() > 0.3,
        boardCertification: getBoardCertification(provider.specialty),
        documents,
        verifications,
        credentials,
        taxonomyCode: provider.taxonomyCode,
        isPrimaryCare: provider.isPrimaryCare,
        acceptingNewPatients: provider.acceptingNewPatients,
      };
    });
    
    // Filter by status if provided
    const filteredApplications = status 
      ? applications.filter(a => a.status === status)
      : applications;
    
    // Calculate stats
    const stats = {
      total: applications.length,
      pending: applications.filter(a => a.status === "pending").length,
      verification: applications.filter(a => a.status === "verification").length,
      review: applications.filter(a => a.status === "review").length,
      approved: applications.filter(a => a.status === "approved").length,
      denied: applications.filter(a => a.status === "denied").length,
    };
    
    return NextResponse.json({ 
      applications: filteredApplications,
      stats,
      totalProviders: providers.length,
    });
    
  } catch (error) {
    console.error("Applications API error:", error);
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}

function getBoardCertification(specialty: string): string {
  const certifications: Record<string, string> = {
    "Family Medicine": "American Board of Family Medicine",
    "Internal Medicine": "American Board of Internal Medicine",
    "Cardiology": "American Board of Internal Medicine - Cardiovascular Disease",
    "Orthopedics": "American Board of Orthopaedic Surgery",
    "Pediatrics": "American Board of Pediatrics",
    "Psychiatry": "American Board of Psychiatry and Neurology",
    "Dermatology": "American Board of Dermatology",
    "Neurology": "American Board of Psychiatry and Neurology",
    "Radiology": "American Board of Radiology",
    "Emergency Medicine": "American Board of Emergency Medicine",
    "Nurse Practitioner": "American Academy of Nurse Practitioners",
    "Physician Assistant": "National Commission on Certification of Physician Assistants",
  };
  
  for (const [key, cert] of Object.entries(certifications)) {
    if (specialty?.toLowerCase().includes(key.toLowerCase())) {
      return cert;
    }
  }
  return "Board Certified";
}
