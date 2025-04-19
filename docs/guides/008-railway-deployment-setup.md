# Railway Deployment Setup Guide

This guide walks you through setting up Railway deployment for the SDK service in the Peek-a-boo Feature Flag platform.

## Overview

[Railway](https://railway.app/) is a deployment platform that makes it easy to deploy applications without complex configuration. We use Railway to deploy our NestJS SDK service.

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

### Set Environment Variables

1. In your project, go to the "Variables" tab
2. Add the following environment variables:
   - `PORT=6001`
   - `NODE_ENV=production`
   - `DATABASE_URL=postgresql://postgres:${SUPABASE_DB_PASSWORD}@db.${SUPABASE_PROJECT_ID}.supabase.co:5432/postgres`
   - `SUPABASE_PROJECT_ID=your-supabase-project-id`
   - `SUPABASE_DB_PASSWORD=your-supabase-db-password`

### Configure the Service

1. In the "Settings" tab of your service:
   - Set the Root Directory to `apps/sdk-service`
   - Enable "Private Service" if you want it to be accessible only via a Railway-provided URL

## Step 3: Create a Railway Configuration File

Create a `railway.json` file in the `apps/sdk-service` directory:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pnpm install && pnpm --filter @peek-a-boo/shared build && pnpm --filter @peek-a-boo/sdk-service build"
  },
  "deploy": {
    "startCommand": "cd dist && node main.js",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

This configuration:
- Uses Nixpacks as the builder
- Installs dependencies and builds the shared package before building the SDK service
- Starts the app by running the compiled main.js file
- Configures health checks and restart policies

## Step 4: Configure GitHub Actions for Railway Deployment

Our GitHub Actions workflow deploys to Railway automatically. See the `.github/workflows/deployment.yml` file.

To set this up:

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

3. **Database Connection Issues**:
   - Verify your Supabase connection string is correct
   - Check that the database user has proper permissions
   - Ensure network access is properly configured

## Maintenance

### Updating Your Deployment

The deployment will automatically update when you push to the main branch of your GitHub repository, thanks to the CI/CD pipeline.

For manual updates:

```bash
cd apps/sdk-service
railway up
```

### Monitoring

Railway provides built-in monitoring:

1. Go to the "Metrics" tab to see CPU and memory usage
2. Check the "Logs" tab for application logs
3. Set up notifications in Railway Settings

## Next Steps

After deploying your SDK service:

1. Configure your dashboard application to use the deployed SDK service
2. Update your client SDK to point to the production SDK service
3. Set up monitoring and alerts for production usage 