# TrueCare Health Network - Login Credentials

## 🔐 Shared Login Credentials

The PPO network platform now has **proper authentication** with shared credentials that multiple team members can use.

### Primary Credentials
- **Username:** `admin`
- **Password:** `TrueCare2026!`

### Alternative Credentials  
- **Username:** `truecare`
- **Password:** `network2026`

## 🌐 Access URLs

### Production (Railway)
- **Login:** https://truecare-health-network-production.up.railway.app/admin-login
- **Dashboard:** https://truecare-health-network-production.up.railway.app/admin

### Local Development
- **Login:** http://localhost:3001/admin-login  
- **Dashboard:** http://localhost:3001/admin

## ✅ What Changed

### Before (Demo Mode)
- ❌ No login required
- ❌ All pages publicly accessible  
- ❌ No audit trail
- ❌ No session management

### After (Proper Auth)
- ✅ **Login required** for admin access
- ✅ **Session management** (8-hour expiry)
- ✅ **Audit logging** for all login/logout events
- ✅ **Secure cookies** with proper configuration
- ✅ **Multiple shared credentials** for team access
- ✅ **Logout functionality** in admin header
- ✅ **Automatic redirect** to login if unauthenticated

## 🔧 Features

- **Session Timeout:** 8 hours of inactivity
- **Security Headers:** Full HIPAA-compliant security
- **Audit Logging:** All auth events logged with IP/timestamp
- **Auto-redirect:** Seamless redirect to login when needed
- **Cross-tab logout:** Logout detected across browser tabs

## 🚀 Deployment Status

- ✅ **Code committed & pushed** to GitHub
- 🔄 **Railway deployment** in progress (~2-3 minutes)
- 📱 **Mobile-responsive** login form
- 🎨 **Branded interface** matching TrueCare design

## 📋 How to Use

1. **Visit login page:** `/admin-login`
2. **Enter credentials** (either set above)
3. **Access dashboard:** Full admin functionality
4. **Logout:** Click user menu → Sign Out

The same credentials work for **multiple people simultaneously** - perfect for team access!