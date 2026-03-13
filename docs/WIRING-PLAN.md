# Clarity Health Network — Full Wiring Plan

**Purpose:** Connect Ted's UI to Architect's backend for 100% functional demo
**Goal:** E2E testing capability + live client demonstrations
**Status:** Ready to implement

---

## Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLARITY HEALTH                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   TED'S UI (Next.js)                                            │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  Marketing │ Member │ Provider │ Employer │ Admin       │   │
│   └──────────────────────────┬──────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│   API LAYER (Next.js API Routes)                                │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  /api/auth │ /api/members │ /api/providers │ /api/claims│   │
│   └──────────────────────────┬──────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│   ARCHITECT'S BACKEND MODULES                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  23 modules in ~/agent-hub/dokit-healthcare/modules/    │   │
│   └──────────────────────────┬──────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│   DATABASE (PostgreSQL)                                         │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  Members │ Providers │ Claims │ Payments │ Users │ etc. │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Database Setup

### 1.1 Install PostgreSQL
```bash
# If not installed
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb clarity_health_demo
```

### 1.2 Run Migrations
Each module has a `schema.sql` file. Run them in order:

```bash
# Location: ~/agent-hub/dokit-healthcare/modules/

# Core tables first
psql clarity_health_demo < shared/schema.sql
psql clarity_health_demo < admin-console/schema.sql

# Then modules (order matters for foreign keys)
psql clarity_health_demo < provider-directory/schema.sql
psql clarity_health_demo < provider-credentialing/schema.sql
psql clarity_health_demo < contract-management/schema.sql
psql clarity_health_demo < member-portal/schema.sql
psql clarity_health_demo < eligibility-engine/schema.sql
psql clarity_health_demo < claims-intake/schema.sql
psql clarity_health_demo < claims-status/schema.sql
psql clarity_health_demo < payment-integrity/schema.sql
psql clarity_health_demo < provider-payments/schema.sql
psql clarity_health_demo < nsa-compliance/schema.sql
psql clarity_health_demo < member-communications/schema.sql
psql clarity_health_demo < analytics-dashboard/schema.sql
psql clarity_health_demo < compliance-reporting/schema.sql
psql clarity_health_demo < financial-reporting/schema.sql
psql clarity_health_demo < fraud-detection/schema.sql
psql clarity_health_demo < workflow-engine/schema.sql
psql clarity_health_demo < pulse-ai-concierge/schema.sql
```

### 1.3 Environment Variables
Create `.env.local` in clarity-health-demo:

```env
# Database
DATABASE_URL=postgresql://localhost:5432/clarity_health_demo

# Auth
JWT_SECRET=your-super-secret-jwt-key-change-in-production
SESSION_SECRET=your-session-secret-key

# OpenAI (for Pulse AI)
OPENAI_API_KEY=sk-... (get from Chris)

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Phase 2: Authentication

### 2.1 Auth API Routes

Create `/app/api/auth/` routes:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/login` | POST | Login (email, password, portal type) |
| `/api/auth/logout` | POST | Clear session |
| `/api/auth/me` | GET | Get current user |
| `/api/auth/refresh` | POST | Refresh JWT token |

### 2.2 Login Flow
```typescript
// /api/auth/login/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  const { email, password, portalType } = await req.json();
  
  // portalType: 'member' | 'provider' | 'employer' | 'admin'
  
  let user;
  switch (portalType) {
    case 'member':
      user = await db.query('SELECT * FROM members WHERE email = $1', [email]);
      break;
    case 'provider':
      user = await db.query('SELECT * FROM providers WHERE email = $1', [email]);
      break;
    case 'employer':
      user = await db.query('SELECT * FROM employer_users WHERE email = $1', [email]);
      break;
    case 'admin':
      user = await db.query('SELECT * FROM admin_users WHERE email = $1', [email]);
      break;
  }
  
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  
  const token = jwt.sign(
    { id: user.id, email: user.email, role: portalType },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );
  
  return NextResponse.json({ token, user: { ...user, password_hash: undefined } });
}
```

