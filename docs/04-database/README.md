# Database Operations

Comprehensive guides for working with the PostgreSQL database and Prisma ORM.

## 📚 In This Section

### [Setup](./setup.md)
Complete database setup and configuration guide.

**Covers:**
- PostgreSQL setup with Docker
- Supabase configuration (production)
- Environment variables
- Connection pooling
- Prisma Studio
- Common setup issues

### [Migrations](./migrations.md)
Guide to creating and managing database migrations.

**Covers:**
- Creating migrations
- Running migrations (dev vs production)
- Migration best practices
- Rolling back migrations
- Troubleshooting migration issues

### [Seeding](./seeding.md)
Guide to database seeding for development and testing.

**Covers:**
- Running seed scripts
- Creating seed data
- Seed data structure
- Resetting the database
- Test data management

### [Prisma Deep Dive](./prisma-deep-dive.md)
In-depth guide to using Prisma in the monorepo.

**Covers:**
- Prisma Client generation
- Type-safe queries
- Relations and joins
- Transactions
- Advanced patterns
- Performance optimization

## 🎯 Common Tasks

### First-Time Setup
```bash
# Start database
docker compose up -d

# Run migrations
pnpm run prisma:migrate:dev

# Seed database
pnpm run prisma:seed

# Open Prisma Studio
pnpm --filter=@peek-a-boo/core prisma:studio
```

### Making Schema Changes
```bash
# 1. Edit packages/core/prisma/schema.prisma
# 2. Create migration
pnpm run prisma:migrate:dev

# 3. Prisma client is auto-generated
# 4. Rebuild core package
pnpm build:core
```

### Viewing Data
```bash
# Open Prisma Studio
pnpm --filter=@peek-a-boo/core prisma:studio
# Visit http://localhost:5555
```

### Resetting Database
```bash
# WARNING: Deletes all data!
pnpm --filter=@peek-a-boo/core prisma:migrate:reset
```

## 🗄️ Database Architecture

- **Database**: PostgreSQL (port 5438 locally)
- **ORM**: Prisma
- **Location**: `packages/core/prisma/`
- **Schema**: `packages/core/prisma/schema.prisma`
- **Migrations**: `packages/core/prisma/migrations/`
- **Seeds**: `packages/core/prisma/seed.ts`

## 📊 Key Models

- **User** - User accounts
- **Organization** - Multi-tenant organizations
- **Project** - Feature flag projects
- **FeatureFlag** - Individual feature flags

## ⚠️ Important Notes

1. **Only SDK Service accesses the database directly** via Prisma
2. **Dashboard and Client SDK use APIs** for data access
3. **Database runs on port 5438** (not default 5432)
4. **Always rebuild core after schema changes**: `pnpm build:core`

## 🔧 Troubleshooting

Common issues:
- Connection refused → Check Docker is running
- Port conflicts → Ensure 5438 is available
- Migration errors → See [Migrations Guide](./migrations.md)
- Type errors → Rebuild core: `pnpm build:core`

For more help, see [Troubleshooting](../06-troubleshooting/).

## 🔗 Related Sections

- [Setup](../02-setup/) - Initial environment setup
- [Development](../03-development/) - Using Prisma in code
- [Deployment](../05-deployment/) - Production database config

---

[← Back to Documentation Home](../README.md)
