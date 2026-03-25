import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// In-memory contracts (would be DB in production)
const createdContracts: any[] = [];

// Generate contracts from real practices data
function generateContractsFromPractices(): any[] {
  const practicesFile = path.join(process.cwd(), "data", "arizona-practices.json");
  const providersFile = path.join(process.cwd(), "data", "arizona-providers.json");
  
  let practices: any[] = [];
  let providers: any[] = [];
  
  if (fs.existsSync(practicesFile)) {
    practices = JSON.parse(fs.readFileSync(practicesFile, "utf-8"));
  }
  if (fs.existsSync(providersFile)) {
    providers = JSON.parse(fs.readFileSync(providersFile, "utf-8"));
  }
  
  const contracts: any[] = [];
  const today = new Date();
  
  // Generate contracts for first 30 practices
  practices.slice(0, 30).forEach((practice, index) => {
    // Get sample providers from this practice
    const practiceProviders = providers.filter(p => 
      p.billing?.taxId === practice.taxId
    ).slice(0, 3);
    
    // Determine contract status based on distribution
    // 60% signed, 20% pending_signature, 15% draft, 5% expired
    const rand = Math.random();
    let status: string;
    if (rand < 0.60) status = "signed";
    else if (rand < 0.80) status = "pending_signature";
    else if (rand < 0.95) status = "draft";
    else status = "expired";
    
    const effectiveDate = new Date(today);
    effectiveDate.setMonth(effectiveDate.getMonth() - Math.floor(Math.random() * 12));
    
    const termDate = new Date(effectiveDate);
    termDate.setFullYear(termDate.getFullYear() + 3);
    
    const sentDate = status !== "draft" ? new Date(effectiveDate) : null;
    if (sentDate) sentDate.setDate(sentDate.getDate() - 14);
    
    const signedDate = status === "signed" ? new Date(effectiveDate) : null;
    if (signedDate) signedDate.setDate(signedDate.getDate() - 7);
    
    createdContracts.push({
      id: `CTR-2024-${String(index + 100).padStart(4, "0")}`,
      applicationId: `CRED-2024-${String(index + 1000).padStart(4, "0")}`,
      provider: practice.name,
      practice: practice.name,
      npi: practice.npi,
      taxId: practice.taxId,
      type: "group",
      status,
      template: "Group Practice Agreement",
      rateSchedule: index % 3 === 0 ? "Primary Care - 140% Medicare" : index % 3 === 1 ? "Specialist - 135% Medicare" : "Standard PPO Rates",
      effectiveDate: effectiveDate.toISOString().split("T")[0],
      termDate: termDate.toISOString().split("T")[0],
      sentDate: sentDate ? sentDate.toISOString().split("T")[0] : null,
      signedDate: signedDate ? signedDate.toISOString().split("T")[0] : null,
      generatedDate: sentDate ? sentDate.toISOString().split("T")[0] : today.toISOString().split("T")[0],
      providerCount: practiceProviders.length || practice.providerCount || 1,
      city: practice.city,
      state: practice.state,
    });
  });
  
  return contracts;
}

/**
 * POST /api/contracts - Generate a new contract
 * 
 * Request body:
 * {
 *   applicationId: string,
 *   templateId: string,
 *   rateScheduleId: string,
 *   effectiveDate: string,
 *   autoSend: boolean
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      applicationId,
      templateId,
      rateScheduleId,
      effectiveDate,
      autoSend = false,
    } = body;

    // Validate required fields
    if (!applicationId || !templateId || !rateScheduleId) {
      return NextResponse.json(
        { error: "Missing required fields: applicationId, templateId, rateScheduleId" },
        { status: 400 }
      );
    }

    // Generate contract ID
    const contractId = `CTR-${new Date().getFullYear()}-${String(createdContracts.length + 157).padStart(4, "0")}`;

    // Calculate term end date (3 years from effective date)
    const effectiveDateObj = new Date(effectiveDate || new Date());
    const termDate = new Date(effectiveDateObj);
    termDate.setFullYear(termDate.getFullYear() + 3);

    // Create contract record
    const contract = {
      id: contractId,
      applicationId,
      templateId,
      rateScheduleId,
      status: autoSend ? "pending_signature" : "draft",
      effectiveDate: effectiveDateObj.toISOString().split("T")[0],
      termDate: termDate.toISOString().split("T")[0],
      generatedAt: new Date().toISOString(),
      sentAt: autoSend ? new Date().toISOString() : null,
      signedAt: null,
      signedByName: null,
      signedByTitle: null,
      contractPdfUrl: `/contracts/${contractId}.pdf`,
      signedPdfUrl: null,
    };

    createdContracts.push(contract);

    // If autoSend, we would trigger email here
    if (autoSend) {
      // In production: Send email with contract attachment
      console.log(`[Contract] Sending contract ${contractId} for signature`);
    }

    return NextResponse.json({
      success: true,
      contract,
      message: autoSend
        ? "Contract generated and sent for signature"
        : "Contract generated as draft",
    });
  } catch (error: any) {
    console.error("[Contract API] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate contract", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/contracts - List contracts with optional filters
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const status = searchParams.get("status");
  const applicationId = searchParams.get("applicationId");
  const search = searchParams.get("search");

  // Combine generated contracts with any created ones
  let results = [...generateContractsFromPractices(), ...createdContracts];

  if (status && status !== "all") {
    results = results.filter((c) => c.status === status);
  }

  if (applicationId) {
    results = results.filter((c) => c.applicationId === applicationId);
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    results = results.filter((c) => 
      c.provider?.toLowerCase().includes(searchLower) ||
      c.practice?.toLowerCase().includes(searchLower) ||
      c.id?.toLowerCase().includes(searchLower) ||
      c.npi?.includes(search)
    );
  }
  
  // Calculate stats
  const allContracts = [...generateContractsFromPractices(), ...createdContracts];
  const stats = {
    total: allContracts.length,
    signed: allContracts.filter(c => c.status === "signed").length,
    pending: allContracts.filter(c => c.status === "pending_signature").length,
    draft: allContracts.filter(c => c.status === "draft").length,
    expired: allContracts.filter(c => c.status === "expired").length,
  };

  return NextResponse.json({
    contracts: results,
    total: results.length,
    stats,
  });
}
