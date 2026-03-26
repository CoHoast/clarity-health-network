# TrueCare Health Network - PPO Network Manager

## Overview
Premium demo platform for PPO network management. Built as a sales tool to showcase DOKit's capabilities for health organizations.

## URLs
- **Production**: https://truecare-health-network-production.up.railway.app
- **Admin Dashboard**: https://truecare-health-network-production.up.railway.app/admin
- **GitHub**: https://github.com/CoHoast/clarity-health-network.git

## Tech Stack
- **Framework**: Next.js 15 + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Deployment**: Railway (auto-deploy from GitHub)
- **Build**: `output: 'standalone'` in next.config

## Brand Colors
- **Primary**: Cyan `#06b6d4` (cyan-500) / Teal `#0d9488` (teal-600)
- **Accent**: Cyan `#22d3ee` (cyan-400)
- **Sidebar**: Slate `#0f172a` (slate-900)

## Theme System
Theme toggle in AdminLayout. Uses ThemeContext for state management.

### Light Theme
- Stat cards: `bg-cyan-600` solid background
- Text: white (use `style={{ color: 'white' }}` to avoid CSS overrides)
- Labels: `rgba(255,255,255,0.8)`
- Icon backgrounds: `bg-white/20`

### Dark Theme  
- Stat cards: `from-cyan-900/30 to-teal-900/30 border border-cyan-800/30`
- Text: white
- Labels: `text-cyan-300/70`
- Icon backgrounds: `bg-cyan-500/20 border border-cyan-500/30`

### Theme Context Usage
```tsx
import { useTheme } from "@/components/admin/ThemeContext";

export default function MyPage() {
  const { isDark } = useTheme();
  
  return (
    <div className={`rounded-xl p-4 shadow-lg ${
      isDark 
        ? "bg-gradient-to-br from-cyan-900/30 to-teal-900/30 border border-cyan-800/30" 
        : "bg-cyan-600"
    }`}>
      <p style={{ color: 'white' }}>Value</p>
      <p style={{ color: 'rgba(255,255,255,0.8)' }}>Label</p>
    </div>
  );
}
```

## Platform Focus: PPO Network Manager
**NOT** a claims/insurance platform. Focused on:
- Provider network management
- Contract management
- Discount schedules
- Credentialing
- Reporting

## Admin Sections
1. **Dashboard** - Overview stats, expiring contracts, recent activity
2. **Providers** - Provider directory with 3 NPI fields (Org, Servicing, Pay-To)
3. **Contracts** - Active contracts, expiring alerts, templates
4. **Rates & Discounts** - Fee schedules, discount management
5. **Credentialing** - Verification status, credentialing queue
6. **Reports** - 9 category-colored report types
7. **Settings** - Team/Permissions (6 PPO roles), Notifications

## Provider NPI Fields
Each provider record has 3 distinct NPI fields:
- **Organization NPI** (Type 2) - The organization/practice
- **Servicing Provider NPI** (Type 1) - Individual rendering services
- **Pay-To NPI** - Where payments should be sent

## Key Files
- `components/admin/ThemeContext.tsx` - Theme state management
- `components/admin/AdminLayout.tsx` - Admin shell with sidebar + theme toggle
- `app/admin/page.tsx` - Main dashboard
- `app/admin/providers/new/page.tsx` - 5-step Add Provider wizard

## Pages with Theme-Aware Stat Cards
All updated to use cyan-600 on light theme:
1. `/admin` - Dashboard
2. `/admin/analytics` - Network Analytics
3. `/admin/credentialing` - Credentialing Queue
4. `/admin/contracts/expiring` - Expiring Contracts
5. `/admin/audit-logs` - HIPAA Audit Logs
6. `/admin/credentialing/verification` - Verification Status

## Development Notes
- `useSearchParams()` requires Suspense boundary in Next.js 13+
- Use inline styles for white text to prevent theme CSS overrides
- Railway requires `output: 'standalone'` in next.config.mjs

## History
- Originally "Clarity Health Network" demo
- Rebranded to "MedCare" then "TrueCare"
- Pivoted from full claims platform to PPO Network Manager (Mar 2026)
- Theme toggle added Mar 16, 2026
- Button icon layout fixes (Mar 18, 2026) - All buttons now use `icon` prop
- Theme flash fix (Mar 18, 2026) - StatCardSkeleton uses `mounted` check
- Monitoring page fully wired (Mar 18, 2026) - Gear icons + alert actions

## Button Pattern (IMPORTANT)
Always use the `icon` prop, never inline children with `mr-2`:
```tsx
// ✅ CORRECT
<Button icon={<Send className="w-4 h-4" />}>Send</Button>

// ❌ WRONG - causes icon above text
<Button><Send className="w-4 h-4 mr-2" />Send</Button>
```

## DOKit Design System (Updated Mar 18, 2026)
- **Sidebar**: Always dark `#0F172A` (Slate 900)
- **Signature Blue**: `#3B82F6` (Blue 500)
- **Primary Buttons**: `from-blue-500 to-indigo-500` gradient with blue shadow
- **Light Theme Default**: New visitors see light theme
- **Active Nav**: 3px blue bar on left + `bg-blue-500/10 text-blue-400`

