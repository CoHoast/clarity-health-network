# Multi-Client PPO Platform Specification

## HIPAA-Compliant Multi-Tenant Architecture

**Version:** 1.0
**Date:** March 25, 2026
**Status:** Draft for Review

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Corporate & Licensing Structure](#2-corporate--licensing-structure)
3. [Platform Architecture](#3-platform-architecture)
4. [HIPAA Compliance Framework](#4-hipaa-compliance-framework)
5. [Database Architecture](#5-database-architecture)
6. [User Roles & Access Control](#6-user-roles--access-control)
7. [Client Provisioning](#7-client-provisioning)
8. [Onboarding Flows](#8-onboarding-flows)
9. [Security Requirements](#9-security-requirements)
10. [URL & Domain Structure](#10-url--domain-structure)
11. [White-Label & Branding](#11-white-label--branding)
12. [Audit & Logging](#12-audit--logging)
13. [Build Phases](#13-build-phases)
14. [Technical Implementation](#14-technical-implementation)

---

## 1. Executive Summary

### What We're Building

A multi-client PPO Network Management Platform that:

- Is owned by **Novarus LLC** (IP holder)
- Is operated by **DOKit LLC** (pays 10% licensing to Novarus)
- Is licensed to **Solidarity Health Network** (first licensee)
- Allows Solidarity to manage their own PPO network AND onboard other TPAs as clients
- Maintains complete HIPAA compliance with full data isolation between clients

### Key Parties

| Party | Role |
|-------|------|
| **Novarus LLC** | Owns all IP |
| **DOKit LLC** | Operating company, licenses platform |
| **Solidarity** | Licensee - runs their own PPO + onboards clients |
| **Antidote** | Client - manages Arizona network (their own staff) |
| **Future TPAs** | Clients - each manages their own network |

### Core Principle

**Each client's data is completely isolated.** Separate databases, separate logins, no cross-contamination possible.

---

## 2. Corporate & Licensing Structure

```
┌─────────────────────────────────────────────────────────────┐
│                      NOVARUS LLC                            │
│                  (Holding Company)                          │
│                   Owns ALL IP                               │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ Licenses IP
                           │ (10% of DOKit revenue)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      DOKit LLC                              │
│                 (Operating Company)                         │
│           Operates PPO Network Platform                     │
│              Licenses to Solidarity                         │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ Platform License
                           │ (Monthly/Annual fee)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              SOLIDARITY HEALTH NETWORK                      │
│                     (Licensee)                              │
│                                                             │
│    ┌─────────────────────────────────────────────────────┐  │
│    │  Solidarity's Own PPO Network                       │  │
│    │  (Solidarity staff manages)                         │  │
│    └─────────────────────────────────────────────────────┘  │
│                                                             │
│    ┌─────────────────────────────────────────────────────┐  │
│    │  Client Management                                  │  │
│    │  (Create & onboard TPAs)                            │  │
│    └─────────────────────────────────────────────────────┘  │
│                           │                                 │
└───────────────────────────┼─────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
   ┌────────────┐   ┌────────────┐   ┌────────────┐
   │  Antidote  │   │   TPA X    │   │   TPA Y    │
   │  (Client)  │   │  (Client)  │   │  (Client)  │
   │            │   │            │   │            │
   │ Manages AZ │   │ Manages    │   │ Manages    │
   │  Network   │   │ Own Network│   │ Own Network│
   └────────────┘   └────────────┘   └────────────┘
```

### Revenue Flow

```
TPAs pay Solidarity (PMPM or license fee)
         │
         ▼
Solidarity pays DOKit (Platform license fee)
         │
         ▼
DOKit pays Novarus (10% of revenue)
```

---

## 3. Platform Architecture

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        INFRASTRUCTURE                            │
│                     (AWS / Railway / etc.)                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                   APPLICATION LAYER                        │  │
│  │                                                            │  │
│  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │  │
│  │   │  Antidote   │  │ Solidarity  │  │   TPA X     │        │  │
│  │   │   App       │  │    App      │  │    App      │        │  │
│  │   │             │  │             │  │             │        │  │
│  │   │antidote.    │  │solidarity.  │  │tpax.        │        │  │
│  │   │sol-ppo.com  │  │sol-ppo.com  │  │sol-ppo.com  │        │  │
│  │   └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │  │
│  │          │                │                │               │  │
│  └──────────┼────────────────┼────────────────┼───────────────┘  │
│             │                │                │                  │
│  ┌──────────┼────────────────┼────────────────┼───────────────┐  │
│  │          ▼                ▼                ▼               │  │
│  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │  │
│  │   │  Antidote   │  │ Solidarity  │  │   TPA X     │        │  │
│  │   │  Database   │  │  Database   │  │  Database   │        │  │
│  │   │             │  │             │  │             │        │  │
│  │   │ (Isolated)  │  │ (Isolated)  │  │ (Isolated)  │        │  │
│  │   └─────────────┘  └─────────────┘  └─────────────┘        │  │
│  │                                                            │  │
│  │                    DATA LAYER                              │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                  PLATFORM DATABASE                         │  │
│  │           (Client registry, billing, config)               │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Database Isolation** | Separate database per client | HIPAA requirement - no data co-mingling |
| **Authentication** | Separate auth per client | No cross-client session risk |
| **Subdomain Routing** | `client.sol-ppo.com` | Clean separation, easy SSL |
| **Shared Codebase** | Yes (single deployment) | Easier maintenance |
| **Data Encryption** | AES-256 at rest, TLS in transit | HIPAA requirement |

---

## 4. HIPAA Compliance Framework

### HIPAA Requirements Addressed

#### 4.1 Administrative Safeguards

| Requirement | Implementation |
|-------------|----------------|
| **Access Controls** | Role-based access (RBAC), unique user IDs |
| **Workforce Training** | Documented in onboarding, tracked |
| **Audit Controls** | Comprehensive audit logging (6-7 year retention) |
| **Contingency Plan** | Automated backups, disaster recovery |
| **Business Associate Agreements** | Required for all clients |

#### 4.2 Physical Safeguards

| Requirement | Implementation |
|-------------|----------------|
| **Facility Access** | AWS/Cloud provider handles (SOC 2 certified) |
| **Workstation Security** | Session timeouts, auto-logout |
| **Device Controls** | No PHI on local devices |

#### 4.3 Technical Safeguards

| Requirement | Implementation |
|-------------|----------------|
| **Access Control** | MFA required, session management |
| **Audit Controls** | Every PHI access logged with timestamp, user, IP |
| **Integrity Controls** | Data validation, checksums |
| **Transmission Security** | TLS 1.3, encrypted API calls |
| **Encryption** | AES-256 at rest, field-level encryption for SSN/DOB |

#### 4.4 Data Isolation (Critical)

```
┌─────────────────────────────────────────────────────────────────┐
│                    HIPAA DATA ISOLATION                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ANTIDOTE DATABASE          SOLIDARITY DATABASE                │
│   ┌─────────────────┐        ┌─────────────────┐                │
│   │ providers       │        │ providers       │                │
│   │ practices       │   ✗    │ practices       │                │
│   │ members         │ ──────►│ members         │                │
│   │ audit_logs      │ NO     │ audit_logs      │                │
│   │ ...             │ ACCESS │ ...             │                │
│   └─────────────────┘        └─────────────────┘                │
│                                                                 │
│   - Separate connection strings                                 │
│   - No shared tables                                            │
│   - No cross-database queries                                   │
│   - Separate encryption keys                                    │
│   - Separate backup schedules                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 4.5 Business Associate Agreements (BAAs)

**Required chain of BAAs:**

```
AWS/Cloud Provider
       ↓ BAA
DOKit LLC
       ↓ BAA
Solidarity Health Network
       ↓ BAA
Each Client (Antidote, TPA X, etc.)
```

**BAA must include:**
- Permitted uses of PHI
- Safeguards required
- Breach notification procedures
- Termination and data return/destruction

---

## 5. Database Architecture

### 5.1 Platform Database (Central)

**Purpose:** Client registry, configuration, billing (NO PHI)

```sql
-- Platform database schema (no PHI here)

CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identity
  name VARCHAR(255) NOT NULL,           -- "Arizona Antidote"
  slug VARCHAR(100) UNIQUE NOT NULL,    -- "antidote" (for subdomain)
  type VARCHAR(50) NOT NULL,            -- "network" | "tpa" | "insurer"
  
  -- Licensee relationship
  licensee_id UUID REFERENCES licensees(id),  -- Solidarity
  
  -- Database connection (encrypted)
  database_url_encrypted TEXT NOT NULL,
  database_region VARCHAR(50),
  
  -- Status
  status VARCHAR(50) DEFAULT 'provisioning', -- provisioning, active, suspended, terminated
  onboarding_completed_at TIMESTAMP,
  
  -- Branding
  logo_url TEXT,
  primary_color VARCHAR(7) DEFAULT '#3B82F6',
  secondary_color VARCHAR(7) DEFAULT '#1E40AF',
  
  -- Domain
  custom_domain VARCHAR(255),           -- "providers.antidote.com" (optional)
  subdomain VARCHAR(100),               -- "antidote" → antidote.sol-ppo.com
  
  -- Billing (no PHI)
  billing_email VARCHAR(255),
  billing_contact VARCHAR(255),
  plan VARCHAR(50) DEFAULT 'standard',
  provider_limit INT,
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE licensees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,           -- "Solidarity Health Network"
  slug VARCHAR(100) UNIQUE NOT NULL,    -- "solidarity"
  
  -- Platform relationship
  platform_license_status VARCHAR(50) DEFAULT 'active',
  license_start_date DATE,
  license_renewal_date DATE,
  
  -- Billing to DOKit
  monthly_fee DECIMAL(10,2),
  revenue_share_percent DECIMAL(5,2),
  
  -- Admin access
  admin_domain VARCHAR(255),            -- "admin.solidarity-ppo.com"
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE client_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin',     -- admin, readonly
  
  -- Auth (separate from client users)
  password_hash TEXT,
  mfa_enabled BOOLEAN DEFAULT false,
  mfa_secret_encrypted TEXT,
  
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Audit log for platform operations (no PHI)
CREATE TABLE platform_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  action VARCHAR(100) NOT NULL,         -- client_created, client_suspended, etc.
  actor_id UUID,
  actor_email VARCHAR(255),
  
  target_type VARCHAR(50),              -- client, licensee
  target_id UUID,
  
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 5.2 Client Database (Per Client)

**Purpose:** All client-specific data including PHI

Each client gets an identical schema:

```sql
-- Per-client database schema (contains PHI)
-- This schema is replicated for each client

-- Providers (PHI)
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identity
  npi VARCHAR(10) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  middle_initial VARCHAR(5),
  credentials VARCHAR(50),
  
  -- PHI fields (encrypted at rest)
  ssn_encrypted TEXT,                   -- AES-256 encrypted
  dob_encrypted TEXT,                   -- AES-256 encrypted
  
  -- Professional info
  specialty VARCHAR(255),
  taxonomy_code VARCHAR(20),
  license_number VARCHAR(100),
  license_state VARCHAR(2),
  license_expiration DATE,
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending',
  credentialing_status VARCHAR(50),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Provider Locations (many per provider)
CREATE TABLE provider_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id),
  
  entity_number VARCHAR(100) UNIQUE,    -- Unique per location
  
  address_line_1 VARCHAR(255),
  address_line_2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(2),
  zip VARCHAR(10),
  county VARCHAR(100),
  
  phone VARCHAR(20),
  fax VARCHAR(20),
  email VARCHAR(255),
  
  -- Billing entity for this location
  billing_npi VARCHAR(10),
  billing_name VARCHAR(255),
  billing_tax_id_encrypted TEXT,        -- Encrypted
  
  effective_date DATE,
  termination_date DATE,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Practices
CREATE TABLE practices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  npi VARCHAR(10) UNIQUE,
  tax_id_encrypted TEXT,                -- Encrypted
  name VARCHAR(255),
  
  address_line_1 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(2),
  zip VARCHAR(10),
  
  phone VARCHAR(20),
  
  status VARCHAR(50) DEFAULT 'active',
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Users (client's staff)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  
  password_hash TEXT NOT NULL,
  mfa_enabled BOOLEAN DEFAULT false,
  mfa_secret_encrypted TEXT,
  
  role VARCHAR(50) DEFAULT 'user',      -- admin, manager, user, readonly
  
  last_login_at TIMESTAMP,
  failed_login_attempts INT DEFAULT 0,
  locked_until TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  
  token_hash TEXT NOT NULL,
  
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  revoked_at TIMESTAMP
);

-- HIPAA Audit Log (CRITICAL)
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Who
  user_id UUID REFERENCES users(id),
  user_email VARCHAR(255),
  user_name VARCHAR(255),
  
  -- What
  action VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,        -- auth, phi_access, data_change, export, etc.
  
  -- Target
  resource_type VARCHAR(50),            -- provider, practice, member, etc.
  resource_id UUID,
  resource_identifier VARCHAR(255),     -- NPI, name, etc. for searchability
  
  -- Details
  details JSONB,
  
  -- PHI tracking
  phi_accessed BOOLEAN DEFAULT false,
  phi_fields_accessed TEXT[],           -- ['ssn', 'dob', 'address']
  
  -- Context
  ip_address INET NOT NULL,
  user_agent TEXT,
  session_id UUID,
  
  -- Classification
  severity VARCHAR(20) DEFAULT 'info',  -- info, warning, error, critical
  success BOOLEAN DEFAULT true,
  
  -- Timestamp
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for audit log queries
CREATE INDEX idx_audit_log_user ON audit_log(user_id, created_at);
CREATE INDEX idx_audit_log_resource ON audit_log(resource_type, resource_id);
CREATE INDEX idx_audit_log_phi ON audit_log(phi_accessed, created_at);
CREATE INDEX idx_audit_log_date ON audit_log(created_at);

-- Contracts
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  practice_id UUID REFERENCES practices(id),
  
  contract_number VARCHAR(100),
  effective_date DATE,
  termination_date DATE,
  
  rate_type VARCHAR(50),                -- percent_off_billed, fee_schedule, etc.
  rate_value DECIMAL(10,2),
  
  status VARCHAR(50) DEFAULT 'active',
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Credentialing applications
CREATE TABLE credentialing_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  provider_id UUID REFERENCES providers(id),
  
  status VARCHAR(50) DEFAULT 'pending',
  submitted_at TIMESTAMP,
  reviewed_at TIMESTAMP,
  reviewed_by UUID REFERENCES users(id),
  
  documents JSONB,
  verification_results JSONB,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 5.3 Encryption Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                    ENCRYPTION LAYERS                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  LAYER 1: Transport                                             │
│  ├── TLS 1.3 for all connections                                │
│  ├── Certificate pinning for API calls                          │
│  └── HTTPS enforced (HSTS)                                      │
│                                                                 │
│  LAYER 2: Database (At Rest)                                    │
│  ├── AWS RDS encryption (AES-256)                               │
│  ├── Encrypted backups                                          │
│  └── Encrypted storage volumes                                  │
│                                                                 │
│  LAYER 3: Field-Level (Sensitive PHI)                           │
│  ├── SSN: AES-256-GCM with per-client key                       │
│  ├── DOB: AES-256-GCM with per-client key                       │
│  ├── Tax ID: AES-256-GCM with per-client key                    │
│  └── Keys stored in AWS KMS (separate per client)               │
│                                                                 │
│  LAYER 4: Application                                           │
│  ├── Session tokens: SHA-256 hashed                             │
│  ├── Passwords: Argon2id hashed                                 │
│  └── MFA secrets: AES-256 encrypted                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. User Roles & Access Control

### 6.1 Role Hierarchy

```
PLATFORM LEVEL (DOKit)
├── Platform Admin         - Manage licensees, billing
└── Platform Support       - View-only for troubleshooting

LICENSEE LEVEL (Solidarity)
├── Licensee Admin         - Full access + client management
├── Licensee Manager       - Manage clients, limited config
└── Licensee Support       - View client status only

CLIENT LEVEL (Antidote, TPA X)
├── Client Admin           - Full access to their network
├── Client Manager         - Manage providers, limited settings
├── Client Credentialer    - Credentialing workflow only
├── Client User            - Day-to-day operations
└── Client Read-Only       - View only, no edits
```

### 6.2 Permission Matrix

| Permission | Platform Admin | Licensee Admin | Client Admin | Client User |
|------------|:--------------:|:--------------:|:------------:|:-----------:|
| Create licensee | ✓ | - | - | - |
| View all licensees | ✓ | - | - | - |
| Create client | - | ✓ | - | - |
| View all clients | - | ✓ | - | - |
| Manage client settings | - | ✓ | ✓ | - |
| View providers | - | ✓ (own) | ✓ | ✓ |
| Edit providers | - | ✓ (own) | ✓ | Limited |
| View PHI (SSN/DOB) | - | - | ✓ | - |
| Export data | - | - | ✓ | - |
| View audit logs | ✓ | ✓ (own) | ✓ | - |
| Manage users | - | ✓ (own) | ✓ | - |

### 6.3 Authentication Requirements

| Requirement | Implementation |
|-------------|----------------|
| **Password Policy** | Min 12 chars, complexity required |
| **MFA** | Required for all admin roles |
| **Session Timeout** | 30 min inactive, 8 hour absolute |
| **Failed Logins** | Lock after 5 failures for 15 min |
| **Password Rotation** | Every 90 days (configurable) |

---

## 7. Client Provisioning

### 7.1 Provisioning Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                 CLIENT PROVISIONING FLOW                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. INITIATE                                                    │
│     └── Licensee admin clicks "Add Client"                      │
│                                                                 │
│  2. COLLECT INFO                                                │
│     ├── Client name, type                                       │
│     ├── Primary contact email                                   │
│     ├── Subdomain selection                                     │
│     └── Branding (optional)                                     │
│                                                                 │
│  3. PROVISION DATABASE                                          │
│     ├── Create new PostgreSQL database                          │
│     ├── Generate encryption keys (AWS KMS)                      │
│     ├── Run schema migrations                                   │
│     └── Store connection string (encrypted)                     │
│                                                                 │
│  4. CONFIGURE ACCESS                                            │
│     ├── Create subdomain DNS record                             │
│     ├── Generate SSL certificate                                │
│     └── Configure routing                                       │
│                                                                 │
│  5. CREATE ADMIN                                                │
│     ├── Create admin user account                               │
│     ├── Generate temporary password                             │
│     └── Send welcome email                                      │
│                                                                 │
│  6. READY                                                       │
│     └── Client can log in and start onboarding                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Provisioning Checklist

```
□ Client record created in platform database
□ PostgreSQL database created
□ Encryption keys generated in KMS
□ Database schema applied
□ Subdomain configured
□ SSL certificate issued
□ Admin user created
□ Welcome email sent
□ BAA signed (tracked)
□ Onboarding wizard ready
```

### 7.3 Automated Provisioning Script

```typescript
// Pseudocode for client provisioning

async function provisionClient(input: {
  name: string;
  slug: string;
  adminEmail: string;
  licenseeId: string;
}) {
  // 1. Validate slug is available
  const existing = await db.clients.findBySlug(input.slug);
  if (existing) throw new Error('Subdomain already taken');
  
  // 2. Create database
  const dbName = `ppo_client_${input.slug}`;
  const dbPassword = generateSecurePassword();
  await createPostgresDatabase(dbName, dbPassword);
  
  // 3. Generate encryption keys
  const kmsKeyId = await aws.kms.createKey({
    description: `PHI encryption key for ${input.name}`,
    tags: { client: input.slug }
  });
  
  // 4. Run migrations
  const dbUrl = buildDatabaseUrl(dbName, dbPassword);
  await runMigrations(dbUrl);
  
  // 5. Create client record
  const client = await db.clients.create({
    name: input.name,
    slug: input.slug,
    licenseeId: input.licenseeId,
    databaseUrlEncrypted: encrypt(dbUrl),
    kmsKeyId: kmsKeyId,
    status: 'provisioning'
  });
  
  // 6. Configure subdomain
  await configureDns(input.slug);
  await issueSslCertificate(input.slug);
  
  // 7. Create admin user
  const tempPassword = generateSecurePassword();
  await createClientAdmin(client.id, input.adminEmail, tempPassword);
  
  // 8. Send welcome email
  await sendWelcomeEmail(input.adminEmail, {
    clientName: input.name,
    loginUrl: `https://${input.slug}.sol-ppo.com`,
    tempPassword: tempPassword
  });
  
  // 9. Mark ready
  await db.clients.update(client.id, { status: 'active' });
  
  return client;
}
```

---

## 8. Onboarding Flows

### 8.1 Client Onboarding Wizard

After client admin first logs in:

```
┌─────────────────────────────────────────────────────────────────┐
│              CLIENT ONBOARDING WIZARD                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  STEP 1: Welcome & Account Setup                                │
│  ├── Change temporary password                                  │
│  ├── Enable MFA                                                 │
│  └── Confirm company details                                    │
│                                                                 │
│  STEP 2: Branding (Optional)                                    │
│  ├── Upload logo                                                │
│  └── Select colors                                              │
│                                                                 │
│  STEP 3: Import Providers                                       │
│  ├── Download CSV template                                      │
│  ├── Upload provider roster                                     │
│  ├── Review duplicates                                          │
│  └── Confirm import                                             │
│                                                                 │
│  STEP 4: Configure Credentialing                                │
│  ├── Select required documents                                  │
│  ├── Set verification rules                                     │
│  └── Configure auto-suspend policies                            │
│                                                                 │
│  STEP 5: Invite Team Members                                    │
│  ├── Add users                                                  │
│  ├── Assign roles                                               │
│  └── Send invitations                                           │
│                                                                 │
│  STEP 6: Review & Activate                                      │
│  ├── Checklist review                                           │
│  ├── Sign terms/BAA acknowledgment                              │
│  └── Activate network                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Licensee Client Management

What Solidarity sees in their admin:

```
┌─────────────────────────────────────────────────────────────────┐
│  SOLIDARITY ADMIN - CLIENT MANAGEMENT                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ + Add New Client                                           │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  CLIENTS                                                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 🟢 Arizona Antidote                                        │ │
│  │    antidote.sol-ppo.com                                    │ │
│  │    37 Providers • Active since Jan 2026                    │ │
│  │    [View] [Settings]                                       │ │
│  ├────────────────────────────────────────────────────────────┤ │
│  │ 🟡 TPA X Corp                                              │ │
│  │    tpax.sol-ppo.com                                        │ │
│  │    Onboarding (Step 3/6)                                   │ │
│  │    [View] [Continue Onboarding]                            │ │
│  ├────────────────────────────────────────────────────────────┤ │
│  │ 🟢 Solidarity PPO Network                                  │ │
│  │    solidarity.sol-ppo.com                                  │ │
│  │    0 Providers • Setup in progress                         │ │
│  │    [Manage] [Settings]                                     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.3 What Licensee Can See About Clients

| Data | Visible to Licensee? | Reason |
|------|:--------------------:|--------|
| Client name, status | ✓ | Operational need |
| Provider count | ✓ | Usage/billing |
| Onboarding progress | ✓ | Support |
| User count | ✓ | License tracking |
| Last activity | ✓ | Health monitoring |
| Provider names/details | ✗ | PHI - no access |
| Audit logs | ✗ | PHI - no access |
| SSN/DOB/TaxID | ✗ | PHI - absolutely not |

**Solidarity can see high-level stats but CANNOT access PHI.**

---

## 9. Security Requirements

### 9.1 Authentication

| Requirement | Standard |
|-------------|----------|
| Password minimum length | 12 characters |
| Password complexity | Upper, lower, number, special |
| Password history | Last 12 passwords |
| MFA | Required for admin roles, optional for users |
| MFA methods | TOTP (Google Authenticator, etc.) |
| Session duration | 30 min inactive, 8 hour max |
| Concurrent sessions | Max 3 per user |

### 9.2 Authorization

| Requirement | Implementation |
|-------------|----------------|
| Principle of least privilege | Default deny, explicit grants |
| Role separation | Admin, Manager, User, ReadOnly |
| Resource-level access | Users only see their client's data |
| PHI access | Logged, limited to credentialed roles |

### 9.3 Network Security

| Requirement | Implementation |
|-------------|----------------|
| TLS | 1.3 required, 1.2 minimum |
| HSTS | Enabled, 1 year |
| API authentication | JWT with short expiry (15 min) |
| Rate limiting | 100 req/min per user, 1000/min per client |
| WAF | AWS WAF with OWASP rules |
| DDoS protection | AWS Shield |

### 9.4 Data Security

| Requirement | Implementation |
|-------------|----------------|
| Encryption at rest | AES-256 (RDS native) |
| Encryption in transit | TLS 1.3 |
| Field-level encryption | AES-256-GCM for SSN, DOB, Tax ID |
| Key management | AWS KMS, separate key per client |
| Backup encryption | Same as primary |
| Log encryption | CloudWatch with KMS |

---

## 10. URL & Domain Structure

### 10.1 URL Patterns

```
DOKIT PLATFORM ADMIN (You)
└── admin.dokit.ai/ppo/
    ├── /licensees           - List licensees
    ├── /licensees/[id]      - Licensee details
    └── /billing             - Platform billing

SOLIDARITY LICENSEE ADMIN
└── admin.solidarity-ppo.com/
    ├── /network             - Solidarity's own PPO
    ├── /clients             - Client management
    ├── /clients/new         - Onboard new client
    └── /clients/[id]        - Client overview (high-level)

CLIENT DASHBOARDS
├── antidote.solidarity-ppo.com/
│   ├── /admin/providers
│   ├── /admin/credentialing
│   └── ... (full dashboard)
│
├── solidarity.solidarity-ppo.com/
│   └── ... (Solidarity's own PPO network)
│
└── tpax.solidarity-ppo.com/
    └── ... (TPA X's dashboard)
```

### 10.2 DNS Configuration

```
solidarity-ppo.com
├── admin.solidarity-ppo.com      → Licensee admin
├── antidote.solidarity-ppo.com   → Client: Antidote
├── solidarity.solidarity-ppo.com → Client: Solidarity PPO
├── tpax.solidarity-ppo.com       → Client: TPA X
└── *.solidarity-ppo.com          → Wildcard for new clients
```

### 10.3 Custom Domains (Optional)

Clients can optionally use their own domain:

```
providers.antidote-health.com → antidote.solidarity-ppo.com
```

Requires:
- CNAME record to our infrastructure
- SSL certificate generation
- Domain verification

---

## 11. White-Label & Branding

### 11.1 Customizable Elements

| Element | Customizable By |
|---------|-----------------|
| Logo | Client |
| Primary color | Client |
| Secondary color | Client |
| Favicon | Client |
| Login page background | Client |
| Email templates | Licensee (shared) or Client |
| Help documentation URL | Client |
| Support email | Client |

### 11.2 Branding Configuration

```typescript
interface ClientBranding {
  logo: {
    url: string;
    width: number;
    height: number;
  };
  colors: {
    primary: string;      // "#3B82F6"
    secondary: string;    // "#1E40AF"
    accent: string;       // "#10B981"
  };
  favicon: string;
  loginBackground: string;
  companyName: string;
  supportEmail: string;
  helpUrl: string;
}
```

### 11.3 What's NOT Customizable

- Core functionality
- Security features
- HIPAA compliance features
- Audit logging

---

## 12. Audit & Logging

### 12.1 What Gets Logged

**ALWAYS logged:**
- All authentication events (login, logout, failed attempts)
- All PHI access (view, edit, export)
- All data changes (create, update, delete)
- All user management actions
- All export/download actions
- All API calls
- All admin actions

### 12.2 Audit Log Schema

```typescript
interface AuditEvent {
  id: string;
  timestamp: string;           // ISO 8601
  
  // Actor
  userId: string;
  userEmail: string;
  userName: string;
  userRole: string;
  
  // Action
  action: string;              // "provider.view", "provider.update", etc.
  category: AuditCategory;     // "auth", "phi_access", "data_change", "export"
  
  // Target
  resourceType: string;        // "provider", "practice", "user"
  resourceId: string;
  resourceIdentifier: string;  // NPI, name for searchability
  
  // PHI tracking
  phiAccessed: boolean;
  phiFieldsAccessed: string[]; // ["ssn", "dob"]
  
  // Context
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  
  // Details
  details: object;             // Change details, before/after
  
  // Classification
  severity: "info" | "warning" | "error" | "critical";
  success: boolean;
}
```

### 12.3 Retention Requirements

| Log Type | Retention | Reason |
|----------|-----------|--------|
| PHI Access Logs | 7 years | HIPAA requirement |
| Authentication Logs | 7 years | Security audit |
| Data Change Logs | 7 years | Compliance |
| API Logs | 1 year | Operational |
| Error Logs | 1 year | Debugging |

### 12.4 Log Security

- Logs stored in separate database/service (AWS CloudWatch)
- Logs encrypted at rest
- Logs immutable (append-only)
- Log access itself is logged
- Regular log integrity verification

---

## 13. Build Phases

### Phase 1: Foundation (Current)
**Timeline:** Now
**Status:** ✅ Complete

- Single-network dashboard (Antidote)
- Provider management
- Credentialing workflow
- Audit logging
- CSV import with Entity Number

### Phase 2: Multi-Network Support
**Timeline:** 2-3 weeks
**Effort:** Medium

- [ ] Add `network_id` to database schema
- [ ] Network context in all queries
- [ ] Network configuration table
- [ ] Tag existing data as "Antidote" network
- [ ] Network-aware API routes

### Phase 3: Solidarity's Own Network
**Timeline:** 1 week
**Effort:** Low

- [ ] Provision Solidarity's network
- [ ] Separate database
- [ ] Solidarity admin users
- [ ] Same dashboard features

### Phase 4: Client Management for Solidarity
**Timeline:** 2-3 weeks
**Effort:** Medium

- [ ] Client management page in Solidarity admin
- [ ] Create client flow
- [ ] Client provisioning automation
- [ ] Subdomain/routing setup
- [ ] Admin invitation system

### Phase 5: Onboarding Wizard
**Timeline:** 1-2 weeks
**Effort:** Medium

- [ ] Step-by-step onboarding flow
- [ ] Progress tracking
- [ ] Checklist completion
- [ ] Welcome emails

### Phase 6: Polish & Production
**Timeline:** 1-2 weeks
**Effort:** Medium

- [ ] Custom domain support
- [ ] Enhanced branding options
- [ ] Documentation
- [ ] Security hardening audit
- [ ] Load testing

---

## 14. Technical Implementation

### 14.1 Database Connection Management

```typescript
// lib/database.ts

import { Pool } from 'pg';

// Cache database connections per client
const connectionPools = new Map<string, Pool>();

export async function getClientDb(clientSlug: string): Promise<Pool> {
  // Check cache
  if (connectionPools.has(clientSlug)) {
    return connectionPools.get(clientSlug)!;
  }
  
  // Get connection string from platform DB
  const client = await platformDb.clients.findBySlug(clientSlug);
  if (!client) throw new Error('Client not found');
  
  const connectionString = decrypt(client.databaseUrlEncrypted);
  
  // Create pool
  const pool = new Pool({
    connectionString,
    max: 20,
    idleTimeoutMillis: 30000
  });
  
  connectionPools.set(clientSlug, pool);
  return pool;
}
```

### 14.2 Request Context

```typescript
// middleware.ts

export async function middleware(request: NextRequest) {
  // Extract client from subdomain
  const hostname = request.headers.get('host');
  const subdomain = hostname?.split('.')[0];
  
  if (!subdomain || subdomain === 'admin') {
    return NextResponse.next();
  }
  
  // Validate client exists
  const client = await getClient(subdomain);
  if (!client) {
    return NextResponse.redirect('/not-found');
  }
  
  // Add client context to request
  const response = NextResponse.next();
  response.headers.set('x-client-id', client.id);
  response.headers.set('x-client-slug', client.slug);
  
  return response;
}
```

### 14.3 API Route Pattern

```typescript
// app/api/providers/route.ts

export async function GET(request: NextRequest) {
  // Get client context
  const clientSlug = request.headers.get('x-client-slug');
  if (!clientSlug) {
    return NextResponse.json({ error: 'No client context' }, { status: 400 });
  }
  
  // Get client's database
  const db = await getClientDb(clientSlug);
  
  // Query only this client's data
  const providers = await db.query('SELECT * FROM providers WHERE ...');
  
  // Log PHI access
  await logAuditEvent({
    clientSlug,
    action: 'providers.list',
    category: 'phi_access',
    phiAccessed: true,
    // ... other details
  });
  
  return NextResponse.json({ providers });
}
```

---

## Appendix A: HIPAA Checklist

### Pre-Launch Checklist

- [ ] BAA signed with cloud provider (AWS)
- [ ] BAA template ready for clients
- [ ] Encryption at rest enabled
- [ ] Encryption in transit (TLS 1.3)
- [ ] Field-level encryption for SSN/DOB/TaxID
- [ ] Audit logging complete
- [ ] Audit log retention configured (7 years)
- [ ] Access controls implemented
- [ ] MFA enabled for admins
- [ ] Session management secure
- [ ] Password policy enforced
- [ ] Data backup encrypted
- [ ] Disaster recovery plan documented
- [ ] Security training documentation
- [ ] Incident response plan
- [ ] Privacy policy published
- [ ] Terms of service published

---

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| **Licensee** | Company that licenses the platform (e.g., Solidarity) |
| **Client** | End user of the platform, managed by licensee (e.g., Antidote) |
| **Network** | A PPO network with providers and contracts |
| **PHI** | Protected Health Information under HIPAA |
| **BAA** | Business Associate Agreement |
| **PMPM** | Per Member Per Month (pricing model) |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-25 | Ted | Initial draft |

---

*End of Specification*
