# 🎭 Demo Mode Access - PPO Dashboard (HIPAA Compliant)

## 🎯 **INSTANT ACCESS - NO LOGIN PAGE**

**Any URL on the domain redirects directly to the admin dashboard:**

- https://truecare-health-network-production.up.railway.app
- https://truecare-health-network-production.up.railway.app/admin  
- https://truecare-health-network-production.up.railway.app/login
- https://truecare-health-network-production.up.railway.app/admin-login

**All paths lead directly to the dashboard - no login pages to navigate!**

## ✅ **Demo Features:**
- ✅ **Direct access** to admin dashboard (homepage redirects automatically)
- ✅ **All PHI/PII data masked** for HIPAA compliance
- ✅ **No authentication required** for demo purposes  
- ✅ **Full functionality** with safe, masked data
- ✅ **No login pages** - everything redirects to dashboard

## 🛡️ **HIPAA Compliance Through Data Masking**

All sensitive data is automatically masked:
- **SSN**: `***-**-1234` (shows last 4 digits)
- **Date of Birth**: `**/**/1985` (shows year only)  
- **Tax ID/EIN**: `XX-XXX1234` (shows last 4 digits)
- **Email**: `j***@*****.com` (masks domain and most of name)
- **Phone**: `(XXX) XXX-1234` (shows last 4 digits)
- **Addresses**: `XXX Main Street` (masks street numbers)

## 🎭 **Demo Features Available**
- ✅ **Provider Management** (3,600+ masked provider records)
- ✅ **Contract Management** (all financial data masked)  
- ✅ **Credentialing System** (PII/PHI masked)
- ✅ **Rate & Discount Management** 
- ✅ **Reports & Analytics** (demo data)
- ✅ **Team & Permissions** (demo roles)

## 📋 **Legacy Login Credentials (No Longer Needed)**

**Chris's Admin Access:**
- **Email**: `chris@claimlynk.com`
- **Password**: `ClaimAdmin2026!`
- **Role**: Super Admin (full system access)

**Admin Access:**
- **Email**: `admin@solidarity.com`
- **Password**: `SolidAdmin2024!`
- **Role**: Admin (full dashboard access)

**Manager Access:**
- **Email**: `manager@solidarity.com`
- **Password**: `SolidMgr2024!`
- **Role**: Manager (limited admin functions)

**Staff Access:**
- **Email**: `staff@solidarity.com`
- **Password**: `SolidStaff2024!`
- **Role**: Staff (read-only + basic operations)

**Provider Access:**
- **Email**: `provider@arizona.com`
- **Password**: `AzProvider2024!`
- **Role**: Provider (provider portal view)

## Super Admin Portal (via /admin-login)

**Super Admin:**
- **Email**: `superadmin@solidarity.com`
- **Password**: `SuperSolid2024!`
- **Role**: Super Admin (system-level access)

## Security Features ✅

- **Real Password Validation** - No more "any password" demo mode
- **PBKDF2 Password Hashing** - Industry-standard 100k iterations
- **Account Lockout** - 5 failed attempts = 15 minute lockout
- **Audit Logging** - All login attempts tracked with IP/user agent
- **Rate Limiting** - Protection against brute force attacks
- **Role-Based Access** - Different permission levels per user type

## Environment Variables (Railway)

Set these in Railway dashboard:

```bash
ADMIN_EMAIL=superadmin@solidarity.com
ADMIN_PASSWORD=SuperSolid2024!
```

## Notes

- All passwords follow strong complexity requirements
- Demo users are separate from admin portal users
- Failed login attempts are logged and monitored
- Session tokens expire after 8 hours
- IP allowlisting can be configured (currently disabled)

🎸 **Excellent! Security is now locked down properly.**