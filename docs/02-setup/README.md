# Setup Guides

Everything you need to get Peek-a-boo up and running on your machine.

## 📚 In This Section

### [Development Environment](./development-environment.md)
Complete guide to setting up your local development environment.

**Covers:**
- Prerequisites (Node.js, pnpm, Docker)
- First-time setup sequence
- Database configuration
- Running development servers
- Common setup issues

### [Installing Dependencies](./installing-dependencies.md)
Guide to managing dependencies in the monorepo.

**Covers:**
- Installing packages with pnpm
- Workspace dependencies
- Adding new dependencies
- Updating dependencies
- Troubleshooting dependency issues

### [Environment Variables](./environment-variables.md)
Comprehensive guide to environment variables in Turborepo.

**Covers:**
- Required environment variables
- Environment files (.env.local, .env)
- Turborepo environment variable handling
- Production vs development configuration
- Security best practices

## 🚀 Quick Start

**Want to get started immediately?** See [QUICK-START.md](../QUICK-START.md) for a 5-minute setup!

## 📋 Setup Checklist

- [ ] Install Node.js 18+, pnpm 8+, Docker
- [ ] Clone repository
- [ ] Run `pnpm install`
- [ ] Start Docker: `docker compose up -d`
- [ ] Copy `.env.example` files
- [ ] Build core: `pnpm build:core`
- [ ] Run migrations: `pnpm run prisma:migrate:dev`
- [ ] Seed database: `pnpm run prisma:seed`
- [ ] Start dev servers: `pnpm dev`

## 🔧 Troubleshooting

If you encounter issues during setup, check:
- [Troubleshooting Guide](../06-troubleshooting/)
- [Database Setup Guide](../04-database/setup.md)

## 🔗 Next Steps

After setup is complete:
- [Developer Workflow](../03-development/developer-workflow.md)
- [Database Operations](../04-database/)
- [Architecture Overview](../01-core/architecture.md)

---

[← Back to Documentation Home](../README.md)
