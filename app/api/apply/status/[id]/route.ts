import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// GET /api/apply/status/[id] - Get application status
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const dataDir = path.join(process.cwd(), 'data');
    const applicationsPath = path.join(dataDir, 'applications.json');
    
    try {
      const data = await fs.readFile(applicationsPath, 'utf-8');
      const applications = JSON.parse(data);
      
      const application = applications.find((app: { id: string }) => app.id === id);
      
      if (!application) {
        return NextResponse.json(
          { success: false, error: 'Application not found' },
          { status: 404 }
        );
      }
      
      // Return sanitized application data (exclude sensitive info)
      return NextResponse.json({
        success: true,
        application: {
          id: application.id,
          status: application.status,
          submittedAt: application.submittedAt,
          providerType: application.providerType,
          demographics: {
            firstName: application.demographics?.firstName,
            lastName: application.demographics?.lastName,
            credentials: application.demographics?.credentials,
          },
          workflow: application.workflow,
          verification: application.verification,
        },
      });
    } catch {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error fetching application status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch application status' },
      { status: 500 }
    );
  }
}
