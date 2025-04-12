#!/bin/bash
# setup-env.sh - Script to set up environment variables for production deployment

# Create directory if it doesn't exist
mkdir -p scripts/tmp

# Check if required env vars are set
if [ -z "$SUPABASE_DB_PASSWORD" ] || [ -z "$SUPABASE_PROJECT_ID" ]; then
  echo "Error: SUPABASE_DB_PASSWORD and SUPABASE_PROJECT_ID must be set"
  exit 1
fi

# Create production .env file for shared package
cat > packages/shared/.env.production << EOL
# Database connection string
DATABASE_URL="postgresql://postgres:${SUPABASE_DB_PASSWORD}@db.${SUPABASE_PROJECT_ID}.supabase.co:5432/postgres"

# Other production environment variables
NODE_ENV=production
EOL

# Create production .env file for dashboard
cat > apps/dashboard/.env.production << EOL
# API URL
NEXT_PUBLIC_API_URL="https://sdk-service-production.up.railway.app"

# Database connection (same as shared)
DATABASE_URL="postgresql://postgres:${SUPABASE_DB_PASSWORD}@db.${SUPABASE_PROJECT_ID}.supabase.co:5432/postgres"

# Auth (replace with actual keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="${CLERK_PUBLISHABLE_KEY}"
CLERK_SECRET_KEY="${CLERK_SECRET_KEY}"
EOL

# Create production .env file for SDK service
cat > apps/sdk-service/.env.production << EOL
# Database connection (same as shared)
DATABASE_URL="postgresql://postgres:${SUPABASE_DB_PASSWORD}@db.${SUPABASE_PROJECT_ID}.supabase.co:5432/postgres"

# API settings
PORT=3001
NODE_ENV=production
JWT_SECRET="${JWT_SECRET}"
CORS_ORIGINS="https://peek-a-boo-dashboard.vercel.app"
EOL

echo "Environment files created successfully!" 