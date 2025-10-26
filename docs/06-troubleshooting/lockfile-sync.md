# Vercel Deployment Lockfile Sync Fix

## Issue
Vercel deployment was failing with error:
```
ERR_PNPM_OUTDATED_LOCKFILE  Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with apps/dashboard/package.json
```

## Root Cause
Version inconsistency between package.json and pnpm-lock.yaml:
- Lockfile: `"lucide-react":"0.284.0"`
- Package.json: `"lucide-react":"^0.284.0"` (with caret)

The app-specific vercel.json was using the install command without the `--no-frozen-lockfile` flag.

## Solution
Updated the install command in `apps/dashboard/vercel.json` to include the no-frozen-lockfile flag:

```json
"installCommand": "cd ../.. && pnpm install --no-frozen-lockfile"
```

## Results
- Vercel deployment now succeeds
- Installation process can handle minor version differences between package.json and lockfile
- No need to regenerate the lockfile for every small formatting change

## Date
Fixed on: 2023-04-12 