# Production Deployment Guide

This guide provides instructions for deploying the Peek-a-boo feature flag platform to production environments.

## Prerequisites

- [Vercel](https://vercel.com) account for dashboard deployment
- [Railway](https://railway.app) account for SDK service deployment
- [Supabase](https://supabase.com) account for database deployment
- Access to GitHub repository with administrative privileges

## Dashboard Deployment (Vercel)

### Setting Up the Project

1. Create a new project in Vercel
2. Connect to your GitHub repository
3. Set framework preset to Next.js
4. Configure the root directory to `apps/dashboard`
5. Add the following environment variables:

| Name | Value | Description |
|------|-------|-------------|
| DATABASE_URL | `postgresql://postgres:password@db.project-id.supabase.co:5432/postgres` | Production database URL |
| NEXT_PUBLIC_API_URL | `https://sdk-service-production.up.railway.app` | URL for the SDK service |
| NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY | `pk_live_xxxx` | Clerk publishable key |
| CLERK_SECRET_KEY | `sk_live_xxxx` | Clerk secret key |

### Deploying Updates

The dashboard will automatically deploy when changes are pushed to the main branch. You can also manually deploy using:

```bash
pnpm run deploy:dashboard
```

## SDK Service Deployment (Railway)

### Setting Up the Project

1. Create a new project in Railway
2. Connect to your GitHub repository
3. Add the following environment variables:

| Name | Value | Description |
|------|-------|-------------|
| DATABASE_URL | `postgresql://postgres:password@db.project-id.supabase.co:5432/postgres` | Production database URL |
| PORT | `3001` | Port for the NestJS application |
| NODE_ENV | `production` | Environment |
| JWT_SECRET | `your-jwt-secret` | Secret for JWT tokens |
| CORS_ORIGINS | `https://peek-a-boo-dashboard.vercel.app` | Allowed CORS origins |

### Deploying Updates

The SDK service will automatically deploy when changes are pushed to the main branch. You can also manually deploy using:

```bash
pnpm run deploy:sdk-service
```

## Database Deployment (Supabase)

### Setting Up the Database

1. Create a new project in Supabase
2. Note your database connection details
3. Run the initial migrations:

```bash
DATABASE_URL=postgresql://postgres:password@db.project-id.supabase.co:5432/postgres pnpm run prisma:migrate:deploy --workspace=packages/shared
```

### Database Backups

Supabase automatically creates daily backups of your database. You can also manually create a backup from the Supabase dashboard.

## CI/CD Configuration

Our GitHub Actions workflows handle continuous integration and deployment:

- **Lint**: Runs on all PRs and pushes to main to ensure code quality
- **Build**: Runs on all PRs and pushes to main to ensure the application builds correctly
- **Test**: Runs on all PRs and pushes to main to ensure all tests pass
- **Deployment**: Deploys to production when changes are pushed to main

### Environment Secrets

The following secrets must be configured in GitHub repository settings:

| Name | Description |
|------|-------------|
| VERCEL_TOKEN | Vercel API token |
| VERCEL_ORG_ID | Vercel organization ID |
| VERCEL_PROJECT_ID_DASHBOARD | Vercel project ID for dashboard |
| RAILWAY_TOKEN | Railway API token |
| RAILWAY_SERVICE_SDK | Railway service ID for SDK service |
| SUPABASE_DB_PASSWORD | Supabase database password |
| SUPABASE_PROJECT_ID | Supabase project ID |

## Troubleshooting

### Common Issues

- **Database Connection Errors**: Ensure the database URL is correct and the IP is allowed in the Supabase dashboard
- **CORS Errors**: Check that the CORS_ORIGINS environment variable includes all frontend origins
- **Build Failures**: Check the CI logs for details on why the build failed

### Rollback Procedure

If a deployment causes issues:

1. For Vercel: Use the "Rollback" button in the Vercel dashboard
2. For Railway: Use the "Rollback" button in the Railway dashboard
3. For database: Use the Point-in-Time Recovery feature in Supabase 