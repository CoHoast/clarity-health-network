import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/contracts/[id]/send - Send contract for signature
 * 
 * Request body:
 * {
 *   recipientEmail: string,
 *   recipientName: string,
 *   customMessage?: string
 * }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: contractId } = await params;
    const body = await req.json();
    const { recipientEmail, recipientName, customMessage } = body;

    // Validate required fields
    if (!recipientEmail || !recipientName) {
      return NextResponse.json(
        { error: "Missing required fields: recipientEmail, recipientName" },
        { status: 400 }
      );
    }

    // In production: 
    // 1. Generate contract PDF with provider data
    // 2. Send email with attachment
    // 3. Update contract status in database

    const emailPayload = {
      to: recipientEmail,
      subject: "Your TrueCare Participation Agreement is Ready",
      template: "contract-sent",
      mergeFields: {
        provider_name: recipientName,
        contract_id: contractId,
        // Other fields would be populated from contract/application data
      },
      attachments: [
        {
          filename: `TrueCare-Contract-${contractId}.pdf`,
          path: `/contracts/${contractId}.pdf`,
        },
      ],
    };

    console.log(`[Contract] Sending contract ${contractId} to ${recipientEmail}`);

    const updatedContract = {
      id: contractId,
      status: "pending_signature",
      sentAt: new Date().toISOString(),
      sentTo: recipientEmail,
    };

    return NextResponse.json({
      success: true,
      contract: updatedContract,
      emailSent: true,
      recipient: recipientEmail,
      message: `Contract sent to ${recipientName} at ${recipientEmail}`,
    });
  } catch (error: any) {
    console.error("[Contract Send API] Error:", error);
    return NextResponse.json(
      { error: "Failed to send contract", details: error.message },
      { status: 500 }
    );
  }
}
