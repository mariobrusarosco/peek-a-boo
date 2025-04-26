# Environment Variables Setup Guide

This guide explains how to set up environment variables for both local development and production deployments of the Peek-a-boo Feature Flag SaaS platform.

## Overview

The Peek-a-boo platform uses environment variables for configuration across different environments. These include:

- Database connection strings
- API keys and secrets
- Service-specific configuration

## Local Development Environment Variables

### Dashboard Application

Create a `.env.local` file in the `apps/dashboard` directory:

```bash
# apps/dashboard/.env.local
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-development-secret
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/feature_flags_dev
```

### SDK Service

Create a `.env` file in the `apps/sdk-service` directory:

```bash
# apps/sdk-service/.env
PORT=6001
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/feature_flags_dev
```

### Shared Package

Create a `.env` file in the `packages/shared` directory:

```bash
# packages/shared/.env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/feature_flags_dev
```

## Production Environment Variables

### Vercel (Dashboard)

Set these environment variables in your Vercel project settings:

1. Navigate to the Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add the following variables:

```
NEXTAUTH_URL=https://your-production-url.vercel.app
NEXTAUTH_SECRET=your-secure-production-secret
DATABASE_URL=${SUPABASE_URL}
SUPABASE_PROJECT_ID=your-supabase-project-id
SUPABASE_DB_PASSWORD=your-supabase-db-password
```

### Railway (SDK Service)

Set these environment variables in your Railway project settings:

1. Navigate to the Railway dashboard
2. Select your service
3. Go to Variables
4. Add the following variables:

```
PORT=6001
NODE_ENV=production
DATABASE_URL=postgresql://postgres:${SUPABASE_DB_PASSWORD}@db.${SUPABASE_PROJECT_ID}.supabase.co:5432/postgres
SUPABASE_PROJECT_ID=your-supabase-project-id
SUPABASE_DB_PASSWORD=your-supabase-db-password
```

## Database Environment Variables

### Supabase Configuration

For Supabase (our production database provider):

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Navigate to Database settings to find your connection string
3. Note your project ID and database password
4. Use these values in your environment variables

## GitHub Actions Secrets

To enable CI/CD with GitHub Actions, add these secrets to your repository:

1. Navigate to your GitHub repository
2. Go to Settings > Secrets and variables > Actions
3. Add the following secrets:

```
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-vercel-org-id
VERCEL_PROJECT_ID_DASHBOARD=your-vercel-project-id
RAILWAY_TOKEN=your-railway-token
RAILWAY_SERVICE_SDK=your-railway-service-name
SUPABASE_DB_PASSWORD=your-supabase-db-password
SUPABASE_PROJECT_ID=your-supabase-project-id
```

## Obtaining Required Values

### Vercel Values

1. **VERCEL_TOKEN**: 
   - Go to Vercel Account Settings > Tokens
   - Create a new token with appropriate permissions

2. **VERCEL_ORG_ID**:
   - Go to Vercel dashboard
   - Open your browser's developer console
   - Run `localStorage.getItem('vercel:org:current')` in the console
   - Parse the JSON response to get the ID

3. **VERCEL_PROJECT_ID_DASHBOARD**:
   - Select your project in Vercel
   - Go to Project Settings > General
   - Find the Project ID

### Railway Values

1. **RAILWAY_TOKEN**:
   - Go to Railway user settings
   - Navigate to Developer section
   - Generate a new token

2. **RAILWAY_SERVICE_SDK**:
   - This is the name of your SDK service in Railway

### Supabase Values

1. **SUPABASE_PROJECT_ID**:
   - Found in your Supabase project URL or settings

2. **SUPABASE_DB_PASSWORD**:
   - The password you set when creating your Supabase project

## Environment Variable Best Practices

1. **Security**:
   - Never commit .env files to version control
   - Use different secrets for development and production
   - Regularly rotate production secrets

2. **Organization**:
   - Keep environment-specific variables in appropriate .env files (.env.local, .env.production)
   - Document all required environment variables

3. **Testing**:
   - Create a separate .env.test file for test environments
   - Use a separate database for testing 