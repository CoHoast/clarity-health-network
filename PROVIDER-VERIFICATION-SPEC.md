# Provider Verification & Monitoring Spec

## Overview

Real-time automated verification of provider regulatory status using government APIs. Surfaces alerts on the admin dashboard when providers have compliance issues.

---

## Data Sources

### 1. NPPES (NPI Registry) - FREE
**API:** `https://npiregistry.cms.hhs.gov/api/?version=2.1`

**What it returns:**
- NPI status (active/deactivated)
- Provider name, address, phone
- Taxonomy codes (specialties)
- Organization vs individual
- Enumeration date
- Last update date

**Sample call:**
```
GET https://npiregistry.cms.hhs.gov/api/?version=2.1&number=1234567890
```

**Check frequency:** Daily or on-demand

**Red flags:**
- NPI deactivated
- Name mismatch with our records
- Address significantly different

---

### 2. OIG LEIE (Exclusion List) - FREE
**Source:** https://oig.hhs.gov/exclusions/exclusions_list.asp

**What it is:** List of individuals/entities excluded from Medicare, Medicaid, and all federal healthcare programs.

**Format:** Downloadable CSV, updated monthly

**Fields:**
- EXCLTYPE (exclusion type code)
- EXCLDATE (exclusion date)
- REINDATE (reinstatement date, if any)
- WAIVERDATE, WAIVERSTATE

**Implementation:**
- Download monthly CSV
- Import into local database table
- Match against our providers by name + NPI + state

**Red flags:**
- Provider appears on exclusion list
- CRITICAL - cannot bill federal programs

---

### 3. SAM.gov (System for Award Management) - FREE
**API:** https://api.sam.gov/entity-information/v3/entities

**What it is:** Federal exclusion/debarment database

**Requires:** Free API key (register at SAM.gov)

**Check:** Entity status, exclusion records

**Red flags:**
- Active exclusion record
- Debarment from federal contracts

---

### 4. State Medical Boards - VARIES
**Challenge:** No universal API. Each state different.

**Options:**
- Manual entry with expiration date tracking
- Some states have lookup tools we could scrape (risky)
- Commercial services aggregate this (CAQH, Verisys)

**For MVP:** Manual entry + automated expiration reminders

---

## Database Schema

```sql
-- Provider verification status
CREATE TABLE provider_verifications (
  id UUID PRIMARY KEY,
  provider_id UUID REFERENCES providers(id),
  
  -- NPPES Data
  nppes_status VARCHAR(20), -- 'active', 'deactivated', 'not_found'
  nppes_last_checked TIMESTAMP,
  nppes_name_match BOOLEAN,
  nppes_address_match BOOLEAN,
  nppes_raw_response JSONB,
  
  -- OIG Exclusion
  oig_status VARCHAR(20), -- 'clear', 'excluded', 'pending_check'
  oig_last_checked TIMESTAMP,
  oig_exclusion_date DATE,
  oig_exclusion_type VARCHAR(50),
  
  -- SAM.gov
  sam_status VARCHAR(20), -- 'clear', 'excluded', 'pending_check'
  sam_last_checked TIMESTAMP,
  sam_exclusion_details JSONB,
  
  -- Overall Status
  verification_status VARCHAR(20), -- 'verified', 'warning', 'critical', 'pending'
  flags JSONB, -- Array of flag codes
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- License tracking (manual entry)
CREATE TABLE provider_licenses (
  id UUID PRIMARY KEY,
  provider_id UUID REFERENCES providers(id),
  license_type VARCHAR(50), -- 'state_medical', 'dea', 'board_cert', 'malpractice'
  license_number VARCHAR(100),
  issuing_state VARCHAR(2),
  issue_date DATE,
  expiration_date DATE,
  status VARCHAR(20), -- 'active', 'expired', 'suspended', 'revoked'
  verified_at TIMESTAMP,
  verified_by UUID,
  document_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Verification history/audit log
CREATE TABLE verification_history (
  id UUID PRIMARY KEY,
  provider_id UUID REFERENCES providers(id),
  check_type VARCHAR(50), -- 'nppes', 'oig', 'sam', 'manual'
  previous_status VARCHAR(20),
  new_status VARCHAR(20),
  details JSONB,
  checked_at TIMESTAMP DEFAULT NOW(),
  checked_by VARCHAR(50) -- 'system' or user_id
);
```

