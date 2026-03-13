# Clarity Health Network — Demo Platform

**Status:** Build in progress
**Purpose:** Fully functional PPO platform for client demonstrations

## What This Is

A 100% operational PPO platform — not mockups, not static pages. Real functionality with test data.

## Components

| Component | Description | Status |
|-----------|-------------|--------|
| Marketing Site | Public website for Clarity Health Network | 🔲 To build |
| Member Portal | Self-service for PPO members | 🔲 To build |
| Provider Portal | Self-service for network providers | 🔲 To build |
| Admin Dashboard | Full admin with 23 modules | 🔲 To build |
| Pulse AI | AI assistant in all portals | 🔲 To integrate |

## Backend (Ready)

All 23 healthcare modules are built and ready:
- Location: `~/agent-hub/dokit-healthcare/modules/`
- Platform: `~/agent-hub/dokit-healthcare/platform/`
- Shared libs: `~/agent-hub/dokit-healthcare/shared/`

## Quick Start

```bash
# Navigate to project
cd ~/agent-hub/american-ppo-demo

# Read the full spec
cat PLATFORM-SPEC.md
```

## Team

| Role | Agent | Responsibility |
|------|-------|----------------|
| Backend | Architect 📐 | All modules built, API support |
| Frontend | Ted 🎸 | UI build, wiring, deployment |
| Oversight | Chris | Business requirements, approval |

## Documentation

- [PLATFORM-SPEC.md](./PLATFORM-SPEC.md) — Complete build specification
