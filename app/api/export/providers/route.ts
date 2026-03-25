import { NextRequest, NextResponse } from 'next/server';
import { logAuditEvent } from '@/lib/audit';
import providersData from '@/data/arizona-providers.json';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'basic'; // 'basic' or 'full'
  
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  const providers = [...providersData] as any[];
  
  let csv = '';
  let filename = '';
  
  if (type === 'full') {
    // Full export - all 52 fields
    const headers = [
      'NPI',
      'First Name',
      'Middle Initial',
      'Last Name',
      'Credential',
      'Gender',
      'Specialty',
      'Specialty Code',
      'Taxonomy Code',
      'Secondary Specialty',
      'Secondary Specialty Code',
      'Secondary Taxonomy Code',
      'Facility Type',
      'Is Primary Care',
      'Is Behavioral Health',
      'Accepting New Patients',
      'Languages',
      'Contract Number',
      'Entity Number',
      'Effective Date',
      'Termination Date',
      'Billing Practice Name',
      'Billing NPI',
      'Billing Tax ID',
      'Billing Address',
      'Billing City',
      'Billing State',
      'Billing Zip',
      'Billing Phone',
      'Billing Fax',
      'Billing Email',
      'Location 1 Name',
      'Location 1 Address',
      'Location 1 City',
      'Location 1 State',
      'Location 1 Zip',
      'Location 1 Phone',
      'Location 1 Fax',
      'License Number',
      'License State',
      'License Expiration',
      'DEA Number',
      'DEA Expiration',
      'Board Certified',
      'Board Certification',
      'Malpractice Carrier',
      'Malpractice Policy',
      'Malpractice Expiration',
      'Education',
      'Residency',
      'Hospital Affiliations',
      'Notes'
    ];
    
    const rows = providers.map((p: any) => [
      p.npi || '',
      p.firstName || '',
      p.middleInitial || '',
      p.lastName || '',
      p.credentials || p.credential || '',
      p.gender || '',
      p.specialty || '',
      p.specialtyCode || '',
      p.taxonomyCode || '',
      p.secondarySpecialty || '',
      p.secondarySpecialtyCode || '',
      p.secondaryTaxonomyCode || '',
      p.facilityType || '',
      p.isPrimaryCare ? 'Yes' : 'No',
      p.isBehavioralHealth ? 'Yes' : 'No',
      p.acceptingNewPatients ? 'Yes' : 'No',
      Array.isArray(p.languages) ? p.languages.join('; ') : (p.languages || ''),
      p.contractNumber || '',
      p.entityNumber || '',
      p.effectiveDate || '',
      p.terminationDate || '',
      p.billing?.name || '',
      p.billing?.npi || '',
      p.billing?.taxId || '',
      p.billing?.address || '',
      p.billing?.city || '',
      p.billing?.state || '',
      p.billing?.zip || '',
      p.billing?.phone || '',
      p.billing?.fax || '',
      p.billing?.email || '',
      p.locations?.[0]?.name || '',
      p.locations?.[0]?.address || '',
      p.locations?.[0]?.city || '',
      p.locations?.[0]?.state || '',
      p.locations?.[0]?.zip || '',
      p.locations?.[0]?.phone || '',
      p.locations?.[0]?.fax || '',
      p.licenseNumber || '',
      p.licenseState || '',
      p.licenseExpiration || '',
      p.deaNumber || '',
      p.deaExpiration || '',
      p.boardCertified ? 'Yes' : 'No',
      p.boardCertification || '',
      p.malpracticeCarrier || '',
      p.malpracticePolicy || '',
      p.malpracticeExpiration || '',
      p.education || '',
      p.residency || '',
      Array.isArray(p.hospitalAffiliations) ? p.hospitalAffiliations.join('; ') : (p.hospitalAffiliations || ''),
      p.notes || ''
    ].map((v: any) => `"${String(v).replace(/"/g, '""')}"`));
    
    csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    filename = `provider-full-export-${new Date().toISOString().split('T')[0]}.csv`;
    
  } else {
    // Basic export - essential fields only
    const headers = [
      'NPI',
      'First Name',
      'Last Name',
      'Credential',
      'Specialty',
      'Contract Number',
      'Entity Number',
      'Practice Name',
      'City',
      'State',
      'Phone',
      'Accepting New Patients'
    ];
    
    const rows = providers.map((p: any) => [
      p.npi || '',
      p.firstName || '',
      p.lastName || '',
      p.credentials || p.credential || '',
      p.specialty || '',
      p.contractNumber || '',
      p.entityNumber || '',
      p.billing?.name || '',
      p.locations?.[0]?.city || '',
      p.locations?.[0]?.state || '',
      p.locations?.[0]?.phone || '',
      p.acceptingNewPatients ? 'Yes' : 'No'
    ].map((v: any) => `"${String(v).replace(/"/g, '""')}"`));
    
    csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    filename = `provider-directory-${new Date().toISOString().split('T')[0]}.csv`;
  }
  
  // Log the export
  await logAuditEvent({
    user: 'admin',
    userId: 'admin-1',
    action: `Export Provider ${type === 'full' ? 'Full Data' : 'Directory'}`,
    category: 'export',
    resource: 'PROVIDERS',
    resourceType: 'Provider',
    details: `Exported ${providers.length} providers (${type} format)`,
    ip,
    userAgent,
    sessionId: 'admin-session',
    severity: 'info',
    phiAccessed: type === 'full', // Full export includes PHI
    success: true,
  });
  
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
