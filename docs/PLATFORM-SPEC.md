# Clarity Health Network — Complete Platform Specification

**Project:** Fully Functional PPO Platform Demo
**Purpose:** 100% operational platform for client demonstrations and licensing sales
**Brand:** Clarity Health Network (demo brand name)
**Status:** PRODUCTION BUILD (not mockup, not static pages)

---

## Executive Summary

We are building a **complete, fully functional PPO platform** that operates exactly as it would for a paying client. This includes:

- **Marketing Site** — Public-facing website explaining the PPO
- **Member Portal** — Self-service portal for PPO members
- **Provider Portal** — Self-service portal for network providers
- **Employer Portal** — Self-service portal for HR/benefits administrators
- **Admin Dashboard** — Full administrative console with all 23 modules
- **Pulse AI** — AI assistant integrated into all portals

This is NOT a demo with fake buttons. Every feature must work. We use sandbox/test data, but the functionality is production-ready.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     AMERICAN PPO PLATFORM                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  PUBLIC LAYER                                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Marketing Site (clarityhealthnetwork.com)                          │ │
│  │  - Homepage, About, Network, Members, Providers, Contact   │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  AUTHENTICATED PORTALS                                           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────────┐ │
│  │   Member    │ │  Provider   │ │  Employer   │ │   Admin    │ │
│  │   Portal    │ │   Portal    │ │   Portal    │ │ Dashboard  │ │
│  │  /member/*  │ │ /provider/* │ │ /employer/* │ │  /admin/*  │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └────────────┘ │
│                                                                  │
│  AI LAYER                                                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Pulse AI Concierge (embedded chat in all portals)         │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  BACKEND (Architect's 23 Modules)                               │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Claims │ Eligibility │ Payments │ Credentialing │ etc.    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  DATA LAYER                                                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  PostgreSQL │ Redis │ Test/Sandbox Data                    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Part 1: Marketing Site

### Overview
Public website that explains Clarity Health Network to prospective members, providers, and employers.

### Pages Required

| Page | URL | Purpose |
|------|-----|---------|
| Homepage | `/` | Hero, value prop, key benefits, CTAs |
| About Us | `/about` | Company story, mission, leadership |
| How It Works | `/how-it-works` | PPO explanation, network benefits |
| For Members | `/members` | Member benefits, how to use, link to portal |
| For Providers | `/providers` | Provider benefits, join network, link to portal |
| For Employers | `/employers` | Group plans, cost savings, contact sales |
| Find a Provider | `/find-provider` | Provider directory search (public) |
| Contact | `/contact` | Contact form, phone, email, address |
| Login | `/login` | Portal selection (Member/Provider/Admin) |

### Homepage Sections

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER                                                       │
│ Logo | About | Members | Providers | Employers | Find Doc | Login │
├─────────────────────────────────────────────────────────────┤
│ HERO SECTION                                                 │
│ "Quality Healthcare. Nationwide Network. Real Savings."     │
│ [Find a Provider] [Member Login] [Provider Login]           │
├─────────────────────────────────────────────────────────────┤
│ STATS BAR                                                    │
│ 50,000+ Providers | 500+ Hospitals | 40% Avg Savings | 50 States │
├─────────────────────────────────────────────────────────────┤
│ HOW IT WORKS                                                 │
│ 1. Find Provider → 2. Show ID → 3. Save Money              │
├─────────────────────────────────────────────────────────────┤
│ FOR MEMBERS                           FOR PROVIDERS         │
│ - Access network                      - Join our network    │
│ - Digital ID cards                    - Fast payments       │
│ - Online claims                       - Easy credentialing  │
│ [Member Portal →]                     [Provider Portal →]   │
├─────────────────────────────────────────────────────────────┤
│ TESTIMONIALS                                                 │
│ "Saved $3,000 on surgery" — Member                          │
│ "Payments within 14 days" — Provider                        │
├─────────────────────────────────────────────────────────────┤
│ PULSE AI PREVIEW                                             │
│ "Have questions? Chat with Pulse, our AI assistant"         │
│ [Chat Now]                                                   │
├─────────────────────────────────────────────────────────────┤
│ FOOTER                                                       │
│ Links | Contact | Privacy | Terms | © 2026 Clarity Health Network     │
└─────────────────────────────────────────────────────────────┘
```

### Design Requirements
- Professional healthcare aesthetic
- Trust signals (certifications, security badges)
- Mobile responsive
- Fast loading
- Clear CTAs to portals

---

## Part 2: Member Portal

### Overview
Self-service portal for PPO members to manage their healthcare.

### Authentication
- Email/password login
- MFA support (optional for demo)
- Session timeout (15 min idle)
- Password reset flow

### Screens Required

| Screen | URL | Purpose |
|--------|-----|---------|
| Login | `/member/login` | Member authentication |
| Dashboard | `/member/dashboard` | Overview, quick actions |
| ID Card | `/member/id-card` | Digital ID card, download/print |
| Benefits | `/member/benefits` | Coverage details, deductibles, OOP |
| Claims | `/member/claims` | Claims list, status, EOBs |
| Claim Detail | `/member/claims/:id` | Single claim details, EOB |
| Find Provider | `/member/find-provider` | Provider search with filters |
| Cost Estimator | `/member/cost-estimator` | Estimate procedure costs |
| Messages | `/member/messages` | Secure messaging |
| Documents | `/member/documents` | EOBs, letters, forms |
| Settings | `/member/settings` | Profile, password, preferences |
| Pulse AI | `/member/pulse` | Full-page AI assistant |

### Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER: Logo | Dashboard | Claims | Providers | Messages | ⚙️ │
├──────────────────┬──────────────────────────────────────────┤
│                  │                                          │
│  SIDEBAR         │  MAIN CONTENT                           │
│                  │                                          │
│  👤 John Smith   │  ┌─────────────────────────────────────┐ │
│  Member ID: 12345│  │ WELCOME BACK, JOHN                  │ │
│                  │  │ Your plan: Gold PPO                 │ │
│  ─────────────── │  └─────────────────────────────────────┘ │
│  📊 Dashboard    │                                          │
│  💳 ID Card      │  ┌─────────────┐ ┌─────────────┐        │
│  📋 Benefits     │  │ DEDUCTIBLE  │ │ OUT OF PKT  │        │
│  📄 Claims       │  │ $850/$1500  │ │ $2100/$6000 │        │
│  🔍 Find Doctor  │  │ ████████░░  │ │ ███░░░░░░░  │        │
│  💰 Cost Est.    │  └─────────────┘ └─────────────┘        │
│  ✉️ Messages     │                                          │
│  📁 Documents    │  RECENT CLAIMS                          │
│  ⚙️ Settings     │  ┌─────────────────────────────────────┐ │
│                  │  │ 03/10 - Dr. Smith - $150 - Paid    │ │
│  ─────────────── │  │ 03/05 - Quest Labs - $85 - Pending │ │
│                  │  │ 02/28 - Urgent Care - $200 - Paid  │ │
│  🤖 Chat with    │  └─────────────────────────────────────┘ │
│     Pulse AI     │                                          │
│                  │  QUICK ACTIONS                          │
│                  │  [View ID Card] [Find Provider] [Chat]  │
└──────────────────┴──────────────────────────────────────────┘
```

### ID Card Features
- Display member info (name, ID, group, plan)
- Display coverage dates
- Download as PDF
- Add to Apple Wallet
- Add to Google Pay
- Print option

### Claims Features
- List all claims with filters (date, status, provider)
- Status indicators (Pending, Processing, Paid, Denied)
- View EOB for each claim
- Download EOB as PDF
- Search claims

### Benefits Features
- Plan summary (deductible, OOP max, copays)
- Coverage details by service type
- In-network vs out-of-network benefits
- Progress bars for deductible/OOP tracking

### Find Provider Features
- Search by name, specialty, location
- Map view with pins
- Filter by distance, accepting new patients, language
- Provider details (address, phone, hours, specialties)
- "Get Directions" link

### Pulse AI Integration
- Floating chat widget on all pages
- Full-page chat option
- Can answer: benefits questions, claim status, find providers, cost estimates
- Handoff to human support option

---

## Part 3: Provider Portal

### Overview
Self-service portal for network providers to manage their participation.

### Authentication
- Email/password login
- MFA required (healthcare compliance)
- Session timeout (15 min idle)
- Password reset flow

### Screens Required

| Screen | URL | Purpose |
|--------|-----|---------|
| Login | `/provider/login` | Provider authentication |
| Dashboard | `/provider/dashboard` | Overview, alerts, quick stats |
| Profile | `/provider/profile` | Provider info, credentials |
| Locations | `/provider/locations` | Practice locations |
| Contracts | `/provider/contracts` | Active contracts, fee schedules |
| Eligibility | `/provider/eligibility` | Check member eligibility |
| Claims | `/provider/claims` | Claims submitted, status |
| Payments | `/provider/payments` | Payment history, remittance |
| Documents | `/provider/documents` | Contracts, tax forms, ERA |
| Credentialing | `/provider/credentialing` | Credential status, renewals |
| Messages | `/provider/messages` | Secure messaging |
| Settings | `/provider/settings` | Account settings |
| Pulse AI | `/provider/pulse` | AI assistant |

### Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER: Logo | Dashboard | Eligibility | Claims | Payments | ⚙️ │
├──────────────────┬──────────────────────────────────────────┤
│                  │                                          │
│  SIDEBAR         │  MAIN CONTENT                           │
│                  │                                          │
│  🏥 Main Street  │  ┌─────────────────────────────────────┐ │
│     Medical      │  │ WELCOME, DR. JOHNSON                │ │
│  NPI: 1234567890 │  │ Last login: Today 9:15 AM          │ │
│                  │  └─────────────────────────────────────┘ │
│  ─────────────── │                                          │
│  📊 Dashboard    │  ┌────────┐ ┌────────┐ ┌────────┐       │
│  👤 Profile      │  │ CLAIMS │ │PAYMENTS│ │PENDING │       │
│  📍 Locations    │  │  147   │ │$45,230 │ │   12   │       │
│  📜 Contracts    │  │ MTD    │ │ MTD    │ │ Claims │       │
│  ✅ Eligibility  │  └────────┘ └────────┘ └────────┘       │
│  📄 Claims       │                                          │
│  💵 Payments     │  ALERTS                                  │
│  📁 Documents    │  ⚠️ License expires in 30 days          │
│  🏅 Credentials  │  ⚠️ 3 claims need attention             │
│  ✉️ Messages     │                                          │
│  ⚙️ Settings     │  RECENT PAYMENTS                        │
│                  │  ┌─────────────────────────────────────┐ │
│  ─────────────── │  │ 03/11 - $12,450 - ACH - Deposited  │ │
│  🤖 Chat with    │  │ 03/04 - $8,230 - ACH - Deposited   │ │
│     Pulse AI     │  │ 02/25 - $15,100 - ACH - Deposited  │ │
│                  │  └─────────────────────────────────────┘ │
└──────────────────┴──────────────────────────────────────────┘
```

### Eligibility Check Features
- Real-time member lookup
- Enter Member ID or Name + DOB
- Returns: eligibility status, coverage, deductible remaining, copay amounts
- Print/save verification
- Batch eligibility (upload list)

### Claims Features
- View all submitted claims
- Filter by date, status, member, amount
- Claim status tracking
- View denial reasons
- Resubmit corrected claims
- Download claim data

### Payments Features
- Payment history
- View ERA/835 (remittance advice)
- Download ERA as PDF
- Reconciliation tools
- Payment preferences (ACH setup)

### Credentialing Features
- View credential status
- See expiring credentials
- Upload renewal documents
- Track application status

### Pulse AI Integration
- Floating chat widget
- Can answer: eligibility questions, claim status, payment inquiries, credentialing status
- Can perform: eligibility checks, payment lookups

---

## Part 4: Employer Portal

### Overview
Self-service portal for HR administrators and benefits managers of employer groups who purchase coverage through the PPO network.

### Authentication
- Email/password login
- MFA support
- Role-based access (HR Admin, Benefits Manager, CFO, Read-Only)
- Multi-user per employer
- Session timeout (15 min idle)

### Screens Required

| Screen | URL | Purpose |
|--------|-----|---------|
| Login | `/employer/login` | Employer authentication |
| Dashboard | `/employer/dashboard` | KPIs, spend summary, alerts |
| Employee Roster | `/employer/roster` | View/manage enrolled employees |
| Add Employee | `/employer/roster/add` | Enroll new employee |
| Employee Detail | `/employer/roster/:id` | Single employee details |
| Claims Analytics | `/employer/analytics` | Spending trends, utilization |
| Billing | `/employer/billing` | Invoices, payment history |
| Reports | `/employer/reports` | Download/schedule reports |
| Open Enrollment | `/employer/enrollment` | Manage enrollment periods |
| Documents | `/employer/documents` | SPD, compliance, notices |
| Stop-Loss | `/employer/stop-loss` | Attachment point tracking |
| Support | `/employer/support` | Tickets, contact TPA |
| Settings | `/employer/settings` | Company info, users, preferences |

### Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER: Clarity Health | Acme Corp | 👤 HR Admin            │
├──────────────────┬──────────────────────────────────────────┤
│                  │                                          │
│  SIDEBAR         │  EMPLOYER DASHBOARD                      │
│                  │                                          │
│  🏢 Acme Corp    │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│  Group #: 12345  │  │ENROLLED│ │ CLAIMS │ │  MTD   │ │  YTD   │
│                  │  │MEMBERS │ │  MTD   │ │ SPEND  │ │ SPEND  │
│  ─────────────── │  │  847   │ │  234   │ │ $125K  │ │ $1.2M  │
│  📊 Dashboard    │  └────────┘ └────────┘ └────────┘ └────────┘
│  👥 Roster       │                                          │
│  📈 Analytics    │  ┌─────────────────┐ ┌─────────────────┐ │
│  💳 Billing      │  │ CLAIMS BY TYPE  │ │ MONTHLY TREND   │ │
│  📄 Reports      │  │ [Pie Chart]     │ │ [Line Chart]    │ │
│  📅 Enrollment   │  └─────────────────┘ └─────────────────┘ │
│  📁 Documents    │                                          │
│  🛡️ Stop-Loss    │  ALERTS                                  │
│  🎫 Support      │  ⚠️ Open enrollment ends in 14 days      │
│  ⚙️ Settings     │  ⚠️ Invoice #4521 due in 7 days          │
│                  │  ℹ️ 3 new employees pending enrollment   │
│  ─────────────── │                                          │
│  🤖 Chat with    │  RECENT ACTIVITY                         │
│     Pulse AI     │  • John Smith enrolled - 03/10           │
│                  │  • Claim $2,340 processed - 03/09        │
│                  │  • Invoice #4520 paid - 03/08            │
└──────────────────┴──────────────────────────────────────────┘
```

### Employee Roster Features
- List all enrolled employees with search/filter
- Status indicators (Active, COBRA, Termed, Pending)
- Add new employee (enrollment wizard)
- Edit employee information
- Terminate coverage
- Add/remove dependents
- View employee's claims summary (no PHI details)
- Export roster to CSV
- Bulk import employees

### Claims Analytics Features
- Total spend by month (chart)
- Claims by category (Medical, Rx, Dental, Vision)
- High-cost claimants (anonymized)
- Utilization metrics (ER visits, preventive care, etc.)
- Benchmark vs similar employers
- Cost projections
- Loss ratio tracking

### Billing Features
- View current invoice
- Invoice history
- Pay invoice online (ACH, card)
- Download invoice PDF
- Billing contact management
- Auto-pay setup
- Payment history

### Reports Features
- Pre-built report templates:
  - Monthly Utilization Summary
  - Claims Detail (anonymized)
  - Enrollment Census
  - Cost Trend Analysis
  - Stop-Loss Proximity
  - ERISA Compliance
- Schedule reports (weekly, monthly, quarterly)
- Email delivery
- Download as PDF, Excel, CSV

### Open Enrollment Features
- Set enrollment period dates
- Track enrollment progress
- Employee self-service enrollment status
- Reminder notifications
- Plan change tracking
- New hire enrollment queue

### Documents Features
- Summary Plan Description (SPD)
- ERISA required notices
- COBRA notices
- HIPAA certificates
- Plan amendments
- Compliance calendar
- Document upload/download

### Stop-Loss Tracking Features
- Individual stop-loss (ISL) tracking
  - Per-member attachment point progress
  - High-cost claimant alerts
- Aggregate stop-loss (ASL) tracking
  - Total claims vs corridor
  - Projection to year-end
- Reimbursement status
- Carrier contact info

### Pulse AI Integration
- Floating chat widget
- Can answer: enrollment questions, billing inquiries, report requests, coverage questions
- Can perform: generate reports, lookup employee status, explain benefits

---

## Part 5: Admin Dashboard

### Overview
Complete administrative console with all 23 healthcare modules.

### Authentication
- Email/password login
- MFA required
- Role-based access control
- Session timeout (15 min idle)
- Audit logging for all actions

### Module Organization

```
ADMIN DASHBOARD SIDEBAR

📊 Dashboard (Home)

CLAIMS MANAGEMENT
├── 📥 Claims Intake
├── 📋 Claims Status
├── 🔍 Payment Integrity
├── ⚖️ NSA Compliance
└── 💵 Provider Payments

PROVIDER MANAGEMENT  
├── 🏥 Provider Directory
├── 📝 Credentialing
├── 📜 Contracts
└── 🌐 Provider Portal Admin

MEMBER MANAGEMENT
├── 👥 Member Database
├── ✅ Eligibility
├── 📨 Communications
└── 🌐 Member Portal Admin

ANALYTICS & REPORTING
├── 📈 Analytics Dashboard
├── 📊 Financial Reports
├── 📋 Compliance Reports
└── 🚨 Fraud Detection

ADMINISTRATION
├── 👤 User Management
├── 🏢 Tenant Settings
├── ⚙️ System Config
├── 📜 Audit Logs
└── 🔧 Integrations

AI & AUTOMATION
├── 🤖 Pulse AI Config
├── 🔄 Workflow Engine
└── 📚 Reference Data
```

### Admin Dashboard Home

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER: Clarity Health Network Admin | 🔔 Notifications | 👤 Admin    │
├──────────────────┬──────────────────────────────────────────┤
│                  │                                          │
│  SIDEBAR         │  DASHBOARD                               │
│  (Module Nav)    │                                          │
│                  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│                  │  │CLAIMS  │ │PEND.   │ │PAID    │ │DENIED│ │
│                  │  │ TODAY  │ │CLAIMS  │ │ TODAY  │ │TODAY │ │
│                  │  │  234   │ │  892   │ │$125K   │ │  12  │ │
│                  │  └────────┘ └────────┘ └────────┘ └────────┘
│                  │                                          │
│                  │  ┌─────────────────┐ ┌─────────────────┐ │
│                  │  │ CLAIMS VOLUME   │ │ SAVINGS RATE    │ │
│                  │  │ [Chart 30 days] │ │ [Chart 30 days] │ │
│                  │  └─────────────────┘ └─────────────────┘ │
│                  │                                          │
│                  │  ALERTS                                  │
│                  │  🔴 3 High-priority fraud alerts         │
│                  │  🟡 12 Credentials expiring this week    │
│                  │  🟡 5 Claims pending > 30 days           │
│                  │                                          │
│                  │  RECENT ACTIVITY                         │
│                  │  • Claim #4521 approved - $2,340         │
│                  │  • Provider Dr. Smith credentialed       │
│                  │  • Payment batch #89 processed - $45K    │
│                  │                                          │
└──────────────────┴──────────────────────────────────────────┘
```

### Key Admin Screens (Per Module)

#### Claims Intake
- Receive 837 claims (upload or API)
- Parse and validate claims
- View claim queue
- Manual claim entry
- Claim editing

#### Claims Status
- All claims with advanced filters
- Status workflow (Received → Validated → Adjudicated → Paid/Denied)
- Claim detail view
- Adjustment/void claims
- Appeal processing

#### Payment Integrity
- CCI edit violations
- MUE violations
- Duplicate claim detection
- Fraud alerts queue
- Provider pattern analysis

#### NSA Compliance
- QPA calculations
- Good Faith Estimates
- IDR case management
- Compliance dashboard
- Audit reports

#### Provider Payments
- Payment batch creation
- ACH file generation
- ERA/835 generation
- Payment reconciliation
- Virtual card management

#### Provider Directory
- All providers in network
- Provider search/filter
- Provider detail/edit
- Network adequacy reports
- Map view

#### Credentialing
- Application queue
- PSV (primary source verification) status
- Committee reviews
- Credential tracking
- Expiration alerts

#### Contracts
- Contract creation wizard
- Fee schedule management
- Contract templates
- Amendment processing
- Expiration tracking

#### Eligibility
- Real-time eligibility checks
- 270/271 transaction logs
- Member coverage details
- Batch eligibility

#### Communications
- EOB generation
- Member notifications
- Email/mail/portal delivery
- Template management
- Delivery tracking

#### Analytics Dashboard
- Executive dashboard
- Claims analytics
- Financial analytics
- Provider analytics
- Custom report builder

#### Compliance Reports
- HIPAA reports
- NCQA reports
- State regulatory reports
- Audit preparation

#### Financial Reports
- Revenue analysis
- AR aging
- Profitability analysis
- Client billing

#### Fraud Detection
- Fraud alerts queue
- Investigation workflow
- Provider/member profiles
- Pattern detection
- Case management

#### User Management
- User list
- Role assignment
- MFA management
- Session management
- Activity logs

#### Audit Logs
- All system activity
- PHI access logs
- Search/filter
- Export for compliance

#### Pulse AI Config
- Knowledge base management
- Response templates
- Analytics
- Training data

#### Workflow Engine
- Workflow definitions
- Task queues
- Business rules
- Escalation policies

---

## Part 5: Pulse AI Integration

### Overview
AI assistant embedded in all portals with context-aware capabilities.

### Integration Points

| Portal | Capabilities |
|--------|--------------|
| Member | Benefits Q&A, claim status, find provider, cost estimate, ID card request |
| Provider | Eligibility check, claim status, payment inquiry, credentialing status |
| Admin | Data lookup, report generation, workflow assistance |

### Chat Widget Spec

```
┌─────────────────────────────┐
│ 🤖 Pulse AI           ─ ✕  │
├─────────────────────────────┤
│                             │
│  Hi! I'm Pulse, your AI    │
│  healthcare assistant.      │
│                             │
│  How can I help you today? │
│                             │
│  ┌─────────────────────┐   │
│  │ Check my benefits   │   │
│  └─────────────────────┘   │
│  ┌─────────────────────┐   │
│  │ Find a doctor       │   │
│  └─────────────────────┘   │
│  ┌─────────────────────┐   │
│  │ Claim status        │   │
│  └─────────────────────┘   │
│                             │
├─────────────────────────────┤
│  Type a message...     📎 ➤│
└─────────────────────────────┘
```

### Capabilities by Portal

**Member Portal Pulse:**
- "What's my deductible?" → Returns current deductible status
- "Find an orthopedist near me" → Searches provider directory
- "What's the status of my claim from March 5th?" → Looks up claim
- "How much would an MRI cost?" → Runs cost estimator
- "I need a new ID card" → Initiates ID card request

**Provider Portal Pulse:**
- "Check eligibility for member 12345" → Runs eligibility check
- "What's the status of claim 98765?" → Looks up claim
- "When is my next payment?" → Checks payment schedule
- "My license is expiring, what do I do?" → Credentialing guidance

**Admin Portal Pulse:**
- "Show me pending claims over $10,000" → Queries claims
- "How many providers are expiring this month?" → Runs report
- "What's our average claim turnaround time?" → Analytics query

---

## Part 6: Technical Requirements

### Stack
- **Frontend:** Next.js 14, React, Tailwind CSS
- **Backend:** Node.js, Express (or Next.js API routes)
- **Database:** PostgreSQL
- **Cache:** Redis
- **AI:** OpenAI API (GPT-4)
- **Auth:** JWT with refresh tokens
- **Hosting:** Railway (initially), AWS (production)

### Backend Modules (Already Built)
All 23 modules are complete in `~/agent-hub/dokit-healthcare/modules/`:
- claims-intake
- claims-status
- payment-integrity
- nsa-compliance
- provider-payments
- provider-directory
- provider-credentialing
- contract-management
- provider-portal
- member-portal
- eligibility-engine
- member-communications
- analytics-dashboard
- compliance-reporting
- financial-reporting
- fraud-detection
- admin-console
- pulse-ai-concierge
- workflow-engine
- reference-data
- (+ shared libraries)

### Database
- Use PostgreSQL with schemas from each module
- Run all migrations
- Seed with test data

### Sample Data Requirements

| Entity | Quantity | Notes |
|--------|----------|-------|
| Members | 100 | Various plans, coverage levels |
| Providers | 250 | Mix of specialties, locations |
| Claims | 1,000 | Various statuses, dates |
| Payments | 100 | Various amounts, methods |
| Contracts | 50 | Different fee schedules |
| Users | 20 | Admin, staff, support roles |

---

## Part 7: Build Phases

### Phase 1: Foundation (Week 1)
- [ ] Set up Next.js project structure
- [ ] Configure Tailwind with design system
- [ ] Set up PostgreSQL database
- [ ] Run all module migrations
- [ ] Create seed data scripts
- [ ] Set up authentication system
- [ ] Deploy to Railway (staging)

### Phase 2: Marketing Site (Week 1-2)
- [ ] Homepage
- [ ] About page
- [ ] How It Works page
- [ ] For Members page
- [ ] For Providers page
- [ ] For Employers page
- [ ] Find Provider (public search)
- [ ] Contact page
- [ ] Login page (portal selector)

### Phase 3: Member Portal (Week 2-3)
- [ ] Login/auth flow
- [ ] Dashboard
- [ ] ID Card (with download/wallet)
- [ ] Benefits view
- [ ] Claims list + detail
- [ ] Find Provider
- [ ] Cost Estimator
- [ ] Messages
- [ ] Documents
- [ ] Settings
- [ ] Pulse AI widget

### Phase 4: Provider Portal (Week 3-4)
- [ ] Login/auth flow
- [ ] Dashboard
- [ ] Profile management
- [ ] Locations
- [ ] Contracts view
- [ ] Eligibility checker
- [ ] Claims list + detail
- [ ] Payments + ERA
- [ ] Documents
- [ ] Credentialing status
- [ ] Messages
- [ ] Settings
- [ ] Pulse AI widget

### Phase 5: Admin Dashboard (Week 4-6)
- [ ] Login/auth + RBAC
- [ ] Main dashboard
- [ ] Claims Intake module
- [ ] Claims Status module
- [ ] Payment Integrity module
- [ ] Provider Payments module
- [ ] Provider Directory module
- [ ] Credentialing module
- [ ] Contracts module
- [ ] Eligibility module
- [ ] Communications module
- [ ] Analytics Dashboard
- [ ] Compliance Reports
- [ ] Financial Reports
- [ ] Fraud Detection
- [ ] User Management
- [ ] System Settings
- [ ] Audit Logs
- [ ] Pulse AI Config
- [ ] Workflow Engine

### Phase 6: Integration & Polish (Week 6-7)
- [ ] Full Pulse AI integration
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Mobile responsiveness
- [ ] Dark mode
- [ ] Documentation
- [ ] Demo script preparation

---

## Part 8: Demo Scenarios

### For Client Demonstrations

**Scenario 1: Member Experience**
1. Visit marketing site
2. Log in as member
3. View digital ID card
4. Check benefits
5. Find a provider
6. View recent claims
7. Chat with Pulse AI

**Scenario 2: Provider Experience**
1. Log in as provider
2. Check member eligibility
3. View submitted claims
4. View recent payments
5. Check credential status
6. Chat with Pulse AI

**Scenario 3: Claims Processing**
1. Log in as admin
2. Receive new claims
3. Run payment integrity checks
4. Adjudicate claims
5. Generate payment batch
6. Send ERAs

**Scenario 4: Provider Onboarding**
1. New provider application
2. Credentialing workflow
3. PSV verification
4. Committee approval
5. Contract creation
6. Add to directory

---

## Handoff Notes

### For Ted (Builder)

**Where to find the backend code:**
```
~/agent-hub/dokit-healthcare/modules/    # All 23 modules
~/agent-hub/dokit-healthcare/platform/   # Platform shell, gateway, events
~/agent-hub/dokit-healthcare/shared/     # Shared libraries (auth, audit, etc.)
```

**Where to put the frontend:**
```
~/agent-hub/american-ppo-demo/
├── app/                    # Next.js app router
│   ├── (marketing)/       # Public marketing pages
│   ├── member/            # Member portal
│   ├── provider/          # Provider portal
│   └── admin/             # Admin dashboard
├── components/            # Shared components
├── lib/                   # Utilities, API clients
└── public/               # Static assets
```

**Key integration points:**
- Each module has `routes/index.ts` with API endpoints
- Each module has `types/index.ts` with TypeScript interfaces
- Each module has `schema.sql` for database tables
- Platform shell has auth, audit, events infrastructure

**Questions?**
- Ask Architect (me) about module functionality
- Ask Chris about business requirements

---

## Success Criteria

This platform is complete when:

1. ✅ Marketing site fully functional with all pages
2. ✅ Member can log in, view ID card, check claims, find providers
3. ✅ Provider can log in, check eligibility, view payments
4. ✅ Admin can process claims end-to-end
5. ✅ Pulse AI works in all portals
6. ✅ All 23 admin modules are accessible and functional
7. ✅ Demo scenarios can be executed smoothly
8. ✅ Looks professional enough to close $50K/month deals

---

**Let's build this.** 🏗️

📐 Architect
