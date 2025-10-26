# CI/CD Pipeline Guide

This guide explains the Continuous Integration and Continuous Deployment (CI/CD) pipeline for the Peek-a-boo Feature Flag SaaS platform.

## Overview

Our CI/CD pipeline is implemented using GitHub Actions and consists of four main workflows:

1. **Lint**: Ensures code quality by running linters
2. **Build**: Verifies that the codebase can be built successfully
3. **Test**: Runs automated tests to ensure functionality
4. **Deployment**: Deploys applications to their respective hosting platforms

## Workflow Details

### Lint Workflow

**File**: `.github/workflows/lint.yml`

This workflow runs on pull requests and pushes to the main branch, performing the following steps:

1. Checks out the code
2. Sets up Node.js and pnpm
3. Builds the shared package
4. Runs linting on all packages and applications

The lint workflow helps catch code style and quality issues early in the development process.

### Build Workflow

**File**: `.github/workflows/build.yml`

This workflow verifies that the codebase can be built successfully:

1. Checks out the code
2. Sets up Node.js and pnpm
3. Builds the shared package first (since other packages depend on it)
4. Builds all other packages and applications
5. Uploads build artifacts for potential use in other workflows

Build artifacts are retained for 7 days and include:
- Next.js dashboard build output
- SDK service compiled output
- Shared package compiled output
- Client SDK compiled output

### Test Workflow

**File**: `.github/workflows/test.yml`

The test workflow runs automated tests with the following setup:

1. Spins up a PostgreSQL database container for integration tests
2. Checks out the code
3. Sets up Node.js and pnpm
4. Builds the shared package
5. Sets up the test database and runs migrations
6. Executes all tests with the proper environment variables

This workflow ensures that code changes don't break existing functionality.

### Deployment Workflow

**File**: `.github/workflows/deployment.yml`

The deployment workflow runs when changes are pushed to the main branch or when manually triggered:

1. **Dashboard Deployment**:
   - Deploys the Next.js dashboard to Vercel
   - Uses the Vercel GitHub Action with the project's configuration
   - Requires Vercel secrets to be configured in the GitHub repository

2. **SDK Service Deployment**:
   - Deploys the SDK service to Railway
   - Builds the shared package and SDK service
   - Uses the Railway GitHub Action with the project's configuration
   - Requires Railway secrets to be configured in the GitHub repository

## Required Secrets

The following secrets must be configured in your GitHub repository:

### For Vercel Deployment

- `VERCEL_TOKEN`: API token from Vercel
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID_DASHBOARD`: Project ID for the dashboard

### For Railway Deployment

- `RAILWAY_TOKEN`: API token from Railway
- `RAILWAY_SERVICE_SDK`: Service name for the SDK service

### For Database

- `SUPABASE_DB_PASSWORD`: Password for the Supabase database
- `SUPABASE_PROJECT_ID`: Your Supabase project ID

## Setting Up Local Deployments

For local testing of the deployment process:

### Dashboard (Vercel)

```bash
cd apps/dashboard
vercel
```

### SDK Service (Railway)

```bash
cd apps/sdk-service
railway up
```

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Ensure all dependencies are properly installed
   - Check for TypeScript errors using `pnpm run lint`
   - Build the shared package first if there are dependency issues

2. **Deployment Failures**:
   - Verify that all required secrets are properly configured
   - Check the deployment platform's status page for service issues
   - Examine environment variables to ensure they're correctly set

3. **Test Failures**:
   - Ensure the PostgreSQL service is running properly
   - Verify that database migrations are applying correctly
   - Check for race conditions in tests that might cause intermittent failures

## Best Practices

1. **Pull Requests**:
   - Always create a pull request for changes rather than committing directly to main
   - Wait for all CI checks to pass before merging
   - Address any failing checks promptly

2. **Environment Variables**:
   - Never commit sensitive environment variables to the repository
   - Use GitHub secrets for sensitive information
   - Document any new environment variables needed for deployments

3. **Deployment Frequency**:
   - Aim for small, frequent deployments rather than large, infrequent ones
   - Use feature flags to control the release of new functionality
   - Monitor deployments closely after they complete 