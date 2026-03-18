import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/contracts/[id]/sign - Mark contract as signed and optionally activate provider
 * 
 * Request body:
 * {
 *   signedByName: string,
 *   signedByTitle: string,
 *   signatureDate: string,
 *   signedPdfUrl?: string,
 *   activateProvider: boolean
 * }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: contractId } = await params;
    const body = await req.json();
    const {
      signedByName,
      signedByTitle,
      signatureDate,
      signedPdfUrl,
      activateProvider = true,
    } = body;

    // Validate required fields
    if (!signedByName || !signatureDate) {
      return NextResponse.json(
        { error: "Missing required fields: signedByName, signatureDate" },
        { status: 400 }
      );
    }

    // In production: Update contract in database
    const updatedContract = {
      id: contractId,
      status: "signed",
      signedAt: signatureDate,
      signedByName,
      signedByTitle,
      signedPdfUrl: signedPdfUrl || `/contracts/${contractId}-signed.pdf`,
    };

    // If activating provider
    let providerActivation = null;
    if (activateProvider) {
      // In production: Update provider status in database
      providerActivation = {
        status: "active",
        activatedAt: new Date().toISOString(),
        welcomeEmailSent: true,
      };

      // Send welcome email
      console.log(`[Provider] Sending welcome email for contract ${contractId}`);
    }

    return NextResponse.json({
      success: true,
      contract: updatedContract,
      providerActivation,
      message: activateProvider
        ? "Contract signed and provider activated"
        : "Contract signed successfully",
    });
  } catch (error: any) {
    console.error("[Contract Sign API] Error:", error);
    return NextResponse.json(
      { error: "Failed to process signed contract", details: error.message },
      { status: 500 }
    );
  }
}
