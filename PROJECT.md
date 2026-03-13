# Clarity Health Network - Demo Platform

**Status**: ✅ COMPLETE (Mar 12, 2026)
**Live URL**: https://clarity-health-demo.surge.sh
**Purpose**: 100% functional PPO network demo for client presentations

---

## Quick Start

```bash
cd ~/agent-hub/clarity-health-demo
npm run dev     # Development at localhost:3000
npm run build   # Production build
npx surge out clarity-health-demo.surge.sh  # Deploy
```

---

## Portal Overview

| Portal | Route | Theme | Screens | Status |
|--------|-------|-------|---------|--------|
| Marketing | `/` | Light | 9 pages | ✅ Complete |
| Member | `/member` | Teal (#0d9488) | 13 screens | ✅ Complete |
| Provider | `/provider` | Slate (#475569) | 13 screens | ✅ Complete |
| Employer | `/employer` | Orange (#ea580c) | 12 screens | ✅ Complete |
| Admin | `/admin` | Purple (dark) | 15+ screens | ✅ Complete |

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Surge (static export)

---

## Project Structure

```
clarity-health-demo/
├── app/
│   ├── page.tsx                 # Marketing homepage
│   ├── about/                   # Marketing pages
│   ├── members/
│   ├── providers/
│   ├── employers/
│   ├── contact/
│   ├── login/
│   ├── member/                  # Member Portal (13 screens)
│   │   ├── page.tsx             # Dashboard
│   │   ├── claims/
│   │   ├── id-card/
│   │   ├── documents/
│   │   ├── benefits/
│   │   ├── appointments/
│   │   ├── prescriptions/
│   │   ├── cost-estimator/
│   │   ├── find-provider/
│   │   ├── messages/
│   │   ├── help/
│   │   └── settings/
│   ├── provider/                # Provider Portal (13 screens)
│   │   ├── page.tsx             # Dashboard
│   │   ├── claims/
│   │   ├── payments/
│   │   ├── contracts/
│   │   ├── credentialing/
│   │   ├── patients/
│   │   ├── eligibility/
│   │   ├── fee-schedule/
│   │   ├── submit-claim/
│   │   ├── documents/
│   │   ├── profile/
│   │   ├── messages/
│   │   └── settings/
│   ├── employer/                # Employer Portal (12 screens)
│   │   ├── page.tsx             # Dashboard
│   │   ├── roster/
│   │   ├── billing/
│   │   ├── analytics/
│   │   ├── enrollment/
│   │   ├── reports/
│   │   ├── documents/
│   │   ├── stop-loss/
│   │   ├── support/
│   │   └── settings/
│   ├── admin/                   # Admin Dashboard (15+ screens)
│   │   ├── page.tsx             # Dashboard
│   │   ├── claims/
│   │   ├── members/
│   │   ├── providers/
│   │   ├── contracts/
│   │   ├── fee-schedules/
│   │   ├── eligibility/
│   │   ├── fraud-shield/
│   │   ├── credentialing/
│   │   ├── payments/
│   │   ├── reports/
│   │   ├── compliance/
│   │   ├── network-map/
│   │   ├── users/
│   │   └── settings/
│   └── docs/                    # Document viewers
│       ├── eob/
│       ├── id-card/
│       └── contract/
├── components/
│   ├── marketing/               # Header, Footer
│   ├── member/                  # MemberLayout
│   ├── provider/                # ProviderLayout
│   ├── employer/                # EmployerLayout
│   ├── admin/                   # AdminLayout, modals
│   └── pulse/                   # Pulse AI chat for each portal
├── public/
│   ├── clarity-logo.png         # Full color logo
│   └── clarity-logo-dark.png    # White text for dark sidebars
└── out/                         # Static export (deploy this)
```

---

## Key Features

### Every Portal Has:
- ✅ Sidebar navigation with active states
- ✅ Mobile-responsive layout
- ✅ Pulse AI chat (slide-in from right)
- ✅ All buttons trigger modals or navigation
- ✅ Success animations on form submissions
- ✅ Realistic mock data

### Member Portal Highlights:
- Appointment booking with detail modals
- Claims with EOB viewer links
- Digital ID card with wallet/email/print
- Document upload and sharing
- Cost estimator tool

### Provider Portal Highlights:
- Claim submission and tracking
- Payment history with ERA downloads
- Contract viewer with amendments
- Credentialing document management
- Patient eligibility checks

### Employer Portal Highlights:
- Employee roster management
- Invoice payment with ACH flow
- Claims analytics with drill-downs
- Open enrollment tracking
- Stop-loss monitoring

### Admin Dashboard Highlights:
- Light/dark theme toggle
- Multi-tenant ready (client isolation)
- FraudShield AI alerts with investigation workflow
- Real-time eligibility feed
- Contract renewal workflow
- Fee schedule management with code viewer

---

## Design Decisions

1. **Theme Colors**: Each portal has a distinct color to help users know where they are
2. **Dark Logo**: Used `clarity-logo-dark.png` on dark sidebars for visibility
3. **Employer Orange**: Chose orange-700 (#ea580c) - amber was too brownish, orange-600 too bright
4. **Admin Dark Mode**: Default dark theme feels more "command center"
5. **Pulse AI**: Consistent slide-in-from-right pattern across all portals
6. **Document Viewers**: Created reusable pages under `/docs/` for EOBs, ID cards, contracts

---

## Deployment

Currently deployed to Surge (static hosting):
```bash
npm run build
npx surge out clarity-health-demo.surge.sh
```

For Railway with PostgreSQL (production):
1. Connect to Railway
2. Add PostgreSQL database
3. Update environment variables
4. Deploy via GitHub

---

## Future Enhancements

- [ ] Wire up to backend APIs (dokit-healthcare modules)
- [ ] Add real authentication
- [ ] Connect to PostgreSQL for real data
- [ ] Add real-time WebSocket updates
- [ ] Implement actual Pulse AI with LLM
- [ ] Add data export functionality
- [ ] Email/SMS notifications

---

## Related Files

- `~/agent-hub/dokit-healthcare/modules/` - Backend modules (23)
- `PLATFORM-SPEC.md` - Full platform specification
- `memory/2026-03-12.md` - Daily notes on completion

---

*Built by Ted • March 2026*
