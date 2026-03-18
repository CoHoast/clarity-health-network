import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/document-requests/[id]/reminder - Send reminder email
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // In production: Look up request and send reminder email
    console.log(`[Document Request] Sending reminder for request ${id}`);

    // Simulate sending reminder
    const result = {
      success: true,
      requestId: id,
      reminderSentAt: new Date().toISOString(),
      reminderCount: 1, // Would be incremented from DB
    };

    return NextResponse.json({
      ...result,
      message: "Reminder email sent successfully",
    });
  } catch (error: any) {
    console.error("[Reminder API] Error:", error);
    return NextResponse.json(
      { error: "Failed to send reminder", details: error.message },
      { status: 500 }
    );
  }
}