### 2.3 Auth Middleware
```typescript
// /lib/auth.ts
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function verifyAuth(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) throw new Error('No token');
  return jwt.verify(token, process.env.JWT_SECRET);
}
```

### 2.4 Test Credentials (Seed Data)

| Portal | Email | Password |
|--------|-------|----------|
| Member | john.smith@email.com | demo123 |
| Provider | dr.johnson@mainstreetmed.com | demo123 |
| Employer | hr@acmecorp.com | demo123 |
| Admin | admin@clarityhealthnetwork.com | demo123 |

---

## Phase 3: API Routes by Portal

### 3.1 Member Portal APIs

| UI Screen | API Endpoint | Backend Module | What It Returns |
|-----------|--------------|----------------|-----------------|
| Dashboard | `GET /api/member/dashboard` | member-portal | Summary stats, recent claims, alerts |
| ID Card | `GET /api/member/id-card` | member-portal | Member info, plan details, barcode |
| ID Card PDF | `GET /api/member/id-card/pdf` | member-portal | Generated PDF |
| Benefits | `GET /api/member/benefits` | eligibility-engine | Coverage details, deductibles, OOP |
| Claims List | `GET /api/member/claims` | claims-status | Claims array with status |
| Claim Detail | `GET /api/member/claims/[id]` | claims-status | Single claim + EOB |
| Find Provider | `GET /api/member/providers` | provider-directory | Provider search results |
| Cost Estimator | `POST /api/member/cost-estimate` | nsa-compliance | QPA-based cost estimate |
| Messages | `GET /api/member/messages` | member-communications | Message threads |
| Documents | `GET /api/member/documents` | member-communications | EOBs, letters |
| Pulse Chat | `POST /api/pulse/chat` | pulse-ai-concierge | AI response |

### 3.2 Provider Portal APIs

| UI Screen | API Endpoint | Backend Module | What It Returns |
|-----------|--------------|----------------|-----------------|
| Dashboard | `GET /api/provider/dashboard` | provider-portal | Stats, alerts, recent payments |
| Profile | `GET /api/provider/profile` | provider-directory | Provider info |
| Profile Update | `PUT /api/provider/profile` | provider-directory | Updated provider |
| Locations | `GET /api/provider/locations` | provider-directory | Practice locations |
| Eligibility Check | `POST /api/provider/eligibility` | eligibility-engine | 270/271 response |
| Claims List | `GET /api/provider/claims` | claims-status | Provider's claims |
| Payments | `GET /api/provider/payments` | provider-payments | Payment history |
| Payment Detail | `GET /api/provider/payments/[id]` | provider-payments | ERA/835 details |
| Contracts | `GET /api/provider/contracts` | contract-management | Active contracts |
| Fee Schedule | `GET /api/provider/fee-schedule` | contract-management | Fee schedule rates |
| Credentialing | `GET /api/provider/credentialing` | provider-credentialing | Credential status |
| Documents | `GET /api/provider/documents` | provider-portal | Contracts, ERAs |
| Pulse Chat | `POST /api/pulse/chat` | pulse-ai-concierge | AI response |

### 3.3 Employer Portal APIs

