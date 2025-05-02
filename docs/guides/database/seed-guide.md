# Database Seeding Guide

## Overview

Database seeding is the process of populating your database with initial data for development and testing. In Peek-a-boo, we use Prisma's seeding mechanism to create test users and projects.

## Current Seed Implementation

Our seed script (`packages/shared/prisma/seed.ts`) creates:

- **2 Users**:
  - Admin user (admin@peek-a-boo.dev)
  - Regular user (user@peek-a-boo.dev)
  
- **6 Projects**:
  - 3 projects owned by the admin user
  - 3 projects owned by the regular user

## How to Run the Seed

To populate your database with test data:

```bash
# Navigate to the shared package
cd packages/shared

# Generate Prisma client first (required)
pnpm prisma:generate

# Run the seed script
pnpm prisma:seed
```

> **Important**: Always run `prisma:generate` before seeding to ensure the Prisma client is properly initialized. Without this step, you'll get an error: `@prisma/client did not initialize yet`.

## How to Reset Your Database

If you need to start fresh:

```bash
# Reset the database (drops all tables and reapplies migrations)
pnpm prisma migrate reset --force

# This will automatically run the seed script after reset
```

## Modifying the Seed

To add or modify seed data:

1. Edit `packages/shared/prisma/seed.ts`
2. Add new entities or modify existing ones
3. Run the seed command again

## Example: Adding a New Test User

```typescript
// In seed.ts
const users = [
  // Existing users...
  {
    name: 'Test User',
    email: 'test@peek-a-boo.dev',
    password: await hash('password123', 10),
    role: 'MEMBER',
  },
];
```

## Best Practices

- Keep seed data minimal but sufficient for testing
- Use descriptive names for test entities
- Ensure relationships between entities are properly set up
- Use `upsert` to avoid duplicate entries when running seed multiple times
- Consider environment-specific seeding for different scenarios

## Troubleshooting

If you encounter issues with seeding:

1. Check that your database connection is working
2. Verify that your schema matches the seed data structure
3. Look for constraint violations or validation errors in the console output