## Theme Support Status (Mar 18, 2026)
**All 43 admin pages now have `isDark` context!**

### Fully Themed Pages (with cn() conditionals)
- `networks/page.tsx` - 90+ conditionals (stats, filters, grid, modals)
- `members/page.tsx` - 28 conditionals (header, table, modal)
- `credentialing/monitoring/page.tsx` - 116 conditionals (alerts, settings, history)
- `contracts/expiring/page.tsx` - Full theme support

### Theme Pattern
```tsx
const { isDark } = useTheme();

// Container
className={cn("rounded-xl border", isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")}

// Text
className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}
className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}

// Input
className={cn("px-4 py-2 rounded-lg border", 
  isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200 text-slate-900"
)}
```

## Document Viewing (Mar 18, 2026)
**Document Audit Complete**

| Page | Status | Notes |
|------|--------|-------|
| `credentialing/review` | ✅ Full | License, DEA, Board Cert, Malpractice, CV, W9 |
| `credentialing/document-requests` | ✅ Added | Modal + clickable badges |
| `providers/[providerId]` | ✅ Full | Provider credentials |
| `contracts` | ✅ Link | Opens contract document |
| `members` | ✅ Links | View ID Card & EOB |

### Document Viewer Pattern
```tsx
const [viewingDocument, setViewingDocument] = useState<{ doc: string; provider: string } | null>(null);

// Trigger
onClick={() => setViewingDocument({ doc, provider: req.provider })}

// Modal
<AnimatePresence>
  {viewingDocument && (
    <motion.div className="fixed inset-0 bg-black/60 ...">
      {/* Header with Download button */}
      {/* Preview area */}
      {/* Document details */}
    </motion.div>
  )}
</AnimatePresence>
```

## Commits Log (Mar 18, 2026)
- `f26236e` - Document viewing for Document Requests page
- `f0d3995` - isDark support to all admin pages
- `b084bbd` - isDark to provider detail pages
- `5ca030d` - Theme support for Members page
- `a4469fc` - Full theme support for Networks page
- `db50635` - Button patterns documentation
- `aa77a4f` - AnimatePresence imports fix
- `ba37ad7` - Monitoring alert action buttons
- `9a97c4a` - Monitoring schedule settings modal
- `2b6b128` - Applications page modal state fix
- `0120733` - Inline icon button fixes

## Commits Log (Mar 19, 2026)
- `cc6fb74` - Complete provider edit mode - add Taxonomy & Languages editing
- `7ad651f` - Wire provider save to API - updates now persist to JSON data
- `35e3508` - Wire Add Provider form to API - new providers now persist
- `6ef7315` - Wire Practice edit to API - practice updates now persist

## API Persistence Status (Mar 19, 2026)
All provider/practice CRUD operations now persist to JSON files:

| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/api/providers` | GET | ✅ | List/search providers |
| `/api/providers` | POST | ✅ | Create new provider |
| `/api/providers/[id]` | GET | ✅ | Get single provider |
| `/api/providers/[id]` | PUT | ✅ | Update provider |
| `/api/providers/[id]` | DELETE | ✅ | Delete provider |
| `/api/practices` | GET | ✅ | List/search practices |
| `/api/practices` | POST | ✅ | Create new practice |
| `/api/practices/[id]` | GET | ✅ | Get single practice |
| `/api/practices/[id]` | PUT | ✅ | Update practice |
| `/api/practices/[id]` | DELETE | ✅ | Delete practice |

Data files:
- `data/arizona-providers.json` - 3,600 providers
- `data/arizona-practices.json` - 237 practices
- `data/arizona-import-stats.json` - Import statistics

## Provider Edit Mode (Complete)
All sections are now editable on the provider detail page:
- ✅ Overview (name, NPI, specialty, flags, etc.)
- ✅ Billing Information
- ✅ Corresponding Address
- ✅ Taxonomy & Languages
- ✅ Credentials & Licenses
- ✅ Malpractice
- ✅ Hospital Affiliations
- ✅ Office Location
- ✅ Education
- ✅ Schedule
- ✅ Rates & Discounts
- ✅ Networks

## Commits Log (Mar 19, 2026 - Evening)
- `ecf254f` - Add functional export dropdown + claims/savings analytics + contract health + credentialing pipeline
- `1f9f73b` - Add scheduled reports functionality - Add/Edit/Delete schedules, Run Now, toggle status
- `32f0c2f` - Add HIPAA audit logging system - real-time logging, PHI access tracking, export support
- `8bfd2e3` - Update practice provider CSV import to match main format + add download template button
- `2b7d5bb` - Update CSV import template to official Solidarity 52-column format
- `c9f97a0` - Fix provider count mismatch - fetch all providers by billing NPI instead of limiting to 50
- `75e2802` - Include OIG LEIE database for Railway deployment (82k exclusion records)

## HIPAA Audit Logging (Mar 19, 2026)
Full audit trail system for compliance:

### Files
- `lib/audit.ts` - Server-side logging to JSON
- `lib/useAudit.ts` - Client-side React hook
- `app/api/audit/route.ts` - GET/POST/DELETE endpoints
- `data/audit-log.json` - Persistent log storage

### Categories
- `auth` - Login, logout, session events
- `phi_access` - Viewing member/patient data
- `data_change` - Create, update, delete operations
- `system` - System configuration changes
- `security` - Failed logins, permission denials
- `export` - Data exports, report downloads
- `verification` - Provider verification checks

### Client Hook Usage
```tsx
const { logViewProvider, logUpdateProvider, logExport } = useAudit();