---

## Flag Types

| Code | Severity | Description |
|------|----------|-------------|
| `NPI_DEACTIVATED` | CRITICAL | NPI no longer active in NPPES |
| `OIG_EXCLUDED` | CRITICAL | On OIG exclusion list |
| `SAM_EXCLUDED` | CRITICAL | On SAM.gov exclusion list |
| `NPI_NOT_FOUND` | WARNING | NPI not found in NPPES |
| `NAME_MISMATCH` | WARNING | Name doesn't match NPPES |
| `ADDRESS_MISMATCH` | INFO | Address differs from NPPES |
| `LICENSE_EXPIRED` | CRITICAL | State license expired |
| `LICENSE_EXPIRING_30` | WARNING | License expires within 30 days |
| `LICENSE_EXPIRING_90` | INFO | License expires within 90 days |
| `DEA_EXPIRED` | CRITICAL | DEA registration expired |
| `MALPRACTICE_EXPIRED` | CRITICAL | Malpractice insurance expired |
| `BOARD_CERT_EXPIRED` | WARNING | Board certification expired |
| `NEVER_VERIFIED` | INFO | Provider never verified |
| `STALE_VERIFICATION` | INFO | Last check > 30 days ago |

---

## Dashboard UI

### Main Dashboard Card

```
┌─────────────────────────────────────────────────────┐
│ ⚠️ Provider Compliance Alerts                    3  │
├─────────────────────────────────────────────────────┤
│ 🔴 CRITICAL (1)                                     │
│    • Dr. James Wilson - OIG Exclusion Found         │
│                                                     │
│ 🟡 WARNING (2)                                      │
│    • Dr. Sarah Chen - License expires in 28 days    │
│    • Main Street Medical - NPI name mismatch        │
│                                                     │
│                          [View All] [Run Check Now] │
└─────────────────────────────────────────────────────┘
```

### Provider Detail - Verification Tab

```
┌─────────────────────────────────────────────────────┐
│ Verification Status                    ✅ Verified  │
│ Last checked: March 18, 2026 at 3:42 AM            │
│                                     [Check Now]     │
├─────────────────────────────────────────────────────┤
│                                                     │
│ NPPES Registry                         ✅ Active    │
│ NPI: 1234567890                                     │
│ Name Match: ✅  Address Match: ✅                   │
│                                                     │
│ OIG Exclusion List                     ✅ Clear     │
│ Last checked: March 18, 2026                        │
│                                                     │
│ SAM.gov                                ✅ Clear     │
│ Last checked: March 18, 2026                        │
│                                                     │
├─────────────────────────────────────────────────────┤
│ Licenses & Certifications                           │
│                                                     │
│ State Medical License (OH)             ✅ Active    │
│ #MD-123456 • Expires: Dec 31, 2026 (289 days)      │
│                                                     │
│ DEA Registration                       ✅ Active    │
│ #AB1234567 • Expires: Jun 15, 2027                 │
│                                                     │
│ Board Certification (Family Medicine)  ✅ Active    │
│ ABFM • Expires: Dec 31, 2028                       │
│                                                     │
│ Malpractice Insurance                  ✅ Active    │
│ Policy #PLM-9876 • Expires: Jan 1, 2027            │
│                                       [+ Add License]│
└─────────────────────────────────────────────────────┘
```

### Credentialing Page Enhancement

Add "Verification Status" column to provider tables:
- ✅ Green check = All clear
- ⚠️ Yellow warning = Non-critical issues
- 🔴 Red alert = Critical issues
- ⏳ Gray clock = Never verified / stale

---

## Background Jobs

### Daily Verification Job (2 AM)

