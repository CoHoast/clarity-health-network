import { NextRequest, NextResponse } from "next/server";

// In-memory contracts storage (would be DB in production)
// Starts empty - no demo data, only real contracts created via POST
const createdContracts: any[] = [];

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
 * 
 * Returns only real contracts (created via POST).
 * No demo data - contracts appear as they are created through the workflow.
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const status = searchParams.get("status");
  const applicationId = searchParams.get("applicationId");
  const search = searchParams.get("search");

  // Use only real contracts (no demo data)
  let results = [...createdContracts];

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
  
  // Calculate stats from real contracts only
  const stats = {
    total: createdContracts.length,
    signed: createdContracts.filter(c => c.status === "signed").length,
    pending: createdContracts.filter(c => c.status === "pending_signature").length,
    draft: createdContracts.filter(c => c.status === "draft").length,
    expired: createdContracts.filter(c => c.status === "expired").length,
  };

  return NextResponse.json({
    contracts: results,
    total: results.length,
    stats,
  });
}
