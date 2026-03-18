import { NextRequest, NextResponse } from "next/server";

// Demo data for generated contracts
const contracts: any[] = [];

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
    const contractId = `CTR-${new Date().getFullYear()}-${String(contracts.length + 157).padStart(4, "0")}`;

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

    contracts.push(contract);

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

  let results = [...contracts];

  if (status) {
    results = results.filter((c) => c.status === status);
  }

  if (applicationId) {
    results = results.filter((c) => c.applicationId === applicationId);
  }

  return NextResponse.json({
    contracts: results,
    total: results.length,
  });
}
