import { NextRequest, NextResponse } from 'next/server';
import { queryAuditLogs, exportAuditLogs, logAudit, AuditAction, AuditCategory, AuditResource, AuditSeverity } from '@/lib/audit';

// Get audit logs with filtering
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const filters = {
    userId: searchParams.get('userId') || undefined,
    userType: searchParams.get('userType') || undefined,
    action: searchParams.get('action') as AuditAction | undefined,
    category: searchParams.get('category') as AuditCategory | undefined,
    resource: searchParams.get('resource') as AuditResource | undefined,
    resourceId: searchParams.get('resourceId') || undefined,
    severity: searchParams.get('severity') as AuditSeverity | undefined,
    phiAccessed: searchParams.get('phiAccessed') === 'true' ? true : 
                 searchParams.get('phiAccessed') === 'false' ? false : undefined,
    success: searchParams.get('success') === 'true' ? true : 
             searchParams.get('success') === 'false' ? false : undefined,
    startDate: searchParams.get('startDate') || undefined,
    endDate: searchParams.get('endDate') || undefined,
    limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100,
    offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
  };
  
  // Log that someone is accessing audit logs
  await logAudit({
    action: 'read',
    resource: 'report',
    resourceName: 'Audit Logs',
    details: { filters },
  });
  
  const result = await queryAuditLogs(filters);
  
  return NextResponse.json(result);
}

// Export audit logs
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!data.startDate || !data.endDate) {
      return NextResponse.json(
        { error: 'startDate and endDate are required' },
        { status: 400 }
      );
    }
    
    const result = await exportAuditLogs({
      startDate: data.startDate,
      endDate: data.endDate,
      format: data.format || 'json',
    });
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to export audit logs' },
      { status: 500 }
    );
  }
}
