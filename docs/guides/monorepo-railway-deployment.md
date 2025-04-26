# Deploying to Railway from a TurboRepo + PNPM Monorepo

This guide provides specific instructions for deploying a service from our TurboRepo + PNPM monorepo to Railway.

## Challenges with Monorepo Deployments

When deploying a service from a monorepo to Railway, we face these specific challenges:

1. **Workspace Dependencies**: The service may depend on shared packages within the monorepo
2. **Build Order**: Shared packages need to be built before the service
3. **Root Directory**: Railway needs to know which directory contains the service
4. **Package Manager**: Using PNPM instead of npm/yarn requires special configuration

## Railway Configuration

Railway supports monorepo deployments through the use of a `railway.json` configuration file and the "Root Directory" setting.

### Creating the railway.json File

Create a `railway.json` file in your service directory (e.g., `apps/sdk-service/railway.json`):

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

The key parts of this configuration are:

1. **cd ../..**: Navigates from the service directory back to the monorepo root
2. **pnpm install**: Installs all dependencies in the monorepo
3. **pnpm build:sdk-service**: Uses TurboRepo to build the service and its dependencies in the correct order

### Benefits of Using TurboRepo for Builds

TurboRepo provides several advantages for building in a monorepo context:

1. **Intelligent Dependency Resolution**: TurboRepo understands which packages depend on each other and builds them in the right order
2. **Incremental Builds**: Only packages that have changed (or depend on changed packages) are rebuilt
3. **Caching**: Build artifacts are cached to avoid rebuilding the same code multiple times
4. **Remote Caching**: Can be configured to share caches across different CI/CD runs and environments
5. **Parallel Execution**: Builds multiple packages at once when there are no dependency conflicts

### Setting the Root Directory

In your Railway project settings:

1. Go to the Settings tab
2. Set the Root Directory to your service directory (e.g., `apps/sdk-service`)

This setting ensures Railway only deploys that specific service, not the entire monorepo.

## Local Testing

Before deploying to Railway, test that your service can be built and started correctly from the monorepo:

```bash
# From monorepo root
pnpm install
pnpm build:sdk-service
cd apps/sdk-service
node dist/main.js
```

## Environment Variables

Ensure all necessary environment variables are set in the Railway dashboard:

1. Go to the Variables tab
2. Add all required environment variables
3. You can also use Railway's built-in service linking to connect to databases or other services

## Deployment via Railway CLI

For manual deployments, use the Railway CLI:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your project (from service directory)
cd apps/sdk-service
railway link

# Deploy
railway up
```

## Automated Deployments via GitHub Actions

For automated deployments, add a GitHub Actions workflow that builds and deploys the service on each push:

```yaml
name: Deploy SDK Service

on:
  push:
    branches:
      - main
    paths:
      - 'apps/sdk-service/**'
      - 'packages/shared/**'
      - '.github/workflows/deploy-sdk.yml'

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

## Troubleshooting

### Common Issues

1. **Build Errors**: 
   - Check if all workspace dependencies are properly defined in package.json
   - Ensure the build command in railway.json is correct
   - Try running the build command locally to see if it succeeds

2. **Path Issues**:
   - Make sure the paths in railway.json are correct
   - Verify the Root Directory setting in Railway

3. **pnpm Issues**:
   - Ensure Railway is using the correct pnpm version
   - Consider adding `.npmrc` with `node-linker=hoisted` if you encounter module resolution issues

4. **Deployment Timeouts**:
   - If builds are timing out, consider pre-building some of the larger dependencies
   - Optimize your build process to speed it up

5. **TurboRepo Cache Issues**:
   - If builds are slower than expected, check if the TurboRepo cache is working properly
   - Consider setting up remote caching for CI/CD builds

## Resources

- [Railway Monorepo Documentation](https://docs.railway.app/guides/monorepo)
- [pnpm Workspace Documentation](https://pnpm.io/workspaces)
- [TurboRepo Documentation](https://turbo.build/repo/docs) 