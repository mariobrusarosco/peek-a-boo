# Railway Deployment Setup Guide

This guide walks you through setting up Railway deployment for the SDK service in the Peek-a-boo Feature Flag platform monorepo.

## Overview

[Railway](https://railway.app/) is a deployment platform that makes it easy to deploy applications without complex configuration. We use Railway to deploy our NestJS SDK service from our TurboRepo + PNPM monorepo.

## Prerequisites

Before you begin, you'll need:

- A Railway account (you can sign up at [railway.app](https://railway.app/))
- Access to the GitHub repository
- Your local development environment set up

## Step 1: Create a Railway Project

1. Log in to your Railway account
2. Click on "New Project" in the dashboard
3. Select "GitHub Repo" as your deployment source
4. Choose the Peek-a-boo repository
5. Name your project (e.g., "peek-a-boo-sdk-service")

## Step 2: Configure the Railway Project

### Set Root Directory

1. In your project, go to the "Settings" tab
2. Under "Root Directory", set it to `apps/sdk-service` 
3. This tells Railway where to find the service code in your monorepo

### Set Environment Variables

1. In your project, go to the "Variables" tab
2. Add any necessary environment variables:
   - `PORT=6001` (or any port you prefer)
   - `NODE_ENV=production`
   - Add any database connection strings and other credentials your service needs

## Step 3: Configure railway.json

We've created a `railway.json` file in the `apps/sdk-service` directory to help Railway understand how to build and deploy our service from the monorepo:

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

This configuration:
- Uses Nixpacks as the builder
- Navigates back to the monorepo root to install dependencies
- Uses TurboRepo (via `pnpm build:sdk-service`) to build the SDK service and its dependencies
- Starts the app by running the compiled main.js file
- Configures health checks and restart policies

### Advantages of Using TurboRepo for Builds

Using TurboRepo for builds provides several advantages:

1. **Dependency Awareness**: TurboRepo automatically builds dependencies in the correct order
2. **Incremental Builds**: Only rebuilds what changed, making deployments faster
3. **Caching**: Reuses build artifacts to speed up the process
4. **Consistency**: Uses the same build process in development and production

## Step 4: Configure GitHub Actions for Railway Deployment (Optional)

For automated CI/CD deployment to Railway, you can add a GitHub Actions workflow:

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Add the following secrets:
   - `RAILWAY_TOKEN`: Your Railway API token
   - `RAILWAY_SERVICE_SDK`: The name of your Railway service

### Getting Your Railway Token

1. Go to Railway dashboard > Settings
2. Navigate to "Developer" section
3. Click "New Token" and generate an API token
4. Copy this token and add it as a GitHub secret

## Step 5: Manual Deployment to Railway

For manual deployments:

1. Install the Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Log in to your Railway account:
   ```bash
   railway login
   ```

3. Link your project:
   ```bash
   cd apps/sdk-service
   railway link
   ```

4. Deploy manually:
   ```bash
   railway up
   ```

Alternatively, you can use the command from your monorepo root:
```bash
pnpm run deploy:sdk-service
```

## Step 6: Verify Deployment

After deployment:

1. Go to your Railway dashboard
2. Select your project and service
3. Check the Deployments tab to see if the deployment was successful
4. Click on the "Generated Domain" to open your service
5. Visit `/health` endpoint to verify the service is running correctly

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check build logs in the Railway dashboard
   - Ensure all dependencies are properly defined
   - Verify your buildCommand is correct

2. **Runtime Errors**:
   - Check service logs in the Railway dashboard
   - Verify environment variables are set correctly
   - Check the healthcheck endpoint is working

3. **Monorepo-specific Issues**:
   - Make sure the shared packages your service depends on are being built correctly
   - Check that the buildCommand in railway.json navigates correctly to the monorepo root

## Next Steps

After deploying your SDK service:

1. Configure your dashboard application to use the deployed SDK service
2. Update your client SDK to point to the production SDK service
3. Set up monitoring and alerts for production usage 