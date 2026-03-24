import { NextRequest, NextResponse } from 'next/server';
import { logAuditEvent } from '@/lib/audit';
import { rollbackImportSession, getImportSession } from '@/lib/import-session';

// POST - Rollback an import session
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Get session info before rollback
    const session = getImportSession(id);
    if (!session) {
      return NextResponse.json({ error: 'Import session not found' }, { status: 404 });
    }
    
    // Perform rollback
    const result = rollbackImportSession(id, data.rolledBackBy || 'system');
    
    // Log audit event
    await logAuditEvent({
      user: data.rolledBackBy || 'system',
      userId: data.userId || 'system',
      action: result.success ? 'CSV Import Rolled Back' : 'CSV Import Rollback Failed',
      category: 'data_change',
      resource: id,
      resourceType: 'ImportSession',
      resourceId: id,
      details: result.message,
      ip,
      userAgent,
      sessionId: id,
      severity: result.success ? 'warning' : 'error',
      phiAccessed: false,
      success: result.success,
    });
    
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error rolling back import:', error);
    return NextResponse.json({ error: 'Failed to rollback import' }, { status: 500 });
  }
}
