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

### Vercel Configuration Deep Dive

The `apps/dashboard/vercel.json` configuration:
```json
{
  "buildCommand": "cd ../.. && turbo run build --filter=@peek-a-boo/dashboard...",
  "ignoreCommand": "git diff --quiet HEAD^ HEAD ./",
  "framework": "nextjs"
}
```

This configuration is crucial for optimal monorepo deployment:

1. **Build Command**:
   - `cd ../..`: Navigates to the root of the monorepo
   - `turbo run build --filter=@peek-a-boo/dashboard...`: 
     - Uses Turborepo to run the build
     - The `--filter` flag specifies which package to build
     - The `...` suffix includes all dependencies of the dashboard

2. **Ignore Command**:
   - `git diff --quiet HEAD^ HEAD ./`
   - Checks if the dashboard directory has changed
   - Prevents unnecessary rebuilds when other packages change
   - Optimizes build time and resource usage

3. **Framework**:
   - Explicitly sets `nextjs` as the framework
   - Ensures proper build optimizations
   - Enables Next.js-specific features in Vercel

This setup ensures:
- Only necessary packages are built
- Dependencies are properly included
- Build caching is optimized
- Deployments are efficient

### Cross-Platform Benefits

While Turborepo provides native integration with Vercel for our dashboard, its benefits extend to all our services, including our SDK service deployed on other platforms:

1. **Development Benefits**:
   - Incremental builds work across all packages
   - Local caching speeds up builds regardless of deployment target
   - Parallel execution of tasks works for all services

2. **CI/CD Platform Independence**:
   - Remote caching works with any CI platform
   - Build dependencies are properly tracked
   - Task orchestration remains efficient

3. **SDK Service Specific Configuration**:
   ```json
   {
     "pipeline": {
       "build": {
         "dependsOn": ["^build"],
         "outputs": ["dist/**"]
       },
       "test": {
         "dependsOn": ["^build"],
         "outputs": ["coverage/**"]
       },
       "dev": {
         "cache": false,
         "persistent": true
       }
     }
   }
   ```
   This ensures:
   - Shared packages are built before the SDK service
   - Build artifacts are properly cached
   - Dependencies are correctly tracked
   - Test results are cached for faster CI

4. **Platform-Agnostic Features**:
   ```bash
   # Example CI/CD usage on any platform
   turbo run build --token=your_token --filter=@peek-a-boo/sdk-service...
   ```
   Benefits:
   - Remote caching across CI/CD runs
   - Dependency graph optimization
   - Workspace filtering for efficient builds
   - Task dependencies work consistently

This cross-platform compatibility ensures that we maintain the benefits of our monorepo tooling regardless of where individual services are deployed.

### Future Considerations

1. **SDK Service Deployment**:
   - Need to choose and document deployment platform
   - Configure CI/CD with Turborepo integration
   - Set up remote caching in chosen platform

2. **Caching Strategy**:
   - Implement remote caching for CI/CD
   - Configure artifact retention policies
   - Optimize cache for SDK service builds

## Consequences

### Positive
- Better Vercel deployment integration
- Improved build performance through caching
- Clearer dependency management
- Future-proof monorepo setup
- Better development experience
- Optimized Vercel deployments through smart workspace filtering
- Efficient CI/CD through build caching and dependency pruning

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