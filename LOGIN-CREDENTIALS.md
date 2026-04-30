# 🔒 Secure Login Credentials - PPO Dashboard

**Live URL**: https://clarity-health-network-production.up.railway.app

## Demo Users (via /login)

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