| UI Screen | API Endpoint | Backend Module | What It Returns |
|-----------|--------------|----------------|-----------------|
| Dashboard | `GET /api/employer/dashboard` | analytics-dashboard | KPIs, spend, enrollment |
| Roster | `GET /api/employer/roster` | member-portal | Employee list |
| Add Employee | `POST /api/employer/roster` | member-portal | New enrollment |
| Employee Detail | `GET /api/employer/roster/[id]` | member-portal | Employee info |
| Analytics | `GET /api/employer/analytics` | analytics-dashboard | Charts data |
| Billing | `GET /api/employer/billing` | financial-reporting | Invoices |
| Pay Invoice | `POST /api/employer/billing/pay` | provider-payments | Payment confirmation |
| Reports | `GET /api/employer/reports` | financial-reporting | Report list |
| Generate Report | `POST /api/employer/reports` | financial-reporting | Report PDF |
| Enrollment | `GET /api/employer/enrollment` | member-portal | Enrollment period status |
| Documents | `GET /api/employer/documents` | compliance-reporting | SPD, notices |
| Stop-Loss | `GET /api/employer/stop-loss` | financial-reporting | ISL/ASL tracking |
| Pulse Chat | `POST /api/pulse/chat` | pulse-ai-concierge | AI response |

### 3.4 Admin Dashboard APIs

| UI Screen | API Endpoint | Backend Module | What It Returns |
|-----------|--------------|----------------|-----------------|
| Dashboard | `GET /api/admin/dashboard` | analytics-dashboard | System KPIs |
| Claims List | `GET /api/admin/claims` | claims-status | All claims |
| Claim Detail | `GET /api/admin/claims/[id]` | claims-status | Full claim data |
| Adjudicate | `POST /api/admin/claims/[id]/adjudicate` | claims-status | Adjudication result |
| Claims Intake | `GET /api/admin/claims-intake` | claims-intake | Incoming queue |
| Process 837 | `POST /api/admin/claims-intake/process` | claims-intake | Parsed claims |
| Providers | `GET /api/admin/providers` | provider-directory | Provider list |
| Provider Detail | `GET /api/admin/providers/[id]` | provider-directory | Full provider |
| Credentialing | `GET /api/admin/credentialing` | provider-credentialing | Applications |
| Approve Cred | `POST /api/admin/credentialing/[id]/approve` | provider-credentialing | Status update |
| Contracts | `GET /api/admin/contracts` | contract-management | All contracts |
| Create Contract | `POST /api/admin/contracts` | contract-management | New contract |
| Members | `GET /api/admin/members` | member-portal | Member list |
| Eligibility | `POST /api/admin/eligibility` | eligibility-engine | 270/271 |
| Payments | `GET /api/admin/payments` | provider-payments | Payment batches |
| Create Batch | `POST /api/admin/payments/batch` | provider-payments | New batch |
| Generate ERA | `POST /api/admin/payments/era` | provider-payments | 835 file |
| Fraud Alerts | `GET /api/admin/fraud` | fraud-detection | Alert queue |
| Payment Integrity | `POST /api/admin/payment-integrity` | payment-integrity | Check claim |
| NSA Compliance | `GET /api/admin/nsa` | nsa-compliance | QPA, IDR cases |
| Analytics | `GET /api/admin/analytics` | analytics-dashboard | Full analytics |
| Compliance | `GET /api/admin/compliance` | compliance-reporting | Reports |
| Financial | `GET /api/admin/financial` | financial-reporting | Financial reports |
| Communications | `GET /api/admin/communications` | member-communications | Templates, queue |
| Send EOB | `POST /api/admin/communications/eob` | member-communications | EOB sent |
| Workflows | `GET /api/admin/workflows` | workflow-engine | Active workflows |
| Tasks | `GET /api/admin/tasks` | workflow-engine | Task queue |
| Reference Data | `GET /api/admin/reference/[type]` | reference-data | ICD-10, CPT, etc. |
| Users | `GET /api/admin/users` | admin-console | Admin users |
| Audit Logs | `GET /api/admin/audit` | admin-console | PHI access logs |
| Settings | `GET /api/admin/settings` | admin-console | System config |
| Pulse Config | `GET /api/admin/pulse` | pulse-ai-concierge | AI config |

---

## Phase 4: Seed Data

### 4.1 Create Seed Script

Create `/scripts/seed.ts`:

