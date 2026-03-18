# TrueCare Credentialing Module — Full Product Spec

## Executive Summary

Transform TrueCare from a PPO Network Manager into a **Full PPO Operations Platform** by adding enterprise-grade provider credentialing. This module handles the complete credentialing lifecycle: application intake, automated verification, committee review, contract generation, re-credentialing, and continuous compliance monitoring.

**Business Impact:**
- Recurring revenue: $15-25/provider/month
- 500-provider network = $90-150K/year additional revenue
- Differentiator vs basic PPO admin tools
- Sticky feature = low churn

---

## Product Vision

### Current State (TrueCare Today)
```
┌─────────────────────────────────────────┐
│         PPO Network Manager             │
├─────────────────────────────────────────┤
│ ✅ Provider Database                    │
│ ✅ Practice/Provider Hierarchy          │
│ ✅ Contract Management                  │
│ ✅ Rates & Discounts                    │
│ ✅ Credentialing Status Tracker         │
│ ✅ Reports & Analytics                  │
│ ✅ Team & Permissions                   │
└─────────────────────────────────────────┘
```

### Target State (TrueCare + Credentialing)
```
┌─────────────────────────────────────────┐
│       Full PPO Operations Platform      │
├─────────────────────────────────────────┤
│ ✅ Provider Database                    │
│ ✅ Practice/Provider Hierarchy          │
│ ✅ Contract Management                  │
│ ✅ Rates & Discounts                    │
│                                         │
│ 🆕 CREDENTIALING ENGINE                 │
│    ├── Provider Application Portal      │
│    ├── Document Management              │
│    ├── Automated Verification (PSV)     │
│    ├── Committee Review Workflow        │
│    ├── Contract Generation              │
│    ├── Re-Credentialing Automation      │
│    └── Continuous Monitoring            │
│                                         │
│ ✅ Reports & Analytics                  │
│ ✅ Team & Permissions                   │
└─────────────────────────────────────────┘
```

---

## Integration with Existing TrueCare UI

### Current Admin Sidebar
```
Dashboard
Providers
  └── [Practice List]
      └── [Provider Detail]
Contracts
  ├── Active Contracts
  ├── Expiring Soon
  └── Templates
Rates & Discounts
Credentialing        ← EXPAND THIS
Reports
Settings
```

### New Credentialing Section
```
Credentialing
  ├── Dashboard (overview + alerts)
  ├── Applications
  │   ├── New Applications
  │   ├── In Verification
  │   ├── Ready for Review
  │   └── All Applications
  ├── Committee Review
  │   ├── Review Queue
  │   ├── Scheduled Meetings
  │   └── Decisions History
  ├── Re-Credentialing
  │   ├── Upcoming (90/60/30 days)
  │   ├── Overdue
  │   └── Completed
  ├── Monitoring
  │   ├── Active Alerts
  │   ├── Sanction Checks
  │   └── License Expirations
  ├── Documents
  │   ├── By Provider
  │   └── Expiring Soon
  └── Settings
      ├── Verification Sources
      ├── Document Requirements
      ├── Workflow Rules
      └── Notification Templates
```

### Provider Detail Page Enhancement

Current tabs:
```
Overview | Contact & Location | Billing Info | Contract | Rates & Discounts
```

New tabs:
```
Overview | Contact & Location | Billing Info | Contract | Rates & Discounts | Credentialing | Documents
```

**Credentialing Tab Contents:**
- Current credentialing status
- Verification results (NPPES, OIG, SAM, License, DEA)
- Last verified dates
- Expiration dates
- "Run Verification" button
- "Request Documents" button (sends secure link)
- Credentialing history timeline

**Documents Tab Contents:**
- All uploaded documents by type
- Upload new document (admin direct upload)
- Request documents from provider (secure link)
- Document expiration tracking
- Download/preview
- Pending upload requests status

---

## Feature Specifications

### 1. Admin-Driven Credentialing + Document Collection

**Model:** Solidarity controls the process. No provider portal/login required.

#### How Providers Get Added
```
Solidarity Admin
    ↓
Creates provider record in admin dashboard
    ├── Practice info (name, Tax ID, NPI, address)
    ├── Provider info (name, NPI, specialty, license #, DEA #)
    └── Known data from existing sources
    ↓
Needs documents? Two options:
    ├── Option A: Admin uploads directly (received via fax/email/mail)
    └── Option B: Send secure upload link to provider
```

#### Option A: Admin Direct Upload
Admin can upload documents directly when received from provider via other channels:
- Fax
- Email attachment
- Mail/scan
- In-person

**Admin Upload UI:**
```
┌─────────────────────────────────────────────────────────────────┐
│ Upload Documents for: Dr. Sarah Chen, MD                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ Document Type: [State Medical License ▼]                        │
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │                                                             │ │
│ │     Drag & drop file here, or click to browse              │ │
│ │                                                             │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ Issuing State: [OH ▼]                                           │
│ License Number: [MD-123456        ]                             │
│ Issue Date:     [01/15/2024]                                    │
│ Expiration:     [12/31/2027]                                    │
│                                                                  │
│ Notes: [                                        ]               │
│                                                                  │
│                              [Cancel]  [Upload Document]        │
└─────────────────────────────────────────────────────────────────┘
```

