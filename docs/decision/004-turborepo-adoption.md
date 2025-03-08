# ADR 004: Adopting Turborepo for Monorepo Management

## Date
2025-03-02

## Status
Accepted

## Context
We're building a feature flag platform with a hybrid architecture (Next.js dashboard + NestJS service) using a monorepo structure. As we prepare for deployment to Vercel, we've encountered issues with project identification and build configuration. We need a better solution for managing our monorepo, especially concerning deployments.

## Decision Drivers
- Need for efficient Vercel deployments
- Build performance and caching requirements
- Development experience optimization
- Monorepo management complexity
- Future scalability considerations

## Considered Options

1. **Keep Current PNPM Workspaces Setup**
   - Pros:
     - Already implemented
     - Simple and lightweight
   - Cons:
     - Manual deployment configuration needed
     - No built-in caching
     - Limited monorepo tooling

2. **Adopt Turborepo**
   - Pros:
     - Native Vercel integration
     - Powerful build caching
     - Clear pipeline definitions
     - Works with PNPM
     - Remote caching capabilities
   - Cons:
     - Migration effort required
     - Additional configuration needed

3. **Switch to Nx**
   - Pros:
     - Comprehensive monorepo solution
     - Powerful tooling
   - Cons:
     - Steeper learning curve
     - Overkill for our current needs
     - Less integrated with Vercel

## Decision
We will adopt Turborepo while maintaining our PNPM package management. This provides the best balance of features and complexity for our needs.

## Implementation Plan

1. **Initial Setup**
   - Add turbo.json to root
   - Configure pipelines for build, dev, lint
   - Set up remote caching with Vercel

2. **Workspace Configuration**
   - Define workspace dependencies
   - Configure build outputs
   - Set up shared pipeline definitions

3. **Deployment Configuration**
   - Configure Vercel project settings
   - Set up deployment pipeline
   - Configure environment variables

## Technical Details

### Pipeline Configuration (turbo.json)
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "lint": {},
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### Vercel Configuration
```json
{
  "workspaceRoot": "apps/dashboard",
  "framework": "nextjs"
}
```

## Consequences

### Positive
- Better Vercel deployment integration
- Improved build performance through caching
- Clearer dependency management
- Future-proof monorepo setup
- Better development experience

### Negative
- Short-term migration effort
- Additional configuration to maintain
- Team needs to learn Turborepo concepts

### Neutral
- Need to update CI/CD pipelines
- Need to update development documentation

## References
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Vercel Monorepo Guide](https://vercel.com/docs/monorepos)
- [PNPM with Turborepo](https://turbo.build/repo/docs/getting-started/existing-project) 