```typescript
import { db } from '../lib/db';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Seeding database...');
  
  // Hash password for all test users
  const passwordHash = bcrypt.hashSync('demo123', 10);
  
  // === ADMIN USERS ===
  await db.query(`
    INSERT INTO admin_users (email, password_hash, name, role) VALUES
    ('admin@clarityhealthnetwork.com', $1, 'System Admin', 'super_admin'),
    ('claims@clarityhealthnetwork.com', $1, 'Claims Processor', 'claims_admin'),
    ('provider.relations@clarityhealthnetwork.com', $1, 'Provider Relations', 'provider_admin')
  `, [passwordHash]);
  
  // === EMPLOYER GROUPS ===
  await db.query(`
    INSERT INTO employer_groups (id, name, group_number, status, plan_type, effective_date) VALUES
    ('emp-001', 'Acme Corporation', 'GRP-12345', 'active', 'gold_ppo', '2025-01-01'),
    ('emp-002', 'TechStart Inc', 'GRP-12346', 'active', 'silver_ppo', '2025-01-01'),
    ('emp-003', 'Metro Healthcare', 'GRP-12347', 'active', 'platinum_ppo', '2025-01-01')
  `);
  
  // === EMPLOYER USERS ===
  await db.query(`
    INSERT INTO employer_users (email, password_hash, name, employer_id, role) VALUES
    ('hr@acmecorp.com', $1, 'Jane Wilson', 'emp-001', 'hr_admin'),
    ('benefits@acmecorp.com', $1, 'Mike Chen', 'emp-001', 'benefits_manager'),
    ('hr@techstart.com', $1, 'Sarah Johnson', 'emp-002', 'hr_admin')
  `, [passwordHash]);
  
  // === MEMBERS ===
  await db.query(`
    INSERT INTO members (id, employer_id, member_number, first_name, last_name, email, password_hash, 
                        date_of_birth, plan_type, status, effective_date) VALUES
    ('mem-001', 'emp-001', 'CLH-100001', 'John', 'Smith', 'john.smith@email.com', $1, 
     '1985-03-15', 'gold_ppo', 'active', '2025-01-01'),
    ('mem-002', 'emp-001', 'CLH-100002', 'Mary', 'Smith', 'mary.smith@email.com', $1,
     '1987-07-22', 'gold_ppo', 'active', '2025-01-01'),
    ('mem-003', 'emp-002', 'CLH-100003', 'Robert', 'Johnson', 'robert.j@email.com', $1,
     '1990-11-08', 'silver_ppo', 'active', '2025-01-01')
    -- Add 97 more members for 100 total
  `, [passwordHash]);
  
  // === PROVIDERS ===
  await db.query(`
    INSERT INTO providers (id, npi, name, email, password_hash, specialty, 
                          address, city, state, zip, phone, status) VALUES
    ('prov-001', '1234567890', 'Main Street Medical Group', 'dr.johnson@mainstreetmed.com', $1,
     'Family Medicine', '123 Main St', 'Cleveland', 'OH', '44101', '216-555-0100', 'active'),
    ('prov-002', '1234567891', 'Cleveland Orthopedics', 'admin@cleveortho.com', $1,
     'Orthopedic Surgery', '456 Health Ave', 'Cleveland', 'OH', '44102', '216-555-0200', 'active'),
    ('prov-003', '1234567892', 'Metro Cardiology', 'office@metrocardio.com', $1,
     'Cardiology', '789 Heart Blvd', 'Cleveland', 'OH', '44103', '216-555-0300', 'active')
    -- Add 247 more providers for 250 total
  `, [passwordHash]);
  
  // === CONTRACTS ===
  await db.query(`
    INSERT INTO contracts (id, provider_id, contract_type, fee_schedule, effective_date, status) VALUES
    ('con-001', 'prov-001', 'percent_of_medicare', '{"percent": 150}', '2025-01-01', 'active'),
    ('con-002', 'prov-002', 'percent_of_medicare', '{"percent": 175}', '2025-01-01', 'active'),
    ('con-003', 'prov-003', 'fee_schedule', '{"schedule_id": "cardio-2025"}', '2025-01-01', 'active')
  `);
  
  // === CLAIMS ===
  await db.query(`
    INSERT INTO claims (id, member_id, provider_id, service_date, claim_number,
                       procedure_code, diagnosis_code, billed_amount, allowed_amount,
                       member_responsibility, status, created_at) VALUES
    ('clm-001', 'mem-001', 'prov-001', '2026-03-01', 'CLM-2026-00001',
     '99213', 'J06.9', 150.00, 95.00, 20.00, 'paid', NOW() - INTERVAL '10 days'),
    ('clm-002', 'mem-001', 'prov-002', '2026-03-05', 'CLM-2026-00002',
     '99214', 'M54.5', 250.00, 175.00, 35.00, 'pending', NOW() - INTERVAL '5 days'),
    ('clm-003', 'mem-002', 'prov-001', '2026-02-28', 'CLM-2026-00003',
     '99212', 'Z00.00', 85.00, 65.00, 15.00, 'paid', NOW() - INTERVAL '15 days')
    -- Add 997 more claims for 1000 total
  `);
  
  // === PAYMENTS ===
  await db.query(`
    INSERT INTO payment_batches (id, batch_number, provider_id, amount, payment_date, status) VALUES
    ('pay-001', 'PAY-2026-001', 'prov-001', 12450.00, '2026-03-11', 'deposited'),
    ('pay-002', 'PAY-2026-002', 'prov-002', 8230.00, '2026-03-04', 'deposited'),
    ('pay-003', 'PAY-2026-003', 'prov-003', 15100.00, '2026-02-25', 'deposited')
  `);
  
  console.log('✅ Seed complete!');
}

seed().catch(console.error);
```

