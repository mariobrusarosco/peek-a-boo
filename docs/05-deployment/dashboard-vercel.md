# Vercel Deployment - Dashboard

Complete guide to deploying the Next.js Dashboard to Vercel from our Turborepo + pnpm monorepo.

## Overview

[Vercel](https://vercel.com/) is the optimal platform for deploying Next.js applications. This guide covers deploying the Dashboard from our monorepo with proper configuration.

## Prerequisites

- Vercel account ([sign up](https://vercel.com/signup))
- GitHub repository access
- Local development environment working
- Dashboard builds successfully locally

## Step 1: Create Vercel Project

1. Log in to Vercel dashboard
2. Click **"Add New..."** > **"Project"**
3. Import your GitHub repository
4. Select the Peek-a-boo repository
5. Configure project (see next steps)

## Step 2: Configure Project Settings

### Framework Preset

- **Framework Preset**: Next.js
- Vercel auto-detects this

### Root Directory

**Critical for monorepo:**

1. Click **"Edit"** next to Root Directory
2. Set to: `apps/dashboard`
3. Enable **"Include source files outside of the Root Directory in the Build Step"**

This allows Vercel to access `packages/core` from the build.

### Build Settings

Vercel needs custom build commands for our monorepo.

The configuration is in `apps/dashboard/vercel.json`:

```json
{
  "framework": "nextjs",
  "buildCommand": "cd ../.. && pnpm run build:dashboard",
  "installCommand": "cd ../.. && pnpm install --no-frozen-lockfile",
  "outputDirectory": ".next"
}
```

**How it works:**
- `cd ../..`: Navigate to monorepo root
- `pnpm install`: Install all workspace dependencies
- `pnpm run build:dashboard`: Turborepo builds Dashboard + dependencies
- Output in `.next/` directory

### Build & Development Settings (UI)

If not using `vercel.json`, configure in Vercel UI:

**Build Command:**
```bash
cd ../.. && pnpm install && pnpm build:dashboard
```

**Output Directory:**
```
.next
```

**Install Command:**
```bash
cd ../.. && pnpm install --no-frozen-lockfile
```

## Step 3: Configure Environment Variables

Add all required environment variables:

### Required Variables

```bash
# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_secret_here

# SDK Service
NEXT_PUBLIC_SDK_SERVICE_URL=https://sdk-service.railway.app

# Database (if Dashboard accesses DB directly - currently it doesn't)
# DATABASE_URL=your_supabase_url

# Node Environment
NODE_ENV=production
```

### Generating NEXTAUTH_SECRET

```bash
# Generate a secure secret
openssl rand -base64 32
```

### Environment Variable Scopes

Configure for different environments:

- **Production**: Main deployment (e.g., `main` branch)
- **Preview**: Pull request deployments
- **Development**: Local development (use `.env.local`)

## Step 4: Configure Node.js Version

Ensure Vercel uses the correct Node.js version.

Add to `package.json` (monorepo root):

```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

Or set in Vercel dashboard:
1. Go to **Settings** > **General**
2. Set **Node.js Version** to **18.x**

## Step 5: Test Build Locally

Before deploying, verify the build works:

```bash
# From monorepo root
pnpm install
pnpm build:dashboard

# Test production build locally
cd apps/dashboard
pnpm start

# Visit http://localhost:3000
```

## Step 6: Deploy to Vercel

### Option A: Automatic Deployment (GitHub)

Vercel automatically deploys when you push:

1. Push code to `main` branch
2. Vercel detects changes
3. Builds and deploys automatically
4. Preview deployments for pull requests

### Option B: Manual Deployment (CLI)

For manual control:

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link to your project
cd apps/dashboard
vercel link

# Deploy to production
vercel --prod
```

Or use the pnpm script:

```bash
pnpm run deploy:dashboard
```

## Step 7: Verify Deployment

After deployment:

1. Visit your deployment URL
2. Check all pages load correctly
3. Verify API calls to SDK Service work
4. Test authentication flow
5. Check dark/light mode switching

## Advanced Configuration

### Custom Domain

1. Go to **Settings** > **Domains**
2. Add your domain: `peek-a-boo.com`
3. Configure DNS records as instructed
4. Wait for SSL certificate provisioning

### Preview Deployments

Every pull request gets a preview URL:

- Automatic preview deployments
- Unique URL per PR
- Test changes before merging

### Deployment Protection

Protect production deployments:

1. Go to **Settings** > **Deployment Protection**
2. Enable **Vercel Authentication**
3. Only authenticated users can access deployments

### Build Cache

Vercel automatically caches:
- `node_modules/`
- `.next/cache/`
- Turborepo cache (`.turbo/`)

To clear cache:
1. Go to **Settings** > **General**
2. Click **Clear Build Cache**

## Environment Variables Best Practices

### Never Commit Secrets

```bash
# ❌ DON'T commit to Git
NEXTAUTH_SECRET=abc123

# ✅ DO set in Vercel dashboard
```

### Use NEXT_PUBLIC_ for Client-Side

```bash
# Accessible in browser
NEXT_PUBLIC_SDK_SERVICE_URL=https://api.example.com

# Server-side only (not prefixed)
DATABASE_URL=postgresql://...
```

### Environment-Specific Values

```bash
# Production
NEXTAUTH_URL=https://peek-a-boo.com

# Preview
NEXTAUTH_URL=https://preview-pr-123.vercel.app

# Development
NEXTAUTH_URL=http://localhost:3000
```

## Troubleshooting

### Build Failures

**Symptom**: Build fails on Vercel

**Solutions**:

```bash
# 1. Check build logs in Vercel dashboard

# 2. Monorepo path issues
# Fix: Ensure vercel.json has correct paths
# Fix: Verify "Include source files outside Root Directory" is enabled

# 3. Missing dependencies
# Fix: Ensure @peek-a-boo/core is in dependencies
# Fix: Run pnpm install from monorepo root

# 4. Environment variables
# Fix: Check all required env vars are set
# Fix: Ensure DATABASE_URL is in turbo.json env array

# 5. Test locally:
cd ../.. && pnpm install && pnpm build:dashboard
```

### Module Not Found Errors

**Symptom**: `Cannot find module '@peek-a-boo/core'`

**Solutions**:

```bash
# 1. Build order issue
# Ensure Turborepo builds core before dashboard
# Check turbo.json has correct dependency chain

# 2. Workspace dependency configuration
# In apps/dashboard/package.json:
{
  "dependencies": {
    "@peek-a-boo/core": "workspace:*"
  }
}

# 3. Rebuild core:
pnpm build:core
```

### Runtime Errors

**Symptom**: Application crashes or shows errors

**Solutions**:

```bash
# 1. Check Vercel function logs
# Go to Deployments > Select deployment > Functions

# 2. Environment variables
# Verify NEXT_PUBLIC_SDK_SERVICE_URL is correct

# 3. API connection
# Test SDK Service is accessible:
curl https://sdk-service.railway.app/health

# 4. Server Components errors
# Ensure 'use client' directive where needed
```

### Lucide React Dependency Error

**Symptom**: `Module not found: Can't resolve 'lucide-react'`

**Solution**:

Add to `.npmrc` (monorepo root):

```
public-hoist-pattern[]=lucide-react
```

Then rebuild:
```bash
rm -rf node_modules apps/*/node_modules
pnpm install
pnpm build:dashboard
```

### Slow Build Times

**Symptom**: Builds take >5 minutes

**Solutions**:

```bash
# 1. Enable Turborepo remote caching
# In turbo.json:
{
  "remoteCache": {
    "enabled": true,
    "signature": true
  }
}

# 2. Optimize dependencies
# Remove unused packages
pnpm remove <unused-package>

# 3. Use Vercel's caching
# Builds should be faster on subsequent deployments

# 4. Check bundle size
# In apps/dashboard:
pnpm build && pnpm analyze
```

### Preview Deployments Not Working

**Symptom**: PRs don't get preview deployments

**Solutions**:

```bash
# 1. Check Vercel Git integration
# Settings > Git > Enable automatic deployments

# 2. Verify build command works
# Test locally with exact Vercel build command

# 3. Check deployment protection
# May need to authenticate to view previews
```

## Performance Optimization

### Image Optimization

Next.js automatically optimizes images:

```tsx
import Image from 'next/image';

<Image
  src="/logo.png"
  width={200}
  height={100}
  alt="Logo"
/>
```

### Route Caching

Configure ISR (Incremental Static Regeneration):

```typescript
// app/projects/page.tsx
export const revalidate = 60; // Revalidate every 60 seconds
```

### Edge Functions

For faster response times, use Edge Runtime:

```typescript
// app/api/flags/route.ts
export const runtime = 'edge';
```

## Monitoring

### Analytics

Enable Vercel Analytics:

```bash
# Install package
pnpm add @vercel/analytics

# In app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Speed Insights

Monitor Core Web Vitals:

```bash
pnpm add @vercel/speed-insights

# In app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';
```

## Next Steps

After successful deployment:

1. **Configure Custom Domain**: Add your production domain
2. **Set Up Monitoring**: Enable Analytics and Speed Insights
3. **Configure Alerts**: Set up deployment notifications
4. **Test Thoroughly**: Verify all features work in production
5. **Update DNS**: Point your domain to Vercel

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Monorepo Guide](https://vercel.com/docs/concepts/monorepos)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

[← Back to Deployment Guides](./README.md)
