# Railway Deployment - SDK Service

Complete guide to deploying the NestJS SDK Service to Railway from our Turborepo + pnpm monorepo.

## Overview

[Railway](https://railway.app/) is our deployment platform for the SDK Service. This guide covers the unique challenges and solutions for deploying from a monorepo.

## Monorepo Deployment Challenges

When deploying from a monorepo, we face specific challenges:

1. **Workspace Dependencies**: SDK Service depends on `@peek-a-boo/core`
2. **Build Order**: Core package must be built before SDK Service
3. **Root Directory**: Railway needs to know which directory contains the service
4. **Package Manager**: Using pnpm requires special configuration
5. **Build Context**: Build commands must run from monorepo root

## Prerequisites

Before you begin:

- Railway account ([sign up](https://railway.app/))
- GitHub repository access
- Local development environment working
- Railway CLI installed (optional, for manual deployments)

## Step 1: Create Railway Project

1. Log in to Railway dashboard
2. Click **"New Project"**
3. Select **"GitHub Repo"** as deployment source
4. Choose the Peek-a-boo repository
5. Name your project: `peek-a-boo-sdk-service`

## Step 2: Configure Root Directory

**Critical**: Railway needs to know which service to deploy.

1. Go to project **Settings** tab
2. Set **Root Directory** to `apps/sdk-service`
3. Save settings

This ensures Railway only deploys the SDK Service, not the entire monorepo.

## Step 3: Configure Environment Variables

Add all required environment variables in the **Variables** tab:

```bash
# Application
PORT=6001                    # Railway may override this
NODE_ENV=production

# Database (Supabase)
DATABASE_URL=               # PostgreSQL connection string
DATABASE_DIRECT_URL=        # Direct connection (for migrations)

# Optional
LOG_LEVEL=info
```

### Getting Supabase Connection String

1. Go to your Supabase project
2. Navigate to **Settings** > **Database**
3. Copy the **Connection Pooling** URL (for DATABASE_URL)
4. Copy the **Direct Connection** URL (for DATABASE_DIRECT_URL)

## Step 4: Configure railway.json

Railway uses `railway.json` for build and deployment configuration. This file already exists in `apps/sdk-service/railway.json`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd ../.. && pnpm install && pnpm build:sdk-service"
  },
  "deploy": {
    "startCommand": "node dist/main.js",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Understanding the Configuration

**Build Section:**
- `cd ../..`: Navigate from `apps/sdk-service` to monorepo root
- `pnpm install`: Install all workspace dependencies
- `pnpm build:sdk-service`: Turborepo builds SDK Service + dependencies

**Deploy Section:**
- `startCommand`: Runs the compiled NestJS application
- `healthcheckPath`: Railway checks `/health` endpoint
- `restartPolicy`: Auto-restart on failure (max 10 retries)

### Why Turborepo for Builds?

Turborepo provides critical advantages:

1. **Dependency Awareness**: Automatically builds `@peek-a-boo/core` first
2. **Incremental Builds**: Only rebuilds changed packages
3. **Caching**: Reuses build artifacts for speed
4. **Consistency**: Same build process in dev and production
5. **Parallel Execution**: Builds multiple packages simultaneously

## Step 5: Test Build Locally

Before deploying, verify the build works locally:

```bash
# From monorepo root
pnpm install
pnpm build:sdk-service

# Test startup
cd apps/sdk-service
node dist/main.js

# Verify health endpoint
curl http://localhost:6001/health
```

## Step 6: Deploy to Railway

### Option A: Automatic Deployment (GitHub)

Railway automatically deploys when you push to GitHub:

1. Push code to `main` branch
2. Railway detects changes
3. Builds and deploys automatically
4. Monitor deployment in Railway dashboard

### Option B: Manual Deployment (CLI)

For manual control:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
cd apps/sdk-service
railway link

# Deploy
railway up
```

Or use the pnpm script from monorepo root:

```bash
pnpm run deploy:sdk-service
```

## Step 7: Verify Deployment

After deployment completes:

1. Go to Railway **dashboard**
2. Select your project and service
3. Check **Deployments** tab for status
4. Click **Generated Domain** to open your service
5. Visit `/health` endpoint: `https://your-domain.railway.app/health`

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-26T12:00:00Z"
}
```

## GitHub Actions CI/CD (Optional)

For automated deployments with testing, add this workflow:

Create `.github/workflows/deploy-sdk-service.yml`:

```yaml
name: Deploy SDK Service

on:
  push:
    branches:
      - main
    paths:
      - 'apps/sdk-service/**'
      - 'packages/core/**'
      - '.github/workflows/deploy-sdk-service.yml'

jobs:
  deploy:
    name: Deploy to Railway
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
          run_install: false

      - name: Get pnpm store directory
        id: pnpm-cache
        shell: bash
        run: |
          echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT

      - name: Setup pnpm cache
        uses: actions/cache@v3
        with:
          path: ${{ steps.pnpm-cache.outputs.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-

      - name: Install dependencies
        run: pnpm install

      - name: Build service and dependencies
        run: pnpm build:sdk-service

      - name: Deploy to Railway
        uses: bervProject/railway-deploy@main
        with:
          railway-token: ${{ secrets.RAILWAY_TOKEN }}
          service: ${{ secrets.RAILWAY_SERVICE_SDK }}
          directory: ./apps/sdk-service
```

### Setup GitHub Secrets

1. Go to repository **Settings** > **Secrets and variables** > **Actions**
2. Add secrets:
   - `RAILWAY_TOKEN`: Get from Railway dashboard > Settings > Developer > New Token
   - `RAILWAY_SERVICE_SDK`: Your Railway service name

## Troubleshooting

### Build Failures

**Symptom**: Build fails on Railway

**Solutions**:
```bash
# Check build logs in Railway dashboard
# Common issues:

# 1. Missing dependencies
# Fix: Ensure all workspace dependencies in package.json

# 2. Incorrect build command
# Fix: Verify railway.json buildCommand

# 3. Path issues
# Fix: Check Root Directory setting (should be apps/sdk-service)

# 4. Test locally first:
pnpm build:sdk-service
```

### Runtime Errors

**Symptom**: Service crashes after deployment

**Solutions**:
```bash
# Check service logs in Railway dashboard

# 1. Environment variables
# Fix: Verify all required env vars are set

# 2. Database connection
# Fix: Check DATABASE_URL is correct

# 3. Health check failing
# Fix: Ensure /health endpoint is working
```

### Monorepo-Specific Issues

**Symptom**: `@peek-a-boo/core` not found

**Solutions**:
```bash
# 1. Build order issue
# Fix: Ensure buildCommand includes pnpm build:sdk-service (not just nest build)

# 2. Workspace dependency not installed
# Fix: Ensure pnpm install runs from monorepo root

# 3. Test dependency resolution locally:
cd apps/sdk-service
node -e "require('@peek-a-boo/core')"
```

### pnpm Issues

**Symptom**: Module resolution errors

**Solutions**:
```bash
# 1. Add .npmrc in monorepo root:
node-linker=hoisted

# 2. Verify pnpm version:
# Railway should use pnpm 8+

# 3. Clear Railway cache:
# Go to Settings > Clear Build Cache
```

### Port Configuration

**Symptom**: Service not accessible

**Solutions**:
```bash
# Railway assigns PORT dynamically
# Ensure your service reads from process.env.PORT

# In NestJS main.ts:
const port = process.env.PORT || 6001;
await app.listen(port);
```

### Deployment Timeouts

**Symptom**: Build times out

**Solutions**:
```bash
# 1. Optimize build:
# Remove unnecessary dependencies
# Use Turborepo caching

# 2. Increase timeout:
# Go to Railway Settings > Build Timeout

# 3. Pre-build dependencies:
# Consider using Docker for complex builds
```

## Performance Tips

### Enable Remote Caching

Speed up builds with Turborepo remote caching:

```bash
# In turbo.json
{
  "remoteCache": {
    "enabled": true
  }
}
```

### Optimize Dependencies

Remove unused dependencies:

```bash
# Analyze bundle size
pnpm list --depth=0

# Remove unused packages
pnpm remove <package-name>
```

## Monitoring & Logs

### Viewing Logs

```bash
# Via Railway dashboard:
# Go to Deployments > Select deployment > View Logs

# Via Railway CLI:
railway logs
```

### Setting Up Alerts

1. Go to Railway project **Settings**
2. Enable **Notifications**
3. Add webhook URLs for alerts
4. Configure alert conditions

## Next Steps

After successful deployment:

1. **Update Dashboard**: Set `NEXT_PUBLIC_SDK_SERVICE_URL` to Railway URL
2. **Update Client SDK**: Configure base URL for production
3. **Run Database Migrations**: `pnpm run prisma:migrate:deploy`
4. **Monitor Performance**: Check Railway metrics
5. **Set Up Domain**: Add custom domain in Railway settings

## Resources

- [Railway Documentation](https://docs.railway.app/)
- [Railway Monorepo Guide](https://docs.railway.app/guides/monorepo)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Turborepo Docs](https://turbo.build/repo/docs)
- [NestJS Deployment](https://docs.nestjs.com/faq/serverless)

---

[← Back to Deployment Guides](./README.md)