### 4.2 Generate More Realistic Data

For 100 members, 250 providers, 1000 claims — use a data generator:

```bash
# Create seed data generator
npx tsx scripts/generate-seed-data.ts
```

---

## Phase 5: Wire Each Screen

### 5.1 Example: Member Dashboard

```typescript
// /app/member/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function MemberDashboard() {
  const { user, token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      const res = await fetch('/api/member/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setData(data);
      setLoading(false);
    }
    fetchDashboard();
  }, [token]);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1>Welcome, {user.first_name}!</h1>
      
      {/* Deductible Progress */}
      <DeductibleCard 
        used={data.deductible.used} 
        max={data.deductible.max} 
      />
      
      {/* Recent Claims */}
      <RecentClaimsTable claims={data.recentClaims} />
      
      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
}
```

### 5.2 Example: API Route

```typescript
// /app/api/member/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const user = verifyAuth(req);
    
    // Get member details
    const member = await db.query(
      'SELECT * FROM members WHERE id = $1',
      [user.id]
    );
    
    // Get deductible status
    const deductible = await db.query(`
      SELECT 
        COALESCE(SUM(member_responsibility), 0) as used,
        (SELECT deductible_amount FROM plans WHERE id = $1) as max
      FROM claims 
      WHERE member_id = $2 
        AND EXTRACT(YEAR FROM service_date) = EXTRACT(YEAR FROM NOW())
    `, [member.plan_type, user.id]);
    
    // Get recent claims
    const recentClaims = await db.query(`
      SELECT c.*, p.name as provider_name
      FROM claims c
      JOIN providers p ON c.provider_id = p.id
      WHERE c.member_id = $1
      ORDER BY c.service_date DESC
      LIMIT 5
    `, [user.id]);
    
    return NextResponse.json({
      member,
      deductible: deductible.rows[0],
      recentClaims: recentClaims.rows
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
```

---

## Phase 6: Integration with Backend Modules

### 6.1 Import Backend Services

