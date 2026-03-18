import { NextRequest, NextResponse } from "next/server";

// Mock data store (shared with document-requests in production via database)
const mockRequests: Record<string, any> = {
  // Pre-populated demo tokens
  demo123: {
    id: "REQ-001",
    token: "demo123",
    providerId: "prov-001",
    providerName: "Dr. Sarah Mitchell, MD",
    providerEmail: "dr.mitchell@cardio.com",
    practiceName: "Cleveland Heart Center",
    requestedDocuments: ["license", "dea", "malpractice_coi", "board_cert", "w9"],
    uploadedDocuments: [],
    status: "pending",
    expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    customMessage: "Please upload your documents at your earliest convenience.",
    network: {
      name: "TrueCare Health Network",
      email: "credentialing@truecarehealth.com",
    },
  },
};

/**
 * GET /api/upload/[token] - Validate token and get request info
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    // Check for special test tokens
    if (token === "expired") {
      return NextResponse.json(
        { error: "expired", message: "This upload link has expired" },
        { status: 410 }
      );
    }

    if (token === "invalid" || token.length < 6) {
      return NextResponse.json(
        { error: "invalid", message: "Invalid or unknown upload link" },
        { status: 404 }
      );
    }

    // Look up request by token
    const request = mockRequests[token] || mockRequests.demo123; // Default to demo for any token

    // Check if expired
    if (new Date(request.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: "expired", message: "This upload link has expired" },
        { status: 410 }
      );
    }

    // Return request info (without sensitive data)
    return NextResponse.json({
      id: request.id,
      provider: {
        name: request.providerName,
        practice: request.practiceName,
        email: request.providerEmail,
      },
      network: request.network,
      requestedDocuments: request.requestedDocuments,
      uploadedDocuments: request.uploadedDocuments,
      expiresAt: request.expiresAt,
      customMessage: request.customMessage,
    });
  } catch (error: any) {
    console.error("[Upload Token API] Error:", error);
    return NextResponse.json(
      { error: "server_error", message: "Failed to validate upload link" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/upload/[token] - Upload documents
 * 
 * In production, this would handle multipart form data
 * and upload files to S3/cloud storage
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    // Validate token exists
    if (token === "expired" || token === "invalid") {
      return NextResponse.json(
        { error: "invalid", message: "Upload link is not valid" },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { documentType, fileName, fileSize } = body;

    if (!documentType) {
      return NextResponse.json(
        { error: "Missing documentType" },
        { status: 400 }
      );
    }

    // In production:
    // 1. Validate token and check expiration
    // 2. Accept multipart form data
    // 3. Validate file type and size
    // 4. Upload to S3 with encryption
    // 5. Update document request record
    // 6. Send notification to admin

    // Simulate successful upload
    const uploadResult = {
      success: true,
      documentType,
      fileName: fileName || "document.pdf",
      fileSize: fileSize || 1024000,
      uploadedAt: new Date().toISOString(),
      storageKey: `uploads/${token}/${documentType}/${Date.now()}.pdf`,
    };

    console.log(`[Upload] Document uploaded: ${documentType} for token ${token.substring(0, 8)}...`);

    return NextResponse.json({
      success: true,
      upload: uploadResult,
      message: `${documentType} uploaded successfully`,
    });
  } catch (error: any) {
    console.error("[Upload API] Error:", error);
    return NextResponse.json(
      { error: "upload_failed", message: "Failed to upload document" },
      { status: 500 }
    );
  }
}
