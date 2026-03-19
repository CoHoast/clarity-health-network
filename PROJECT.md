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
