# Turborepo Environment Variables: Complete Guide

## Overview

Understanding how Turborepo handles environment variables is crucial for debugging deployment issues and ensuring proper build configuration in our monorepo. This guide explains the relationship between platform environment variables (Vercel, Railway) and Turborepo's `env` array.

## The Problem Turborepo Solves

When you run `turbo run build`, Turborepo needs to know which environment variables might affect the build output. This is important for **caching** and **passing variables correctly** between the deployment platform and your build processes.

## How It Works

### The Complete Flow

```bash
# Step 1: Vercel starts the build
vercel build

# Step 2: Vercel sets environment variables
export NEXT_PUBLIC_SDK_SERVICE_URL=https://your-service.railway.app
export DATABASE_URL=postgresql://...
export SOME_OTHER_VAR=value

# Step 3: Vercel runs your build command
turbo run build

# Step 4: Turborepo checks turbo.json env array
# Only passes variables that are listed:
# ✅ NEXT_PUBLIC_SDK_SERVICE_URL (in the list)
# ✅ DATABASE_URL (in the list)  
# ❌ SOME_OTHER_VAR (not in the list - gets filtered out)

# Step 5: Next.js build runs with filtered variables
next build
# → Can access NEXT_PUBLIC_SDK_SERVICE_URL ✅
# → Cannot access SOME_OTHER_VAR ❌
```

### Configuration Example

```json
// turbo.json
{
  "tasks": {
    "build": {
      "env": [
        "DATABASE_URL",
        "NEXT_PUBLIC_SDK_SERVICE_URL",
        "NODE_ENV",
        "VERCEL_ENV"
      ]
    }
  }
}
```

**What this does:**
1. **Cache Invalidation**: If any of these env vars change, Turborepo invalidates the cache
2. **Variable Passing**: These variables get passed from the parent process to the task
3. **Build Determinism**: Ensures builds are reproducible when env vars are the same

## Real-World Debugging Example: ECONNREFUSED Error

### The Problem
```
Error: connect ECONNREFUSED 127.0.0.1:3001
```

### The Investigation Process

1. **Read the Error**: `ECONNREFUSED 127.0.0.1:3001` means something is trying to connect to localhost instead of production
2. **Identify the Components**: Dashboard (Vercel) trying to connect to SDK Service (Railway)
3. **Find the Configuration**:
   ```bash
   grep -r "localhost.*3001" apps/dashboard/src/
   # Found: apps/dashboard/src/lib/constants/api.ts
   ```
4. **Analyze the Code**:
   ```typescript
   export const API_BASE_URL = process.env.NEXT_PUBLIC_SDK_SERVICE_URL || 'http://localhost:3001';
   ```
5. **Check Environment Variable Flow**: Is `NEXT_PUBLIC_SDK_SERVICE_URL` reaching the build process?

### The Root Cause
- ✅ Code was correct (uses environment variable with fallback)
- ✅ Vercel had the environment variable set
- ❌ `turbo.json` was missing `NEXT_PUBLIC_SDK_SERVICE_URL` in the env array
- **Result**: Variable got filtered out, code fell back to localhost

### The Fix
```json
// turbo.json - Added missing variable
"env": [
  "DATABASE_URL",
  "NEXT_PUBLIC_SDK_SERVICE_URL",  // ← This was missing!
  "NODE_ENV"
]
```

## Security & Performance Benefits

### Think of It Like Access Control

```bash
Vercel Environment = "The Vault" 
├── NEXT_PUBLIC_SDK_SERVICE_URL=https://production.com
├── DATABASE_URL=postgresql://...
├── SECRET_KEY=super-secret
└── RANDOM_VAR=something

Turborepo env array = "The Permission List"
├── ✅ NEXT_PUBLIC_SDK_SERVICE_URL  (allowed)  
├── ✅ DATABASE_URL (allowed)
├── ❌ SECRET_KEY (not listed - blocked)
└── ❌ RANDOM_VAR (not listed - blocked)

Next.js Build Process = "The Recipient"
├── ✅ Can use NEXT_PUBLIC_SDK_SERVICE_URL
├── ✅ Can use DATABASE_URL  
├── ❌ Cannot use SECRET_KEY
└── ❌ Cannot use RANDOM_VAR
```

### Why This Design?
- **Prevents accidental exposure** of sensitive variables
- **Faster builds** (fewer variables to process)
- **Better caching** (only relevant variables affect cache keys)
- **Consistent builds** across different environments

## Best Practices

### ✅ DO: Only Add Variables That Affect Build Output
```json
"env": [
  "NODE_ENV",                    // Affects bundling
  "NEXT_PUBLIC_API_URL",         // Gets bundled into client code
  "DATABASE_URL"                 // Used during build for types/validation
]
```

### ❌ DON'T: Add Runtime-Only Variables
```json
"env": [
  // ❌ Don't add these (not used during build):
  "SERVER_PORT",
  "LOG_LEVEL",
  
  // ✅ Add these (used during build):
  "NEXT_PUBLIC_*",
  "DATABASE_URL"
]
```

### ❌ DON'T: Add Too Many System Variables
```json
"env": ["HOME", "PATH", "USER", "PWD", "SHELL"]  // Bad!
```
**Result**: Cache misses constantly, slow builds

## Common Troubleshooting

### Debug Commands
```bash
# See what turbo is planning to do
turbo run build --dry-run

# Check if env var is being passed
echo "console.log(process.env.NEXT_PUBLIC_API_URL)" > debug.js
node debug.js
# vs
turbo exec -- node debug.js

# Force rebuild ignoring cache
turbo run build --force

# Clear Turborepo cache
rm -rf .turbo
```

### Debugging Patterns
1. **Error in production but works locally?** → Check environment variable filtering
2. **API calls failing with localhost URLs?** → Missing `NEXT_PUBLIC_*` variables
3. **Cache never hits?** → Too many variables in env array
4. **Variables undefined during build?** → Not listed in `turbo.json`

## Configuration Setup

### 1. Set Variables in Deployment Platform
- **Vercel**: Project Settings → Environment Variables
- **Railway**: Service Settings → Variables

### 2. Add to turbo.json
```json
{
  "tasks": {
    "build": {
      "env": [
        "DATABASE_URL",
        "NEXT_PUBLIC_SDK_SERVICE_URL",
        "NEXTAUTH_URL",
        "NEXTAUTH_SECRET",
        "NODE_ENV"
      ]
    }
  }
}
```

### 3. Use in Code
```typescript
// ✅ Good: Use environment variable with fallback
const API_URL = process.env.NEXT_PUBLIC_SDK_SERVICE_URL || 'http://localhost:3001';

// ❌ Bad: Hardcoded production URL
const API_URL = 'https://production-api.com';
```

## Key Takeaway

**You configure the value once** (in Vercel/Railway), but **both the platform and Turborepo are required**:

- **Platform (Vercel)** = Provides the environment variable
- **Turborepo** = Filters and passes only allowed variables
- **Result** = Your build process gets only the variables you explicitly allow

The `env` array is Turborepo's way of saying: **"These environment variables matter for the build output, so pass them through and use them for cache invalidation."**

## Related Documentation

- [Environment Variables Setup](007-environment-variables-setup.md)
- [Developer Workflow](004-developer-workflow.md)
- [Turborepo Guide](turbo-repo.md)
- [Vercel Deployment Fixes](../fixing-history/vercel-config-fix.md)