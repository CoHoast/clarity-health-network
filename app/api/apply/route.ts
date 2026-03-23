import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Generate application ID
function generateApplicationId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `CRED-${year}-${random}`;
}

// POST /api/apply - Submit a new provider application
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Generate application ID
    const applicationId = generateApplicationId();
    
    // Create application record
    const application = {
      id: applicationId,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      source: data.applicationSource || 'manual',
      caqhProviderId: data.caqhProviderId || null,
      invitationToken: data.invitationToken || null,
      
      // Provider info
      providerType: data.providerType,
      practice: data.practice,
      demographics: data.demographics,
      
      // Credentials
      licenses: data.licenses,
      dea: data.dea,
      boardCertifications: data.boardCertifications,
      education: data.education,
      workHistory: data.workHistory,
      gapExplanation: data.gapExplanation,
      malpractice: data.malpractice,
      references: data.references,
      
      // Disclosures
      disclosures: data.disclosures,
      
      // Documents
      documents: {
        w9: data.w9DocumentName,
        cv: data.cvDocumentName,
        licenses: data.licenses.map((l: { documentName?: string }) => l.documentName).filter(Boolean),
        dea: data.dea.documentName,
        certifications: data.boardCertifications.certifications
          ?.map((c: { documentName?: string }) => c.documentName)
          .filter(Boolean),
        malpractice: data.malpractice.documentName,
      },
      
      // Attestation
      attestation: data.attestation,
      
      // Verification status (initial)
      verification: {
        nppes: { status: 'pending', checkedAt: null },
        oig: { status: 'pending', checkedAt: null },
        sam: { status: 'pending', checkedAt: null },
        stateLicense: { status: 'pending', checkedAt: null },
        dea: { status: 'pending', checkedAt: null },
        boardCert: { status: 'pending', checkedAt: null },
        malpractice: { status: 'pending', checkedAt: null },
      },
      
      // Workflow
      workflow: {
        currentStage: 'verification',
        stages: [
          { name: 'submitted', completedAt: new Date().toISOString() },
          { name: 'verification', startedAt: new Date().toISOString() },
          { name: 'review', startedAt: null, completedAt: null },
          { name: 'committee', startedAt: null, completedAt: null },
          { name: 'contract', startedAt: null, completedAt: null },
          { name: 'active', startedAt: null, completedAt: null },
        ],
      },
    };
    
    // Save to applications.json
    const dataDir = path.join(process.cwd(), 'data');
    const applicationsPath = path.join(dataDir, 'applications.json');
    
    // Ensure data directory exists
    try {
      await fs.mkdir(dataDir, { recursive: true });
    } catch {
      // Directory exists
    }
    
    // Load existing applications
    let applications: Record<string, unknown>[] = [];
    try {
      const existing = await fs.readFile(applicationsPath, 'utf-8');
      applications = JSON.parse(existing);
    } catch {
      // File doesn't exist yet
    }
    
    // Add new application
    applications.push(application);
    
    // Save
    await fs.writeFile(applicationsPath, JSON.stringify(applications, null, 2));
    
    // Trigger initial verification checks (async, non-blocking)
    triggerVerificationChecks(applicationId, data);
    
    return NextResponse.json({
      success: true,
      applicationId,
      message: 'Application submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}

// GET /api/apply - List all applications (admin)
export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const applicationsPath = path.join(dataDir, 'applications.json');
    
    try {
      const data = await fs.readFile(applicationsPath, 'utf-8');
      const applications = JSON.parse(data);
      
      return NextResponse.json({
        success: true,
        applications,
        total: applications.length,
      });
    } catch {
      return NextResponse.json({
        success: true,
        applications: [],
        total: 0,
      });
    }
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

// Trigger verification checks (runs in background)
async function triggerVerificationChecks(applicationId: string, data: Record<string, unknown>) {
  try {
    // In production, this would:
    // 1. Queue verification jobs
    // 2. Call NPPES API to verify NPI
    // 3. Check OIG exclusion list
    // 4. Check SAM.gov exclusions
    // 5. Verify state licenses with state boards
    // 6. Verify board certifications
    // etc.
    
    console.log(`[Verification] Starting checks for application ${applicationId}`);
    
    // For demo, simulate starting verification
    const demographics = data.demographics as { npi?: string } | undefined;
    const practice = data.practice as { npi?: string } | undefined;
    
    // Verify provider NPI
    if (demographics?.npi) {
      console.log(`[Verification] Checking NPI ${demographics.npi} with NPPES`);
    }
    
    // Verify practice NPI
    if (practice?.npi) {
      console.log(`[Verification] Checking Practice NPI ${practice.npi} with NPPES`);
    }
    
    // Check OIG exclusions
    console.log(`[Verification] Checking OIG exclusion list`);
    
    // Check SAM.gov
    console.log(`[Verification] Checking SAM.gov exclusions`);
    
    console.log(`[Verification] Initial checks queued for ${applicationId}`);
  } catch (error) {
    console.error(`[Verification] Error starting checks for ${applicationId}:`, error);
  }
}