```typescript
async function runDailyVerification() {
  const providers = await db.providers.findAll({
    where: {
      status: 'active',
      // Prioritize: never checked, or last check > 7 days
    },
    limit: 500 // Rate limit friendly
  });
  
  for (const provider of providers) {
    await checkNPPES(provider);
    await checkOIG(provider);
    await checkSAM(provider);
    await sleep(200); // Rate limiting
  }
  
  await generateAlerts();
  await notifyAdmins();
}
```

### Monthly OIG List Sync (1st of month)

```typescript
async function syncOIGExclusionList() {
  // Download latest CSV from OIG
  const csv = await downloadOIGList();
  
  // Parse and upsert to local table
  await db.oigExclusions.truncate();
  await db.oigExclusions.bulkInsert(csv);
  
  // Re-check all active providers against new list
  await recheckAllProvidersOIG();
}
```

### License Expiration Check (Daily)

```typescript
async function checkLicenseExpirations() {
  // Find licenses expiring in 90, 60, 30, 7 days
  const expiring = await db.providerLicenses.findExpiring([90, 60, 30, 7]);
  
  for (const license of expiring) {
    await createAlert(license.providerId, `LICENSE_EXPIRING_${license.daysUntil}`);
  }
}
```

---

## API Endpoints

```typescript
// Manual verification trigger
POST /api/providers/:id/verify
Response: { status, flags, details }

// Get verification status
GET /api/providers/:id/verification
Response: { nppes, oig, sam, licenses, overall_status, flags }

// Get all alerts
GET /api/verification/alerts
Query: ?severity=critical,warning&limit=50
Response: { alerts: [...], counts: { critical, warning, info } }

// Add/update license
POST /api/providers/:id/licenses
Body: { license_type, license_number, expiration_date, ... }

// Bulk verify (admin)
POST /api/verification/bulk
Body: { provider_ids: [...] }
Response: { queued: 150, estimated_time: "5 minutes" }

// Dashboard summary
GET /api/verification/summary
Response: { 
  total_providers: 250,
  verified: 220,
  warnings: 18,
  critical: 3,
  never_verified: 9,
  last_full_check: "2026-03-18T02:00:00Z"
}
```

---

## Implementation Phases

### Phase 1: NPPES Integration (1 week)
- [ ] NPPES API client
- [ ] Provider verification status table
- [ ] "Check Now" button on provider detail
- [ ] Basic verification tab UI
- [ ] Store results in database

### Phase 2: OIG + SAM (1 week)
- [ ] OIG CSV download and sync
- [ ] OIG matching logic
- [ ] SAM.gov API integration
- [ ] Combined status calculation
- [ ] Flag generation

### Phase 3: Dashboard Alerts (3-4 days)
- [ ] Dashboard alert card component
- [ ] Alert severity sorting
- [ ] Click-through to provider detail
- [ ] "Run Check Now" bulk action

### Phase 4: License Tracking (1 week)
- [ ] License entry form
- [ ] Expiration date tracking
- [ ] Automated expiration warnings
- [ ] License document upload

### Phase 5: Automation (3-4 days)
- [ ] Daily cron job setup
- [ ] Monthly OIG sync
- [ ] Email/notification alerts
- [ ] Verification history/audit log

---

## Demo Data

For the demo, we can:
1. Mock the API responses
2. Show one provider with OIG exclusion (red alert)
3. Show one provider with license expiring soon (yellow warning)
4. Show verified providers with green checks

---

## Cost Estimate

| Item | Cost |
|------|------|
| NPPES API | Free |
| OIG List | Free |
| SAM.gov API | Free (with registration) |
| Server/cron | Included in existing infra |
| **Total** | **$0** for MVP |

**Optional paid upgrades:**
- CAQH ProView integration: ~$2-5 per provider/year
- Verisys continuous monitoring: ~$3-8 per provider/month
- State license API aggregators: Varies

---

## Questions for Client

1. How many providers will be in the network initially? (affects rate limiting strategy)
2. Do they need email alerts when issues are found, or just dashboard?
3. Any specific state license boards they want prioritized?
4. Interest in commercial verification services for deeper checks?