#### Option B: Secure Document Request Link
When admin needs docs directly from provider:

**Step 1: Admin Requests Documents**
```
┌─────────────────────────────────────────────────────────────────┐
│ Request Documents from Provider                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ Provider: Dr. Sarah Chen, MD                                    │
│ Email: dr.chen@lakesidemedical.com                              │
│                                                                  │
│ Select documents to request:                                    │
│ ☑️ State Medical License                                        │
│ ☑️ DEA Certificate                                              │
│ ☑️ Board Certification                                          │
│ ☑️ Malpractice Insurance (COI)                                  │
│ ☐ CV/Resume                                                     │
│ ☑️ W-9                                                          │
│ ☐ Signed Attestation                                            │
│                                                                  │
│ Link expires in: [14 days ▼]                                    │
│                                                                  │
│ Custom message (optional):                                      │
│ [Please upload at your earliest convenience.    ]               │
│                                                                  │
│                    [Cancel]  [Send Request Email]               │
└─────────────────────────────────────────────────────────────────┘
```

**Step 2: Provider Receives Email**
```
Subject: Document Request - Solidarity Health Network Credentialing

Dear Dr. Chen,

Solidarity Health Network is processing your credentialing application.
Please upload the following documents:

• State Medical License
• DEA Certificate
• Board Certification
• Malpractice Insurance (COI)
• W-9

[Upload Documents →]

This secure link expires on March 28, 2026.

Please upload at your earliest convenience.

Questions? Contact credentialing@solidarityhealthnetwork.com

— Solidarity Health Network Credentialing Team
```

**Step 3: Provider Clicks Link → Simple Upload Page (No Login)**
```
┌─────────────────────────────────────────────────────────────────┐
│ 🏥 Solidarity Health Network                                    │
│    Secure Document Upload                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ Dr. Sarah Chen, MD                                              │
│ Lakeside Medical Group                                          │
│                                                                  │
│ Please upload the requested documents:                          │
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ State Medical License                              Required │ │
│ │ [Choose File] or drag & drop                                │ │
│ │ Accepted: PDF, JPG, PNG (max 10MB)                          │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ DEA Certificate                                    Required │ │
│ │ [Choose File] or drag & drop                                │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Board Certification                                Required │ │
│ │ [Choose File] or drag & drop                                │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Malpractice Insurance (COI)                        Required │ │
│ │ [Choose File] or drag & drop                                │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ W-9                                                Required │ │
│ │ [Choose File] or drag & drop                                │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│                         [Submit Documents]                      │
│                                                                  │
│ 🔒 Secure upload • Link expires: March 28, 2026                │
└─────────────────────────────────────────────────────────────────┘
```

**Step 4: Admin Gets Notified**
- Email notification: "Dr. Chen uploaded 5 documents"
- Dashboard shows pending review
- Documents appear in provider's record

#### Document Request Tracking
Admin can see status of all pending requests:
```
┌─────────────────────────────────────────────────────────────────┐
│ Pending Document Requests                                       │
├─────────────────────────────────────────────────────────────────┤
│ Provider          │ Requested │ Expires   │ Status             │
├───────────────────┼───────────┼───────────┼────────────────────┤
│ Dr. Sarah Chen    │ Mar 14    │ Mar 28    │ 3/5 uploaded       │
│ Dr. James Wilson  │ Mar 12    │ Mar 26    │ Not started        │
│ Valley Health     │ Mar 10    │ Mar 24    │ ✅ Complete        │
└─────────────────────────────────────────────────────────────────┘
│                                    [Send Reminder] [Resend Link]│
└─────────────────────────────────────────────────────────────────┘
```

#### Security for Upload Links
- Token-based URLs (no login required)
- Tokens are single-use or time-limited
- Configurable expiration (7/14/30 days)
- Links tied to specific provider + document types
- HTTPS only
- Upload goes directly to secure storage (S3)

#### Document Requirements by Provider Type

