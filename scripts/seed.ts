import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding TrueCare Health database...');
  
  const passwordHash = bcrypt.hashSync('demo123', 10);

  // ========================================
  // ADMIN USERS
  // ========================================
  console.log('Creating admin users...');
  await prisma.adminUser.createMany({
    data: [
      { email: 'admin@truecarehealthnetwork.com', passwordHash, name: 'System Admin', role: 'super_admin' },
      { email: 'claims@truecarehealthnetwork.com', passwordHash, name: 'Claims Processor', role: 'claims_admin' },
      { email: 'provider.relations@truecarehealthnetwork.com', passwordHash, name: 'Provider Relations', role: 'provider_admin' },
    ],
    skipDuplicates: true,
  });

  // ========================================
  // EMPLOYER GROUPS
  // ========================================
  console.log('Creating employer groups...');
  const employers = await Promise.all([
    prisma.employerGroup.upsert({
      where: { groupNumber: 'GRP-12345' },
      update: {},
      create: {
        name: 'Acme Corporation',
        groupNumber: 'GRP-12345',
        status: 'active',
        planType: 'gold_ppo',
        effectiveDate: new Date('2025-01-01'),
        address: '100 Corporate Blvd',
        city: 'Cleveland',
        state: 'OH',
        zip: '44101',
        phone: '216-555-1000',
      },
    }),
    prisma.employerGroup.upsert({
      where: { groupNumber: 'GRP-12346' },
      update: {},
      create: {
        name: 'TechStart Inc',
        groupNumber: 'GRP-12346',
        status: 'active',
        planType: 'silver_ppo',
        effectiveDate: new Date('2025-01-01'),
        address: '200 Innovation Way',
        city: 'Cleveland',
        state: 'OH',
        zip: '44102',
        phone: '216-555-2000',
      },
    }),
    prisma.employerGroup.upsert({
      where: { groupNumber: 'GRP-12347' },
      update: {},
      create: {
        name: 'Metro Healthcare Systems',
        groupNumber: 'GRP-12347',
        status: 'active',
        planType: 'platinum_ppo',
        effectiveDate: new Date('2025-01-01'),
        address: '300 Medical Center Dr',
        city: 'Cleveland',
        state: 'OH',
        zip: '44103',
        phone: '216-555-3000',
      },
    }),
  ]);

  // ========================================
  // EMPLOYER USERS
  // ========================================
  console.log('Creating employer users...');
  await prisma.employerUser.createMany({
    data: [
      { employerId: employers[0].id, email: 'hr@acmecorp.com', passwordHash, name: 'Jane Wilson', role: 'hr_admin' },
      { employerId: employers[0].id, email: 'benefits@acmecorp.com', passwordHash, name: 'Mike Chen', role: 'benefits_manager' },
      { employerId: employers[1].id, email: 'hr@techstart.com', passwordHash, name: 'Sarah Johnson', role: 'hr_admin' },
      { employerId: employers[2].id, email: 'hr@metrohealthcare.com', passwordHash, name: 'Tom Brown', role: 'hr_admin' },
    ],
    skipDuplicates: true,
  });

  // ========================================
  // PROVIDERS
  // ========================================
  console.log('Creating providers...');
  const specialties = ['Family Medicine', 'Internal Medicine', 'Pediatrics', 'Cardiology', 'Orthopedic Surgery', 'Dermatology', 'Neurology', 'Psychiatry', 'Radiology', 'Emergency Medicine'];
  
  const providers = await Promise.all([
    prisma.provider.upsert({
      where: { npi: '1234567890' },
      update: {},
      create: {
        npi: '1234567890',
        name: 'Main Street Medical Group',
        email: 'dr.johnson@mainstreetmed.com',
        passwordHash,
        type: 'group',
        specialty: 'Family Medicine',
        address: '123 Main St',
        city: 'Cleveland',
        state: 'OH',
        zip: '44101',
        phone: '216-555-0100',
        fax: '216-555-0101',
        status: 'active',
        contractStatus: 'contracted',
        credentialStatus: 'verified',
        credentialExpiry: new Date('2026-12-31'),
      },
    }),
    prisma.provider.upsert({
      where: { npi: '1234567891' },
      update: {},
      create: {
        npi: '1234567891',
        name: 'Cleveland Orthopedics',
        email: 'admin@cleveortho.com',
        passwordHash,
        type: 'group',
        specialty: 'Orthopedic Surgery',
        address: '456 Health Ave',
        city: 'Cleveland',
        state: 'OH',
        zip: '44102',
        phone: '216-555-0200',
        fax: '216-555-0201',
        status: 'active',
        contractStatus: 'contracted',
        credentialStatus: 'verified',
        credentialExpiry: new Date('2026-12-31'),
      },
    }),
    prisma.provider.upsert({
      where: { npi: '1234567892' },
      update: {},
      create: {
        npi: '1234567892',
        name: 'Metro Cardiology',
        email: 'office@metrocardio.com',
        passwordHash,
        type: 'group',
        specialty: 'Cardiology',
        address: '789 Heart Blvd',
        city: 'Cleveland',
        state: 'OH',
        zip: '44103',
        phone: '216-555-0300',
        fax: '216-555-0301',
        status: 'active',
        contractStatus: 'contracted',
        credentialStatus: 'verified',
        credentialExpiry: new Date('2026-12-31'),
      },
    }),
  ]);

  // Create additional providers (247 more to reach 250)
  for (let i = 3; i < 250; i++) {
    const specialty = specialties[i % specialties.length];
    const npi = `12345${(67893 + i).toString().padStart(5, '0')}`;
    try {
      await prisma.provider.upsert({
        where: { npi },
        update: {},
        create: {
          npi,
          name: `${specialty} Associates ${i}`,
          email: `provider${i}@truecare.demo`,
          passwordHash,
          type: i % 3 === 0 ? 'group' : 'individual',
          specialty,
          address: `${100 + i} Medical Way`,
          city: 'Cleveland',
          state: 'OH',
          zip: `441${(i % 10).toString().padStart(2, '0')}`,
          phone: `216-555-${(1000 + i).toString().padStart(4, '0')}`,
          status: 'active',
          contractStatus: i % 5 === 0 ? 'non_contracted' : 'contracted',
          credentialStatus: 'verified',
          credentialExpiry: new Date('2026-12-31'),
        },
      });
    } catch (e) {
      // Skip duplicates
    }
  }

  // ========================================
  // PROVIDER LOCATIONS
  // ========================================
  console.log('Creating provider locations...');
  await prisma.providerLocation.createMany({
    data: [
      { providerId: providers[0].id, name: 'Main Office', address: '123 Main St', city: 'Cleveland', state: 'OH', zip: '44101', phone: '216-555-0100', isPrimary: true },
      { providerId: providers[0].id, name: 'Westlake Branch', address: '500 Westlake Dr', city: 'Westlake', state: 'OH', zip: '44145', phone: '440-555-0100', isPrimary: false },
      { providerId: providers[1].id, name: 'Main Office', address: '456 Health Ave', city: 'Cleveland', state: 'OH', zip: '44102', phone: '216-555-0200', isPrimary: true },
      { providerId: providers[2].id, name: 'Downtown Clinic', address: '789 Heart Blvd', city: 'Cleveland', state: 'OH', zip: '44103', phone: '216-555-0300', isPrimary: true },
    ],
    skipDuplicates: true,
  });

  // ========================================
  // CONTRACTS
  // ========================================
  console.log('Creating contracts...');
  await prisma.contract.createMany({
    data: [
      { providerId: providers[0].id, contractNumber: 'CON-001', type: 'percent_of_medicare', terms: { percent: 150 }, effectiveDate: new Date('2025-01-01'), status: 'active' },
      { providerId: providers[1].id, contractNumber: 'CON-002', type: 'percent_of_medicare', terms: { percent: 175 }, effectiveDate: new Date('2025-01-01'), status: 'active' },
      { providerId: providers[2].id, contractNumber: 'CON-003', type: 'percent_of_medicare', terms: { percent: 160 }, effectiveDate: new Date('2025-01-01'), status: 'active' },
    ],
    skipDuplicates: true,
  });

  // ========================================
  // MEMBERS
  // ========================================
  console.log('Creating members...');
  const firstNames = ['John', 'Mary', 'Robert', 'Sarah', 'Michael', 'Jennifer', 'David', 'Emily', 'James', 'Jessica'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  
  const memberPromises = [];
  for (let i = 0; i < 100; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[Math.floor(i / 10) % lastNames.length];
    const memberNumber = `CLH-${(100001 + i).toString()}`;
    const email = i === 0 ? 'john.smith@email.com' : `member${i}@truecare.demo`;
    
    memberPromises.push(
      prisma.member.upsert({
        where: { memberNumber },
        update: {},
        create: {
          employerId: employers[i % 3].id,
          memberNumber,
          firstName,
          lastName,
          email,
          passwordHash,
          dateOfBirth: new Date(1970 + (i % 40), i % 12, (i % 28) + 1),
          gender: i % 2 === 0 ? 'M' : 'F',
          address: `${100 + i} Residential St`,
          city: 'Cleveland',
          state: 'OH',
          zip: `441${(i % 10).toString().padStart(2, '0')}`,
          phone: `216-${(555 + Math.floor(i / 100)).toString()}-${(1000 + i).toString().padStart(4, '0')}`,
          planType: employers[i % 3].planType,
          relationship: 'subscriber',
          status: 'active',
          effectiveDate: new Date('2025-01-01'),
        },
      })
    );
  }
  const members = await Promise.all(memberPromises);

  // ========================================
  // CLAIMS
  // ========================================
  console.log('Creating claims...');
  const procedureCodes = ['99213', '99214', '99215', '99212', '99211', '36415', '80053', '85025', '81001', '71046'];
  const diagnosisCodes = ['J06.9', 'M54.5', 'E11.9', 'I10', 'F32.9', 'Z00.00', 'R51', 'K21.0', 'G43.909', 'L30.9'];
  const statuses = ['paid', 'paid', 'paid', 'paid', 'pending', 'processing', 'denied'];

  const allProviders = await prisma.provider.findMany({ take: 50 });
  
  for (let i = 0; i < 1000; i++) {
    const member = members[i % members.length];
    const provider = allProviders[i % allProviders.length];
    const procedureCode = procedureCodes[i % procedureCodes.length];
    const status = statuses[i % statuses.length];
    
    const billedAmount = 50 + Math.floor(Math.random() * 450);
    const allowedAmount = Math.floor(billedAmount * 0.7);
    const memberResp = Math.floor(allowedAmount * 0.2);
    const paidAmount = status === 'paid' ? allowedAmount - memberResp : null;

    try {
      await prisma.claim.create({
        data: {
          claimNumber: `CLM-2026-${(i + 1).toString().padStart(5, '0')}`,
          memberId: member.id,
          providerId: provider.id,
          serviceDate: new Date(2026, 0, 1 + (i % 70)),
          claimType: 'professional',
          placeOfService: '11',
          diagnosisCodes: [diagnosisCodes[i % diagnosisCodes.length]],
          billedAmount,
          allowedAmount: status !== 'processing' ? allowedAmount : null,
          paidAmount,
          memberResponsibility: status !== 'processing' ? memberResp : null,
          status,
          denialReason: status === 'denied' ? 'Service not covered' : null,
          adjudicatedAt: status !== 'processing' ? new Date() : null,
          paidAt: status === 'paid' ? new Date() : null,
          serviceLines: {
            create: {
              lineNumber: 1,
              procedureCode,
              units: 1,
              billedAmount,
              allowedAmount: status !== 'processing' ? allowedAmount : null,
              paidAmount,
              status: status === 'paid' ? 'approved' : status === 'denied' ? 'denied' : 'pending',
            },
          },
        },
      });
    } catch (e) {
      // Skip duplicates
    }
  }

  // ========================================
  // PAYMENT BATCHES
  // ========================================
  console.log('Creating payment batches...');
  for (let i = 0; i < 20; i++) {
    const provider = allProviders[i % allProviders.length];
    try {
      await prisma.paymentBatch.create({
        data: {
          batchNumber: `PAY-2026-${(i + 1).toString().padStart(3, '0')}`,
          providerId: provider.id,
          totalAmount: 5000 + Math.floor(Math.random() * 20000),
          claimCount: 10 + Math.floor(Math.random() * 40),
          paymentDate: new Date(2026, 0, 1 + (i * 3)),
          paymentMethod: i % 3 === 0 ? 'check' : 'ach',
          status: 'deposited',
          eraGenerated: true,
        },
      });
    } catch (e) {
      // Skip duplicates
    }
  }

  // ========================================
  // FEE SCHEDULES
  // ========================================
  console.log('Creating fee schedules...');
  const feeSchedule = await prisma.feeSchedule.create({
    data: {
      name: 'Standard PPO 2026',
      type: 'standard',
      effectiveDate: new Date('2026-01-01'),
      status: 'active',
    },
  });

  const feeScheduleRates = procedureCodes.map((code, i) => ({
    feeScheduleId: feeSchedule.id,
    procedureCode: code,
    allowedAmount: 50 + (i * 20),
    effectiveDate: new Date('2026-01-01'),
  }));

  await prisma.feeScheduleRate.createMany({
    data: feeScheduleRates,
    skipDuplicates: true,
  });

  // ========================================
  // INVOICES
  // ========================================
  console.log('Creating invoices...');
  for (let i = 0; i < 9; i++) {
    const employer = employers[i % 3];
    await prisma.invoice.create({
      data: {
        invoiceNumber: `INV-2026-${(i + 1).toString().padStart(4, '0')}`,
        employerId: employer.id,
        periodStart: new Date(2026, i % 3, 1),
        periodEnd: new Date(2026, i % 3 + 1, 0),
        premiumAmount: 50000 + Math.floor(Math.random() * 50000),
        adminFees: 2500,
        totalAmount: 52500 + Math.floor(Math.random() * 50000),
        dueDate: new Date(2026, i % 3 + 1, 15),
        status: i < 6 ? 'paid' : 'pending',
        paidDate: i < 6 ? new Date(2026, i % 3 + 1, 10) : null,
      },
    });
  }

  // ========================================
  // CREDENTIALING APPLICATIONS
  // ========================================
  console.log('Creating credentialing applications...');
  for (let i = 0; i < 3; i++) {
    await prisma.credentialingApplication.create({
      data: {
        providerId: providers[i].id,
        status: 'approved',
        submittedAt: new Date('2024-12-01'),
        reviewedAt: new Date('2024-12-15'),
        approvedAt: new Date('2024-12-20'),
        licenseNumber: `OH-MED-${100000 + i}`,
        licenseState: 'OH',
        licenseExpiry: new Date('2026-12-31'),
        deaNumber: `AB${1234567 + i}`,
        deaExpiry: new Date('2026-12-31'),
        malpracticeCarrier: 'Medical Mutual',
        malpracticeExpiry: new Date('2026-12-31'),
      },
    });
  }

  console.log('✅ Seed complete!');
  console.log('');
  console.log('Test credentials:');
  console.log('─────────────────');
  console.log('Member:   john.smith@email.com / demo123');
  console.log('Provider: dr.johnson@mainstreetmed.com / demo123');
  console.log('Employer: hr@acmecorp.com / demo123');
  console.log('Admin:    admin@truecarehealthnetwork.com / demo123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
