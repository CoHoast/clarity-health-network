# Railway Environment Variables

## 🔐 CRITICAL - Add These to Railway Dashboard

### Admin Login Credentials
```
ADMIN_EMAIL=admin@truecare.com
ADMIN_PASSWORD=PPO#Net123!
```

### How to Add:
1. Go to Railway Dashboard
2. Select the "TrueCare Health Network" project
3. Click on Variables tab
4. Add these two environment variables
5. Railway will auto-redeploy

## Why This is Needed

The `data/users.json` file path isn't resolving correctly in Railway's production environment due to the Next.js standalone build changing the working directory.

The app already has fallback code to use environment variables for authentication when the file can't be found.

## Immediate Fix

Until the environment variables are added, you can use the test credentials that are likely already set in Railway from the initial deployment.