| Provider Type | Required Documents |
|--------------|-------------------|
| **Physician (MD/DO)** | License, DEA, Board Cert, Malpractice COI, CV, W-9, Attestation |
| **Mid-Level (NP/PA)** | License, Collaborative Agreement, Malpractice COI, CV, W-9 |
| **Dentist (DDS/DMD)** | License, DEA, Board Cert, Malpractice COI, W-9 |
| **Facility** | State License, Medicare Certification, Accreditation, Insurance, W-9 |
| **Behavioral Health** | License, NPI, Malpractice COI, Supervision Agreement (if req'd), W-9 |
| **Allied Health (PT/OT)** | License, NPI, Malpractice COI, Certification, W-9 |

---

### 2. Automated Primary Source Verification (PSV)

#### Verification Sources & Automation Level

| Source | API | Cost | Frequency | Automation |
|--------|-----|------|-----------|------------|
| **NPPES** | api.nppes.cms.hhs.gov | FREE | Real-time | Full auto |
| **OIG LEIE** | Monthly CSV download | FREE | Daily batch | Full auto |
| **SAM.gov** | api.sam.gov | FREE | Daily batch | Full auto |
| **State License** | Varies by state | FREE | Weekly | Semi-auto* |
| **DEA** | deadiversion.usdoj.gov | FREE | Weekly | Semi-auto* |
| **Board Certification** | ABMS/specialty boards | Paid** | On-demand | Semi-auto |
| **NPDB** | npdb.hrsa.gov | ~$4/query | On application | Manual trigger |
| **Medicare Opt-Out** | data.cms.gov | FREE | Monthly | Full auto |

*Semi-auto: Some states have APIs, others need manual lookup or scraping
**Board cert: Can often verify via public lookup, paid for bulk API

#### Verification Engine Workflow

```
Application Submitted
         ↓
┌─────────────────────────────────────────────────────┐
│              VERIFICATION ENGINE                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Step 1: NPI Validation (NPPES)           [AUTO]   │
│  ├── NPI exists and active?                        │
│  ├── Name matches application?                     │
│  ├── Address matches?                              │
│  └── Taxonomy codes match specialties?             │
│                                                     │
│  Step 2: Exclusion Screening              [AUTO]   │
│  ├── OIG LEIE check (federal exclusion)            │
│  ├── SAM.gov check (debarment)                     │
│  └── Medicare opt-out check                        │
│  ⚠️  STOP IF EXCLUDED - Auto-deny application      │
│                                                     │
│  Step 3: License Verification             [SEMI]   │
│  ├── State board lookup (where available)          │
│  ├── License active?                               │
│  ├── Expiration date                               │
│  ├── Any disciplinary actions?                     │
│  └── Flag if manual verification needed            │
│                                                     │
│  Step 4: DEA Verification                 [SEMI]   │
│  ├── DEA registration active?                      │
│  ├── Schedule authorities                          │
│  └── Expiration date                               │
│                                                     │
│  Step 5: Document Validation              [AUTO]   │
│  ├── All required docs uploaded?                   │
│  ├── Documents not expired?                        │
│  ├── Malpractice coverage meets minimums?          │
│  └── ($1M/$3M minimum recommended)                 │
│                                                     │
│  Step 6: Board Certification              [SEMI]   │
│  ├── Verify via public lookup or API               │
│  └── Certification current?                        │
│                                                     │
└─────────────────────────────────────────────────────┘
         ↓
    VERIFICATION RESULT
    ├── ALL PASS → Ready for Committee
    ├── MINOR ISSUES → Flag for Specialist Review
    ├── MAJOR ISSUES → Hold, Request Info from Provider
    └── HARD FAIL → Auto-Deny (exclusion, revoked license)
```

#### Verification Result Storage

```typescript
interface VerificationResult {
  id: string;
  applicationId: string;
  providerId: string;
  verificationType: 'nppes' | 'oig' | 'sam' | 'license' | 'dea' | 'board_cert' | 'npdb' | 'malpractice';
  status: 'pending' | 'passed' | 'failed' | 'needs_review' | 'manual_required';
  
  // Source details
  sourceName: string;
  sourceUrl: string;
  verifiedAt: Date;
  expiresAt: Date | null;
  
  // Result data
  rawResponse: object;
  matchScore: number; // 0-100, how well data matches
  flags: string[]; // Any issues found
  notes: string;
  
  // If manual
  verifiedBy: string | null;
  manualOverride: boolean;
}
```

---

### 3. Committee Review Workflow

#### Review Queue Dashboard

```
┌─────────────────────────────────────────────────────────────────────────┐
│  CREDENTIALING COMMITTEE DASHBOARD                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Ready for    │  │ Needs More   │  │ Flagged      │  │ Decided      │ │
│  │ Review       │  │ Information  │  │ for MD       │  │ This Week    │ │
│  │     15       │  │      5       │  │      3       │  │     12       │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                                          │
│  APPLICATIONS READY FOR REVIEW                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Provider            │ Practice           │ Type    │ Submitted   │  │
│  ├───────────────────────────────────────────────────────────────────┤  │
│  │ Dr. Sarah Chen, MD  │ Lakeside Medical   │ Initial │ Mar 10      │  │
│  │ ✅ All verifications passed                         [Review →]   │  │
│  ├───────────────────────────────────────────────────────────────────┤  │
│  │ Dr. James Wilson    │ Wilson Family Care │ Initial │ Mar 8       │  │
│  │ ⚠️ License expires in 45 days                      [Review →]   │  │
│  ├───────────────────────────────────────────────────────────────────┤  │
│  │ Main Street Clinic  │ (Facility)         │ Initial │ Mar 5       │  │
│  │ ✅ All verifications passed                         [Review →]   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  UPCOMING RE-CREDENTIALING                                              │
│  ├── Due in 30 days: 12 providers                                       │
│  ├── Due in 60 days: 18 providers                                       │
│  └── Due in 90 days: 23 providers                                       │
│                                                                          │
│  RECENT ALERTS                                                          │
│  🔴 Dr. Michael Brown - New OIG exclusion detected (Mar 18)            │
│  🟡 Valley Health Center - License expires in 14 days                  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Application Review Screen

```
┌─────────────────────────────────────────────────────────────────────────┐
│  APPLICATION REVIEW: Dr. Sarah Chen, MD                                 │
│  Lakeside Medical Group | NPI: 1234567890 | Applied: March 10, 2026    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [Summary] [Verifications] [Documents] [History] [Notes]                │
│                                                                          │
│  VERIFICATION SUMMARY                                                   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ✅ NPI Registry (NPPES)      Verified Mar 15    Active          │   │
│  │ ✅ OIG Exclusion List        Verified Mar 15    Not Excluded    │   │
│  │ ✅ SAM.gov                   Verified Mar 15    Not Excluded    │   │
│  │ ✅ State License (OH)        Verified Mar 15    Exp: Dec 2027   │   │
│  │ ✅ DEA Registration          Verified Mar 15    Exp: Jun 2028   │   │
│  │ ✅ Board Certification       Verified Mar 15    ABFM, Current   │   │
│  │ ✅ Malpractice Insurance     Verified Mar 15    $1M/$3M         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  PROVIDER DETAILS                                                       │
│  Name: Sarah Chen, MD                                                   │
│  Specialty: Family Medicine                                             │
│  License: OH-MD-123456 (exp 12/31/2027)                                │
│  DEA: AC1234567 (exp 06/30/2028)                                       │
│  Board Cert: ABFM (exp 12/31/2029)                                     │
│                                                                          │
│  DOCUMENTS                                                              │
│  📄 Medical License (OH)        [View]                                  │
│  📄 DEA Certificate             [View]                                  │
│  📄 Board Certification         [View]                                  │
│  📄 Malpractice COI             [View]                                  │
│  📄 CV                          [View]                                  │
│  📄 W-9                         [View]                                  │
│  📄 Attestation                 [View]                                  │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ COMMITTEE ACTION                                                │   │
│  │                                                                 │   │
│  │ Decision:  [Approve ▼]                                         │   │
│  │                                                                 │   │
│  │ ○ Approve - Add to network                                     │   │
│  │ ○ Approve with Conditions - Requires monitoring                │   │
│  │ ○ Request More Information - Pause for provider response       │   │
│  │ ○ Deny - Reject application                                    │   │
│  │ ○ Refer to Medical Director - Escalate for review              │   │
│  │                                                                 │   │
│  │ Notes: [                                                    ]  │   │
│  │                                                                 │   │
│  │                              [Cancel]  [Submit Decision]       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Committee Workflow Options

**Simple Mode** (for smaller networks):
- Single approver (Medical Director or Credentialing Manager)
- Direct approve/deny from review screen
- No meeting scheduling needed

**Full Committee Mode** (for larger networks):
- Multiple committee members
- Meeting scheduling
- Voting system
- Quorum requirements
- Meeting minutes generation

*Configurable per client - start simple, upgrade when needed.*

---

### 4. Contract Generation

When a provider is approved, automatically:

1. **Assign Fee Schedule**
   - Based on specialty + geography
   - Pull from Rates & Discounts module (already built)
   - Can override for individual provider

2. **Generate Contract**
   - Select template (individual, group, facility)
   - Populate with provider data
   - Attach rate exhibit (fee schedule)
   - Generate PDF

3. **Send for Signature**
   - Email contract to provider
   - Integration options:
     - DocuSign (paid, ~$1-3/envelope)
     - HelloSign (paid)
     - PandaDoc (paid)
     - Simple email + upload (free)
   - Track signature status

4. **Activate Provider**
   - When signed, auto-activate in network
   - Set effective date
   - Update provider status
   - Send welcome packet

#### Contract Data Model

```typescript
interface CredentialingContract {
  id: string;
  applicationId: string;
  providerId: string;
  practiceId: string;
  
  // Contract details
  templateId: string;
  contractType: 'individual' | 'group' | 'facility';
  effectiveDate: Date;
  termDate: Date;
  autoRenew: boolean;
  terminationNoticeDays: number;
  
  // Rate assignment
  feeScheduleId: string;
  rateType: 'medicare_percent' | 'billed_percent' | 'flat_rate' | 'case_rate';
  rateValue: number; // e.g., 150 for 150% Medicare
  customRates: boolean;
  
  // Signature
  status: 'draft' | 'sent' | 'viewed' | 'signed' | 'declined' | 'expired';
  sentAt: Date | null;
  signedAt: Date | null;
  signedByName: string | null;
  signedByTitle: string | null;
  signatureMethod: 'docusign' | 'hellosign' | 'manual_upload' | 'in_person';
  
  // Document
  contractPdfUrl: string;
  signedPdfUrl: string | null;
  
  createdAt: Date;
  updatedAt: Date;
}
```

---

### 5. Re-Credentialing Automation

#### Re-Credentialing Schedule

| Provider Type | Frequency | Pre-Generation Lead Time |
|--------------|-----------|--------------------------|
| Physicians (MD/DO) | 36 months | 90 days |
| Mid-Levels (NP/PA) | 24 months | 60 days |
| Dentists | 36 months | 90 days |
| Facilities | 36 months | 90 days |
| Allied Health | 24 months | 60 days |
| Behavioral Health | 24 months | 60 days |

#### Automated Workflow

```
90 Days Before Expiration
         ↓
    SYSTEM AUTO-GENERATES RE-CRED APPLICATION
    ├── Pre-fill with current provider data
    ├── Mark documents that need updating
    └── Send email to provider: "Time to re-credential"
         ↓
    PROVIDER PORTAL
    ├── Review pre-filled data
    ├── Update any changes
    ├── Upload new documents (if expired)
    └── Submit
         ↓
60 Days Before Expiration (if not submitted)
         ↓
    REMINDER EMAIL
    "Your network participation expires in 60 days"
         ↓
30 Days Before Expiration (if not submitted)
         ↓
    URGENT EMAIL + PHONE CALL TASK
    "Final notice - submit immediately"
    CC: Practice manager
         ↓
14 Days Before Expiration (if not submitted)
         ↓
    ESCALATION
    ├── Alert credentialing manager
    ├── Alert network relations
    └── Consider termination letter
         ↓
Expiration Date
         ↓
    IF NOT COMPLETED:
    ├── Auto-suspend (stop claims)
    ├── Grace period (configurable: 30-60 days)
    └── Terminate if still not completed
```

#### Abbreviated Re-Credentialing

If provider has clean history:
- No disciplinary actions
- No malpractice claims
- No gaps in coverage
- All verifications pass

Then: **Auto-approve** with single signature (no full committee)

---

### 6. Continuous Monitoring

#### Monitoring Schedule

| Check Type | Frequency | Source | Action on Failure |
|------------|-----------|--------|-------------------|
| OIG Exclusion | Daily | OIG LEIE | Immediate termination |
| SAM Exclusion | Daily | SAM.gov | Immediate termination |
| Medicare Opt-Out | Monthly | CMS | Alert, review required |
| Death Master File | Monthly | SSA DMF | Immediate termination |
| License Status | Weekly | State boards | Alert, suspension if revoked |
| DEA Status | Weekly | DEA database | Alert, flag if controlled substances |
| NPI Status | Weekly | NPPES | Alert if deactivated |

#### Alert Severity & Response

| Severity | Examples | Auto-Action | Response Time |
|----------|----------|-------------|---------------|
| 🔴 CRITICAL | OIG exclusion, license revoked | Auto-suspend | Immediate |
| 🟠 HIGH | License suspended, DEA revoked | Alert team | 24 hours |
| 🟡 MEDIUM | License expiring soon, action pending | Alert team | 7 days |
| 🔵 LOW | Address change, name change | Log for review | 30 days |

#### Monitoring Dashboard

```
┌─────────────────────────────────────────────────────────────────────────┐
│  COMPLIANCE MONITORING                                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  LAST SCAN: March 18, 2026 at 2:00 AM | Next: March 19, 2026 at 2:00 AM│
│  Providers Monitored: 487 | Clean: 482 | Alerts: 5                      │
│                                                                          │
│  ACTIVE ALERTS                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ 🔴 CRITICAL                                                       │  │
│  │ Dr. Michael Brown - OIG Exclusion Found                           │  │
│  │ Detected: Mar 18, 2026 | Status: Suspended | Action Required      │  │
│  │                                                    [View Details] │  │
│  ├───────────────────────────────────────────────────────────────────┤  │
│  │ 🟡 MEDIUM                                                         │  │
│  │ Dr. Emily Watson - License expires in 28 days                     │  │
│  │ Detected: Mar 18, 2026 | License: OH-MD-789012 | Exp: Apr 15     │  │
│  │                                                    [View Details] │  │
│  ├───────────────────────────────────────────────────────────────────┤  │
│  │ 🟡 MEDIUM                                                         │  │
│  │ Valley Health Center - Malpractice COI expires in 21 days        │  │
│  │ Detected: Mar 15, 2026 | Policy: PLM-456789 | Exp: Apr 8         │  │
│  │                                                    [View Details] │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  VERIFICATION HISTORY (Last 7 Days)                                     │
│  ├── OIG Checks: 3,409 | Found: 1                                       │
│  ├── SAM Checks: 3,409 | Found: 0                                       │
│  ├── License Checks: 487 | Issues: 3                                    │
│  └── NPI Checks: 487 | Issues: 0                                        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Database Schema

### New Tables

```sql
-- Applications
CREATE TABLE credentialing_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    practice_id UUID REFERENCES practices(id),
    provider_id UUID REFERENCES providers(id), -- null for new providers
    
    application_type VARCHAR(20) NOT NULL, -- 'initial', 'recredential', 'add_location'
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    -- draft, submitted, verification, review, approved, denied, withdrawn
    
    -- Application data (JSON for flexibility)
    application_data JSONB NOT NULL DEFAULT '{}',
    
    -- Tracking
    submitted_at TIMESTAMPTZ,
    submitted_by_name VARCHAR(200),
    submitted_by_email VARCHAR(200),
    
    -- Assignment
    assigned_to UUID REFERENCES users(id),
    priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
    
    -- Dates
    target_effective_date DATE,
    credential_expires_at DATE, -- for recred, when current credential expires
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Verifications
CREATE TABLE verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES credentialing_applications(id),
    provider_id UUID REFERENCES providers(id),
    
    verification_type VARCHAR(30) NOT NULL,
    -- nppes, oig, sam, state_license, dea, board_cert, malpractice, npdb
    
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    -- pending, in_progress, passed, failed, needs_review, manual_required
    
    source_name VARCHAR(100),
    source_url VARCHAR(500),
    
    verified_at TIMESTAMPTZ,
    expires_at DATE,
    
    match_score INTEGER, -- 0-100
    flags JSONB DEFAULT '[]',
    raw_response JSONB,
    notes TEXT,
    
    -- Manual verification
    verified_by UUID REFERENCES users(id),
    manual_override BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Committee Decisions
CREATE TABLE committee_decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES credentialing_applications(id),
    
    decision VARCHAR(30) NOT NULL,
    -- approved, approved_conditions, denied, deferred, request_info, refer_md
    
    conditions TEXT,
    denial_reason TEXT,
    notes TEXT,
    
    decided_by UUID REFERENCES users(id),
    decided_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- For full committee mode
    meeting_date DATE,
    vote_count INTEGER,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sanction Monitoring
CREATE TABLE sanction_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES providers(id),
    
    check_type VARCHAR(30) NOT NULL,
    -- oig, sam, state_license, dea, medicare_optout, death_master
    
    check_date DATE NOT NULL,
    result VARCHAR(20) NOT NULL, -- clear, found, error
    
    alert_generated BOOLEAN DEFAULT FALSE,
    alert_id UUID REFERENCES compliance_alerts(id),
    
    details JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance Alerts
CREATE TABLE compliance_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES providers(id),
    practice_id UUID REFERENCES practices(id),
    
    alert_type VARCHAR(50) NOT NULL,
    -- oig_exclusion, sam_exclusion, license_revoked, license_suspended,
    -- license_expiring, dea_revoked, npi_deactivated, etc.
    
    severity VARCHAR(20) NOT NULL, -- critical, high, medium, low
    status VARCHAR(20) NOT NULL DEFAULT 'open', -- open, acknowledged, resolved, dismissed
    
    title VARCHAR(200) NOT NULL,
    description TEXT,
    details JSONB,
    
    -- Response tracking
    acknowledged_by UUID REFERENCES users(id),
    acknowledged_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,
    
    -- Auto-actions taken
    auto_suspended BOOLEAN DEFAULT FALSE,
    auto_terminated BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Credentialing Documents
CREATE TABLE credentialing_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES credentialing_applications(id),
    provider_id UUID REFERENCES providers(id),
    
    document_type VARCHAR(30) NOT NULL,
    -- license, dea, board_cert, malpractice_coi, cv, w9, attestation, other
    
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    file_hash VARCHAR(64), -- SHA-256 for integrity
    
    -- Metadata
    issuing_state VARCHAR(2),
    document_number VARCHAR(100),
    issue_date DATE,
    expiration_date DATE,
    
    -- Verification
    verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMPTZ,
    
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document Requests (Secure Upload Links)
CREATE TABLE document_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES providers(id) NOT NULL,
    practice_id UUID REFERENCES practices(id),
    
    -- Token for secure link
    token VARCHAR(64) UNIQUE NOT NULL, -- Secure random token
    
    -- What's being requested
    requested_documents JSONB NOT NULL, -- Array of document types needed
    -- e.g., ['license', 'dea', 'malpractice_coi', 'w9']
    
    -- Recipient
    recipient_email VARCHAR(255) NOT NULL,
    recipient_name VARCHAR(200),
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    -- pending, partial, complete, expired, cancelled
    
    uploaded_documents JSONB DEFAULT '[]', -- Track which have been uploaded
    
    -- Timing
    expires_at TIMESTAMPTZ NOT NULL,
    reminder_sent_at TIMESTAMPTZ,
    
    -- Custom message
    custom_message TEXT,
    
    -- Tracking
    sent_by UUID REFERENCES users(id),
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Log
CREATE TABLE credentialing_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- What was affected
    application_id UUID,
    provider_id UUID,
    practice_id UUID,
    
    -- What happened
    action VARCHAR(100) NOT NULL,
    -- application_submitted, verification_started, verification_completed,
    -- document_uploaded, decision_made, alert_generated, etc.
    
    -- Who did it
    performed_by UUID,
    performed_by_type VARCHAR(20), -- user, system, provider
    
    -- Details
    old_values JSONB,
    new_values JSONB,
    details JSONB,
    
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_applications_status ON credentialing_applications(status);
CREATE INDEX idx_applications_practice ON credentialing_applications(practice_id);
CREATE INDEX idx_verifications_application ON verifications(application_id);
CREATE INDEX idx_verifications_provider ON verifications(provider_id);
CREATE INDEX idx_sanction_checks_provider ON sanction_checks(provider_id);
CREATE INDEX idx_sanction_checks_date ON sanction_checks(check_date);
CREATE INDEX idx_alerts_status ON compliance_alerts(status);
CREATE INDEX idx_alerts_severity ON compliance_alerts(severity);
CREATE INDEX idx_documents_provider ON credentialing_documents(provider_id);
CREATE INDEX idx_documents_expiration ON credentialing_documents(expiration_date);
CREATE INDEX idx_doc_requests_token ON document_requests(token);
CREATE INDEX idx_doc_requests_provider ON document_requests(provider_id);
CREATE INDEX idx_doc_requests_status ON document_requests(status);
CREATE INDEX idx_audit_application ON credentialing_audit_log(application_id);
CREATE INDEX idx_audit_provider ON credentialing_audit_log(provider_id);
```

---

## API Endpoints

### Applications

```
POST   /api/credentialing/applications              Create new application
GET    /api/credentialing/applications              List applications (with filters)
GET    /api/credentialing/applications/:id          Get application details
PATCH  /api/credentialing/applications/:id          Update application
POST   /api/credentialing/applications/:id/submit   Submit application
POST   /api/credentialing/applications/:id/withdraw Withdraw application
```

### Verifications

```
POST   /api/credentialing/applications/:id/verify   Run all verifications
POST   /api/credentialing/verify/nppes              Single NPPES check
POST   /api/credentialing/verify/oig                Single OIG check
POST   /api/credentialing/verify/sam                Single SAM check
GET    /api/credentialing/applications/:id/verifications  Get verification results
```

### Committee

```
GET    /api/credentialing/review/queue              Get review queue
POST   /api/credentialing/applications/:id/decide   Submit decision
GET    /api/credentialing/decisions                 Decision history
```

### Documents

```
POST   /api/credentialing/documents                 Admin upload document
GET    /api/credentialing/documents/:id             Get/download document
DELETE /api/credentialing/documents/:id             Delete document
GET    /api/credentialing/providers/:id/documents   Get provider's documents
```

### Document Requests (Secure Links)

```
POST   /api/credentialing/document-requests         Create request + send email
GET    /api/credentialing/document-requests         List pending requests
GET    /api/credentialing/document-requests/:id     Get request status
POST   /api/credentialing/document-requests/:id/remind  Resend reminder email
DELETE /api/credentialing/document-requests/:id     Cancel request
```

### Secure Upload (Public - Token-Based)

```
GET    /api/upload/:token                           Validate token, get request info
POST   /api/upload/:token                           Upload documents (no auth)
```

### Monitoring

```
GET    /api/credentialing/monitoring/alerts         Get active alerts
PATCH  /api/credentialing/monitoring/alerts/:id     Update alert status
POST   /api/credentialing/monitoring/run            Trigger manual scan
GET    /api/credentialing/monitoring/history        Scan history
```

---

## Build Phases

### Phase 1: Foundation (Weeks 1-3)
**Goal:** Database + basic application intake

- [ ] Database schema and migrations
- [ ] Application intake form (admin-side initially)
- [ ] Document upload to S3/storage
- [ ] Basic application status tracking
- [ ] Add Credentialing section to sidebar
- [ ] Applications list page

**Deliverable:** Can create applications and upload documents in admin

---

### Phase 2: Automated Verification (Weeks 4-6)
**Goal:** NPPES, OIG, SAM integration working

- [ ] NPPES API client
- [ ] OIG LEIE CSV download and sync
- [ ] SAM.gov API client
- [ ] Verification workflow engine
- [ ] Verification results UI
- [ ] "Run Verification" button on applications
- [ ] Provider Credentialing tab (in existing provider detail)

**Deliverable:** Can run automated verifications with real API calls

---

### Phase 3: Review Workflow (Weeks 7-8)
**Goal:** Committee can review and decide

- [ ] Review queue dashboard
- [ ] Application review screen
- [ ] Decision capture (approve/deny/etc.)
- [ ] Decision notifications (email)
- [ ] Simple single-approver mode
- [ ] Credentialing history timeline

**Deliverable:** Full application → review → decision workflow working

---

### Phase 4: Contract & Activation (Weeks 9-10)
**Goal:** Approved providers get contracts and go live

- [ ] Contract template system
- [ ] Rate assignment from existing Rates module
- [ ] Contract PDF generation
- [ ] Email contract to provider
- [ ] Signature tracking (manual upload initially)
- [ ] Provider activation on signature
- [ ] Welcome email

**Deliverable:** End-to-end: apply → verify → approve → contract → active

---

### Phase 5: Secure Document Links (Week 11)
**Goal:** Providers can upload docs via secure link

- [ ] Token-based secure upload URLs
- [ ] Document request email templates
- [ ] Simple upload page (no login)
- [ ] Upload notification to admin
- [ ] Request tracking dashboard
- [ ] Reminder emails

**Deliverable:** Admin can request docs, providers upload via link

---

### Phase 6: Re-Credentialing (Weeks 12-13)
**Goal:** Automated re-credentialing workflow

- [ ] Re-cred scheduling engine
- [ ] Auto-generate renewal notifications
- [ ] Reminder email sequences
- [ ] Escalation workflow
- [ ] Abbreviated re-cred (auto-approve clean providers)
- [ ] Re-credentialing dashboard

**Deliverable:** Re-credentialing runs automatically

---

### Phase 7: Continuous Monitoring (Weeks 14-15)
**Goal:** Daily/weekly compliance monitoring

- [ ] Scheduled background jobs
- [ ] Daily OIG/SAM checks
- [ ] Weekly license checks
- [ ] Alert generation
- [ ] Alert dashboard
- [ ] Auto-suspend on critical findings
- [ ] Monitoring history/audit

**Deliverable:** Continuous compliance monitoring live

---

### Phase 8: Polish & Enterprise (Week 16)
**Goal:** Production-ready

- [ ] Full committee mode (optional)
- [ ] DocuSign integration (optional)
- [ ] NCQA compliance report
- [ ] Performance optimization
- [ ] Documentation
- [ ] Admin training materials

**Deliverable:** Production deployment ready

---

## Timeline Summary

| Phase | Weeks | Focus |
|-------|-------|-------|
| 1. Foundation | 1-2 | Database + admin forms |
| 2. Verification | 3-4 | Integrate Architect's engine |
| 3. Review Workflow | 5-6 | Committee dashboard |
| 4. Contracts | 7-8 | Generation + signature |
| 5. Document Links | 9 | Secure upload links |
| 6. Re-Credentialing | 10-11 | Automation |
| 7. Monitoring | 12-13 | Daily checks + alerts |
| 8. Polish | 14 | Production-ready |
| **TOTAL** | **14 weeks** | |

**MVP (Phases 1-5): 9 weeks** - Full credentialing workflow working

---

## Pricing Model

### Per-Provider Pricing

| Tier | Providers | Monthly per Provider | Annual Revenue |
|------|-----------|---------------------|----------------|
| Starter | 1-100 | $25 | $30K |
| Growth | 101-500 | $20 | $120K |
| Enterprise | 501-1000 | $15 | $180K |
| Enterprise+ | 1000+ | $12 | Custom |

### Platform + Per-Provider

| Component | Monthly |
|-----------|---------|
| Platform Base | $2,500 |
| Per Provider | $15 |
| **500 providers** | **$10,000/month = $120K/year** |

### Bundled PPO Platform

| Package | Includes | Monthly | Annual |
|---------|----------|---------|--------|
| **PPO Essentials** | Network Mgmt + Contracts | $3,000 + $8/provider | $75K (500 prov) |
| **PPO Professional** | + Credentialing + Monitoring | $5,000 + $15/provider | $150K (500 prov) |
| **PPO Enterprise** | + Portal + API + Support | $8,000 + $20/provider | $216K (500 prov) |

---

## Technical Dependencies

### Required
- PostgreSQL 14+ (existing)
- S3-compatible storage (documents)
- Background job processor (cron or queue)
- Email service (SendGrid, SES, etc.)

### API Keys Needed
- SAM.gov (free, requires registration)
- Optional: DocuSign, NPDB

### No Cost APIs
- NPPES (free, no key)
- OIG LEIE (free download)
- State medical boards (free lookup, varies)

---

## Security & Compliance

### Data Classification
| Data Type | Classification | Handling |
|-----------|---------------|----------|
| SSN | PII - Sensitive | Encrypt at rest, mask in UI, audit access |
| DOB | PII | Encrypt at rest |
| License numbers | Business data | Standard security |
| Documents | Business data | Encrypt at rest, access logging |
| Malpractice history | Sensitive | Limited access |

### Access Control (integrate with existing RBAC)

| Role | Access |
|------|--------|
| Credentialing Specialist | Full access to applications, verifications |
| Credentialing Manager | All above + settings, bulk actions |
| Medical Director | All above + final approval, override |
| Network Admin | Settings only |
| Viewer | Read-only |

### Audit Requirements
- Every action logged with timestamp, user, IP
- Document access logged
- Verification results immutable
- Decisions require notes
- 10-year retention

---

## Success Metrics

| Metric | Target | How Measured |
|--------|--------|--------------|
| Average credentialing time | < 14 days | Application submit → active |
| Auto-verification rate | > 90% | Verifications not needing manual |
| Committee approval rate | > 85% | First-time approvals |
| Re-credentialing on-time | > 98% | Completed before expiration |
| Exclusion detection | < 24 hours | Time from OIG update to alert |
| Provider satisfaction | > 4.2/5 | Application process survey |

---

## Open Questions for Client

1. **Committee structure:** Single approver or full committee with voting?
2. **Contract signing:** DocuSign integration or manual upload acceptable?
3. **State boards:** Which states are priority for license verification?
4. **NPDB:** Do they want NPDB queries (adds ~$4/provider cost)?
5. **Re-credentialing:** 24-month or 36-month cycle?
6. **Portal branding:** Custom domain for provider applications?

---

## Appendix: State Medical Board APIs

Priority states for automated verification:

| State | Board | API/Lookup | Notes |
|-------|-------|------------|-------|
| OH | med.ohio.gov | Online lookup | Scrapeable |
| PA | dos.pa.gov | Online lookup | Scrapeable |
| NY | nysed.gov | Online lookup | Scrapeable |
| FL | flhealthsource.gov | API available | Best option |
| TX | tmb.state.tx.us | Online lookup | Scrapeable |
| CA | mbc.ca.gov | Online lookup | Slow but works |
| IL | idfpr.illinois.gov | Online lookup | Scrapeable |

*Full state mapping in implementation phase*

---

## Summary

**Total Build:** 18 weeks (4.5 months)
**MVP (Phases 1-4):** 10 weeks
**Pricing:** $120-150K/year for 500-provider network
**Differentiation:** Full platform vs point solutions

This transforms TrueCare from "network admin tool" to "can't live without it infrastructure."

---

*Ready to build on your go-ahead.* 🎸
