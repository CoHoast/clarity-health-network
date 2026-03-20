import { NextRequest, NextResponse } from 'next/server';
import { getAuditLogs, logAuditEvent, getAuditStats, clearAuditLogs, AuditCategory, AuditSeverity } from '@/lib/audit';

// GET - Fetch audit logs with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const options = {
      limit: parseInt(searchParams.get('limit') || '100'),
      offset: parseInt(searchParams.get('offset') || '0'),
      category: searchParams.get('category') as AuditCategory | undefined,
      severity: searchParams.get('severity') as AuditSeverity | undefined,
      user: searchParams.get('user') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      phiOnly: searchParams.get('phiOnly') === 'true',
    };
    
    // Clean undefined values
    Object.keys(options).forEach(key => {
      if (options[key as keyof typeof options] === undefined || options[key as keyof typeof options] === '') {
        delete options[key as keyof typeof options];
      }
    });
    
    const { logs, total } = await getAuditLogs(options);
    const stats = await getAuditStats();
    
    return NextResponse.json({
      logs,
      total,
      stats,
      pagination: {
        limit: options.limit,
        offset: options.offset || 0,
        hasMore: (options.offset || 0) + logs.length < total,
      },
    });
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}

// POST - Log a new audit event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const required = ['user', 'action', 'category', 'resource', 'resourceType'];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Set defaults for optional fields
    const event = {
      user: body.user,
      userId: body.userId || body.user,
      action: body.action,
      category: body.category,
      resource: body.resource,
      resourceType: body.resourceType,
      resourceId: body.resourceId,
      details: body.details || '',
      ip: body.ip || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: body.userAgent || request.headers.get('user-agent') || 'unknown',
      sessionId: body.sessionId || 'unknown',
      severity: body.severity || 'info',
      phiAccessed: body.phiAccessed || false,
      success: body.success !== false, // Default to true
      metadata: body.metadata,
    };
    
    const auditEvent = await logAuditEvent(event);
    
    return NextResponse.json({ 
      success: true, 
      event: auditEvent 
    });
  } catch (error) {
    console.error('Failed to log audit event:', error);
    return NextResponse.json(
      { error: 'Failed to log audit event' },
      { status: 500 }
    );
  }
}

// DELETE - Clear audit logs (demo only!)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const confirm = searchParams.get('confirm');
    
    if (confirm !== 'CLEAR_ALL_LOGS') {
      return NextResponse.json(
        { error: 'Must confirm with ?confirm=CLEAR_ALL_LOGS' },
        { status: 400 }
      );
    }
    
    await clearAuditLogs();
    
    // Log the clear action itself
    await logAuditEvent({
      user: 'system',
      userId: 'system',
      action: 'Clear Audit Logs',
      category: 'system',
      resource: 'AUDIT_LOG',
      resourceType: 'System',
      details: 'All audit logs cleared (demo reset)',
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      sessionId: 'system',
      severity: 'critical',
      phiAccessed: false,
      success: true,
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Audit logs cleared' 
    });
  } catch (error) {
    console.error('Failed to clear audit logs:', error);
    return NextResponse.json(
      { error: 'Failed to clear audit logs' },
      { status: 500 }
    );
  }
}
