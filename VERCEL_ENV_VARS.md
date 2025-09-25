# Vercel Environment Variables Setup

## Required Environment Variables for Production

Add these to your **Vercel Dashboard** → **Settings** → **Environment Variables**:

### Dashboard (peek-a-boo-dashboard)
```
NEXT_PUBLIC_SDK_SERVICE_URL = https://peek-a-boo-sdk-service-production.up.railway.app
NEXTAUTH_URL = https://your-dashboard.vercel.app  
NEXTAUTH_SECRET = generate-a-strong-secret-key
ROLLBAR_ACCESS_TOKEN = your-rollbar-token-here
NODE_ENV = production
```

### SDK Service (if deploying to Railway)
```
DATABASE_URL = your-production-database-url
DATABASE_DIRECT_URL = your-production-database-url
PORT = $PORT  (Railway auto-sets this)
NODE_ENV = production
```

## Local Development (Already Created)
- ✅ `apps/dashboard/.env.local` - Dashboard local config
- ✅ `apps/sdk-service/.env` - API local config  
- ✅ `packages/core/.env` - Database local config

## Next Steps:
1. Deploy your NestJS API to Railway
2. Get the Railway URL
3. Add the Railway URL to Vercel as `NEXT_PUBLIC_SDK_SERVICE_URL`
4. Add your Rollbar token to Vercel
5. Generate a secure `NEXTAUTH_SECRET`