```typescript
// /lib/services.ts
// Import Architect's backend modules

import { EligibilityService } from '../../dokit-healthcare/modules/eligibility-engine/services/eligibility.service';
import { ClaimsService } from '../../dokit-healthcare/modules/claims-status/services/claims.service';
import { ProviderService } from '../../dokit-healthcare/modules/provider-directory/services/provider.service';
import { PaymentService } from '../../dokit-healthcare/modules/provider-payments/services/payment.service';
import { FraudService } from '../../dokit-healthcare/modules/fraud-detection/services/fraud.service';
import { PulseService } from '../../dokit-healthcare/modules/pulse-ai-concierge/services/chat-engine.service';

// Initialize with database connection
const db = getDbConnection();

export const eligibilityService = new EligibilityService(db);
export const claimsService = new ClaimsService(db);
export const providerService = new ProviderService(db);
export const paymentService = new PaymentService(db);
export const fraudService = new FraudService(db);
export const pulseService = new PulseService(db);
```

### 6.2 Use Services in API Routes

```typescript
// /app/api/provider/eligibility/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { eligibilityService } from '@/lib/services';
import { verifyAuth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const user = verifyAuth(req);
  const { memberNumber, dateOfBirth } = await req.json();
  
  // Use Architect's eligibility engine
  const result = await eligibilityService.checkEligibility({
    memberNumber,
    dateOfBirth,
    providerId: user.id,
    serviceDate: new Date()
  });
  
  return NextResponse.json(result);
}
```

---

## Phase 7: Testing Checklist

### 7.1 Auth Flow
- [ ] Member can login at `/login` with portal selection
- [ ] Provider can login
- [ ] Employer can login  
- [ ] Admin can login
- [ ] Invalid credentials show error
- [ ] Session persists across pages
- [ ] Logout clears session

### 7.2 Member Portal
- [ ] Dashboard loads with real data
- [ ] ID card displays member info
- [ ] ID card PDF generates and downloads
- [ ] Benefits show correct deductible/OOP
- [ ] Claims list shows member's claims
- [ ] Claim detail shows EOB
- [ ] Provider search returns results
- [ ] Cost estimator calculates price
- [ ] Pulse AI responds to questions

### 7.3 Provider Portal
- [ ] Dashboard shows stats
- [ ] Profile displays provider info
- [ ] Profile can be edited
- [ ] Eligibility check works (real 270/271)
- [ ] Claims list shows provider's claims
- [ ] Payments show with ERA details
- [ ] Contracts display fee schedules
- [ ] Credentialing shows status

### 7.4 Employer Portal
- [ ] Dashboard shows KPIs
- [ ] Roster lists employees
- [ ] Can add new employee
- [ ] Analytics charts render
- [ ] Invoices display
- [ ] Reports generate
- [ ] Stop-loss tracking works

### 7.5 Admin Dashboard
- [ ] Dashboard shows system KPIs
- [ ] Can view/adjudicate claims
- [ ] Can approve credentialing
- [ ] Can create payment batch
- [ ] Fraud alerts display
- [ ] All reports generate
- [ ] Audit logs track actions

---

## Summary: What To Do

### Step 1: Database (Day 1)
1. Install PostgreSQL
2. Create database
3. Run all migrations
4. Run seed script

### Step 2: Auth (Day 1-2)
1. Create auth API routes
2. Implement JWT flow
3. Add auth middleware
4. Test login for all portals

### Step 3: API Routes (Day 2-5)
1. Create `/api/member/*` routes
2. Create `/api/provider/*` routes
3. Create `/api/employer/*` routes
4. Create `/api/admin/*` routes
5. Wire to backend services

### Step 4: UI Wiring (Day 5-10)
1. Add fetch calls to each screen
2. Display real data
3. Add loading states
4. Handle errors

### Step 5: Testing (Day 10-14)
1. Test each flow E2E
2. Fix bugs
3. Demo run-through

---

## Questions?

Contact Architect for:
- Backend module APIs
- Database schema questions
- Service integration help

📐 **Architect**
