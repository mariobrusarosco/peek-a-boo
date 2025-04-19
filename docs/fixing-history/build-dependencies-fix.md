# Build Dependencies Fix

## Issue
Vercel deployment was failing with two main errors:
1. `Cannot find module 'autoprefixer'`
2. `Module not found: Can't resolve '@/lib/utils'`

## Root Cause
1. Missing PostCSS dependencies in the build environment
2. Missing utility functions module that's required by UI components

## Solution
1. Add missing PostCSS dependencies to the dashboard package:
   ```json
   "devDependencies": {
     "autoprefixer": "10.4.20",
     "postcss": "8.5.3",
     "tailwindcss": "3.4.17"
   }
   ```

2. Create the missing utils module at `apps/dashboard/src/lib/utils.ts`:
   ```typescript
   import { type ClassValue, clsx } from "clsx";
   import { twMerge } from "tailwind-merge";

   export function cn(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs));
   }
   ```

## Results
- Build process completes successfully
- UI components can properly import utility functions
- PostCSS processing works correctly for Tailwind CSS

## Date
Fixed on: 2023-04-12 