// Log PHI access
logViewProvider(providerId, providerName);

// Log data change
logUpdateProvider(providerId, providerName, 'profile data');

// Log export
logExport('Network Summary', 100, false);
```

## CSV Import Template (Mar 19, 2026)
Official Solidarity 52-column format:

```
Entity #, Contract #, NPI, First Name, Last Name, Mid Init, Suffix,
Address1, Address 2, City, State, Zip Code, County, Gender,
Primary Spc Code, Primary Taxonomy Code, Secondary Spc Code, Secondary Taxonomy Code,
Facility Type, Phone #, Fax, Email, Language,
Accepts New Patients, Primary Care Flag, Behavioral Health Flag, Directory Display,
Monday Hours, Tuesday Hours, Wednesday Hours, Thursday Hours, Friday Hours, Saturday Hours, Sunday Hours,
Pricing Tier, Network Org, Start Date, End Date,
Corresponding Addr 1, Corresponding Addr 2, Corresponding City, Corresponding State, Corresponding Zip,
Contact Name, Corresponding Fax,
Billing NPI, Billing Tax ID, Billing Name, Billing Addr 1, Billing Addr 2,
Billing City, Billing State, Billing Zip, Billing Phone, Billing Fax
```

## OIG LEIE Database (Mar 19, 2026)
Federal exclusion list for provider verification:

- `data/oig-leie.json` - 82,749 exclusion records (~28MB)
- `data/oig-npi-index.json` - NPI lookup index
- `data/oig-name-index.json` - Name lookup index

### Check Usage
```tsx
import { checkOIGExclusion } from '@/lib/verification/oig';

const result = await checkOIGExclusion(firstName, lastName, npi);
// result.status: 'PASSED' | 'FAILED' | 'ERROR'
```

## Network Analytics (Mar 19, 2026)
Export dropdown with 6 report types:
1. Network Summary Report - Overview metrics
2. Provider Directory - Provider list with contracts
3. Contract Status Report - Expiring breakdown
4. Credentialing Pipeline - Applications by stage
5. Savings Analysis - Claims repricing data
6. Regional Coverage - Geographic distribution

New analytics sections:
- Claims & Network Savings (with repricing stats)
- Contract Health Overview (expiring 30/60/90 days)
- Credentialing Pipeline visualization

## Scheduled Reports (Mar 19, 2026)
Full CRUD for automated report delivery:
- Create schedule with template, frequency, recipients
- Edit existing schedules
- Run Now for immediate generation
- Toggle active/paused status
- Delete schedules

---

## Multi-Tenant Architecture (Added Mar 25, 2026)

See: `MULTI-CLIENT-PPO-PLATFORM-SPEC.md`

### Corporate Structure
- **Novarus LLC** - Holding company, owns all IP
- **DOKit LLC** - Operating company, licenses platform
- **Solidarity** - First licensee, manages clients
- **Clients** - Antidote, TPAs, each with separate database

### Key Files
- `MULTI-CLIENT-PPO-PLATFORM-SPEC.md` - Full architecture spec
- 14 sections covering HIPAA, database, security, provisioning

### Build Phases
1. ✅ Current dashboard (Antidote)
2. Multi-network support
3. Solidarity's own network
4. Client management for Solidarity
5. Onboarding wizard
6. Production hardening

---

## AWS Integration (Mar 25, 2026)

### Document Upload System
HIPAA-compliant document storage using AWS S3 and email via SES.

**Files:**
- `lib/aws/s3.ts` - Presigned URLs, SSE-S3 encryption
- `lib/aws/ses.ts` - HTML email templates
- `lib/document-requests.ts` - Token-based upload management

**APIs:**
- `POST /api/document-requests` - Create request + send email
- `POST /api/document-requests/[id]/reminder` - Send reminder
- `GET/POST /api/upload/[token]` - Upload portal

**Upload Portal:**
- `/upload/[token]` - Provider-facing upload wizard
- Step-by-step document upload
- Progress tracking, skip option, review step
- Sends confirmation email when complete

**S3 Bucket Structure:**
```
{client}/documents/{providerId}/{docType}/{timestamp}_{filename}
```

**Environment Variables:**
```env
S3_BUCKET_NAME=
S3_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
SES_REGION=us-east-1
SES_FROM_EMAIL=
```

**Graceful Fallbacks:**
- No S3 → saves to local `uploads/` folder
- No SES → logs emails to console

**S3 Bucket Requirements:**
- Block all public access
- Versioning enabled
- SSE-S3 encryption enabled
