import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Fast seeding Clarity Health database...');

  // Clear existing data
  await prisma.$executeRaw`TRUNCATE TABLE pulse_messages, pulse_conversations, audit_logs, fraud_alerts, credentialing_documents, credentialing_applications, documents, messages, eligibility_checks, invoices, fee_schedule_rates, fee_schedules, payment_batches, claim_service_lines, claims, contracts, provider_locations, providers, members, employer_users, employer_groups, admin_users CASCADE`;

  const passwordHash = bcrypt.hashSync('demo123', 10);

  // Admin users
  console.log('Creating admin users...');
  await prisma.adminUser.createMany({
    data: [
      { email: 'admin@clarityhealthnetwork.com', passwordHash, name: 'System Admin', role: 'super_admin', status: 'active' },
      { email: 'claims@clarityhealthnetwork.com', passwordHash, name: 'Claims Manager', role: 'claims_admin', status: 'active' },
    ]
  });

  // Employer groups
  console.log('Creating employer groups...');
  const employers = await Promise.all([
    prisma.employerGroup.create({
      data: { name: 'Acme Corporation', groupNumber: 'GRP-12345', planType: 'gold_ppo', effectiveDate: new Date('2025-01-01') }
    }),
    prisma.employerGroup.create({
      data: { name: 'TechStart Inc', groupNumber: 'GRP-67890', planType: 'platinum_ppo', effectiveDate: new Date('2025-01-01') }
    }),
  ]);

  // Employer users
  console.log('Creating employer users...');
  await prisma.employerUser.createMany({
    data: [
      { employerId: employers[0].id, email: 'hr@acmecorp.com', passwordHash, name: 'HR Manager', role: 'admin', status: 'active' },
      { employerId: employers[1].id, email: 'hr@techstart.com', passwordHash, name: 'Benefits Admin', role: 'admin', status: 'active' },
    ]
  });

  // Providers (20 instead of 250)
  console.log('Creating providers...');
  const specialties = ['Family Medicine', 'Internal Medicine', 'Cardiology', 'Orthopedics', 'Dermatology'];
  const providerData = [];
  for (let i = 1; i <= 20; i++) {
    providerData.push({
      npi: `123456${String(i).padStart(4, '0')}`,
      name: `Dr. Provider ${i}`,
      email: i === 1 ? 'dr.johnson@mainstreetmed.com' : `provider${i}@clinic.com`,
      passwordHash,
      specialty: specialties[i % specialties.length],
      type: 'physician',
      address: `${i * 100} Medical Way`,
      city: 'Cleveland',
      state: 'OH',
      zip: '44101',
      phone: `(216) 555-${String(i).padStart(4, '0')}`,
      status: 'active',
      contractStatus: 'contracted',
      credentialStatus: 'active',
      acceptingPatients: true,
    });
  }
  await prisma.provider.createMany({ data: providerData });
  const providers = await prisma.provider.findMany();

  // Members (20 instead of 100)
  console.log('Creating members...');
  const memberData = [];
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Jennifer'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Martinez', 'Wilson'];
  for (let i = 1; i <= 20; i++) {
    memberData.push({
      employerId: employers[i % 2].id,
      memberNumber: `CLH-${100000 + i}`,
      firstName: firstNames[i % 10],
      lastName: lastNames[i % 10],
      email: i === 1 ? 'john.smith@email.com' : `member${i}@email.com`,
      passwordHash,
      dateOfBirth: new Date(`${1970 + (i % 30)}-01-01`),
      gender: i % 2 === 0 ? 'female' : 'male',
      address: `${i * 10} Main Street`,
      city: 'Cleveland',
      state: 'OH',
      zip: '44101',
      phone: `(216) 555-${String(1000 + i)}`,
      planType: i % 3 === 0 ? 'platinum_ppo' : i % 3 === 1 ? 'gold_ppo' : 'silver_ppo',
      relationship: 'subscriber',
      status: 'active',
      effectiveDate: new Date('2025-01-01'),
    });
  }
  await prisma.member.createMany({ data: memberData });
  const members = await prisma.member.findMany();

  // Claims (50 instead of 1000)
  console.log('Creating claims...');
  const statuses = ['pending', 'processing', 'paid', 'denied'];
  const claimData = [];
  for (let i = 1; i <= 50; i++) {
    const status = statuses[i % 4];
    const billedAmount = Math.floor(Math.random() * 500) + 50;
    const allowedAmount = status !== 'pending' ? Math.round(billedAmount * 0.7) : null;
    const paidAmount = status === 'paid' ? Math.round(allowedAmount! * 0.8) : null;
    const memberResp = status === 'paid' ? Math.round(allowedAmount! * 0.2) : null;

    claimData.push({
      memberId: members[i % members.length].id,
      providerId: providers[i % providers.length].id,
      claimNumber: `CLM-2026-${String(i).padStart(5, '0')}`,
      claimType: 'professional',
      placeOfService: '11',
      serviceDate: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)),
      receivedDate: new Date(Date.now() - (i * 24 * 60 * 60 * 1000) + 86400000),
      diagnosisCodes: ['Z00.00'],
      billedAmount,
      allowedAmount,
      paidAmount,
      memberResponsibility: memberResp,
      status,
    });
  }
  await prisma.claim.createMany({ data: claimData });

  // Fee schedule
  console.log('Creating fee schedule...');
  const feeSchedule = await prisma.feeSchedule.create({
    data: { name: 'Standard Fee Schedule 2026', type: 'standard', effectiveDate: new Date('2026-01-01'), status: 'active' }
  });
  
  const codes = ['99213', '99214', '99215', '99203', '99204', '99205'];
  await prisma.feeScheduleRate.createMany({
    data: codes.map((code, i) => ({
      feeScheduleId: feeSchedule.id,
      procedureCode: code,
      allowedAmount: 100 + (i * 25),
      effectiveDate: new Date('2026-01-01'),
    }))
  });

  // Invoices
  console.log('Creating invoices...');
  await prisma.invoice.createMany({
    data: employers.map((emp, i) => ({
      employerId: emp.id,
      invoiceNumber: `INV-2026-${String(i + 1).padStart(3, '0')}`,
      periodStart: new Date('2026-03-01'),
      periodEnd: new Date('2026-03-31'),
      premiumAmount: 15000 + (i * 5000),
      adminFees: 500,
      totalAmount: 15500 + (i * 5000),
      dueDate: new Date('2026-04-15'),
      status: 'pending',
    }))
  });

  console.log('✅ Fast seed complete!');
  console.log(`
Test credentials:
─────────────────
Member:   john.smith@email.com / demo123
Provider: dr.johnson@mainstreetmed.com / demo123
Employer: hr@acmecorp.com / demo123
Admin:    admin@clarityhealthnetwork.com / demo123
`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
