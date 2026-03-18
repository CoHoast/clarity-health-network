import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

// In-memory store for demo (would be database in production)
const documentRequests: any[] = [];

/**
 * POST /api/document-requests - Create a new document request
 * 
 * Request body:
 * {
 *   providerId: string,
 *   providerName: string,
 *   providerEmail: string,
 *   practiceName: string,
 *   requestedDocuments: string[],
 *   expiresInDays: number,
 *   customMessage?: string
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      providerId,
      providerName,
      providerEmail,
      practiceName,
      requestedDocuments,
      expiresInDays = 14,
      customMessage,
    } = body;

    // Validate required fields
    if (!providerName || !providerEmail || !requestedDocuments?.length) {
      return NextResponse.json(
        { error: "Missing required fields: providerName, providerEmail, requestedDocuments" },
        { status: 400 }
      );
    }

    // Generate secure token
    const token = randomBytes(32).toString("hex");

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    // Create request record
    const request = {
      id: `REQ-${String(documentRequests.length + 1).padStart(3, "0")}`,
      token,
      providerId,
      providerName,
      providerEmail,
      practiceName,
      requestedDocuments,
      uploadedDocuments: [],
      status: "pending",
      expiresAt: expiresAt.toISOString(),
      customMessage,
      createdAt: new Date().toISOString(),
      createdBy: "admin", // Would come from auth context
      remindersSent: 0,
      lastReminderAt: null,
    };

    documentRequests.push(request);

    // Generate upload URL
    const uploadUrl = `/upload/${token}`;

    // In production: Send email to provider
    console.log(`[Document Request] Sending request to ${providerEmail}`);
    console.log(`[Document Request] Upload URL: ${uploadUrl}`);

    return NextResponse.json({
      success: true,
      request: {
        ...request,
        uploadUrl,
      },
      message: `Document request sent to ${providerEmail}`,
    });
  } catch (error: any) {
    console.error("[Document Request API] Error:", error);
    return NextResponse.json(
      { error: "Failed to create document request", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/document-requests - List document requests with filters
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const status = searchParams.get("status");
  const providerId = searchParams.get("providerId");

  let results = [...documentRequests];

  if (status) {
    results = results.filter((r) => r.status === status);
  }

  if (providerId) {
    results = results.filter((r) => r.providerId === providerId);
  }

  // Check for expired requests
  const now = new Date();
  results = results.map((r) => {
    if (r.status !== "complete" && new Date(r.expiresAt) < now) {
      return { ...r, status: "expired" };
    }
    return r;
  });

  return NextResponse.json({
    requests: results,
    total: results.length,
  });
}
