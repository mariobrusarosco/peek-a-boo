# Vercel Configuration Fix

## Issue
The Vercel UI was showing "Value is deprecated" for the GitHub configuration in the root `vercel.json` file, preventing proper interpretation of configuration settings.

## Root Cause
The property `autoJobCancelation` was misspelled (missing an 'l').

## Solution
Changed `autoJobCancelation` to correct spelling `autoJobCancellation` in the GitHub configuration section:

```json
"github": {
  "silent": true,
  "autoJobCancellation": true
}
```

## Results
- Fixed the "Value is deprecated" warning
- Vercel UI now correctly interprets the configuration file
- Deployment settings are properly applied

## Date
Fixed on: 2023-04-12 