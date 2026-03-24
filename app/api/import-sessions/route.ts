import { NextRequest, NextResponse } from 'next/server';
import { logAuditEvent } from '@/lib/audit';
import {
  loadImportSessions,
  createImportSession,
  getRecentImportSessions,
} from '@/lib/import-session';

// GET - List recent import sessions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const sessions = getRecentImportSessions(limit);
    
    return NextResponse.json({
      sessions,
      total: loadImportSessions().length,
    });
  } catch (error) {
    console.error('Error fetching import sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch import sessions' }, { status: 500 });
  }
}

// POST - Create a new import session
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    const session = createImportSession({
      fileName: data.fileName || 'unknown.csv',
      fileSize: data.fileSize || 0,
      totalRows: data.totalRows || 0,
      createdBy: data.createdBy || 'system',
    });
    
    // Log audit event
    await logAuditEvent({
      user: data.createdBy || 'system',
      userId: data.userId || 'system',
      action: 'CSV Import Started',
      category: 'data_change',
      resource: session.id,
      resourceType: 'ImportSession',
      resourceId: session.id,
      details: `Started import of ${data.fileName} with ${data.totalRows} rows`,
      ip,
      userAgent,
      sessionId: session.id,
      severity: 'info',
      phiAccessed: false,
      success: true,
    });
    
    return NextResponse.json({ session });
  } catch (error) {
    console.error('Error creating import session:', error);
    return NextResponse.json({ error: 'Failed to create import session' }, { status: 500 });
  }
}
