# 📚 Peek-a-boo Documentation

**Complete documentation for the Peek-a-boo feature flag platform**

Welcome to the Peek-a-boo documentation! Whether you're setting up for the first time, developing new features, or deploying to production, you'll find everything you need here.

## 🚀 Quick Links

| Getting Started | Development | Production |
|----------------|-------------|------------|
| [Quick Start](./QUICK-START.md) | [Developer Workflow](./03-development/developer-workflow.md) | [Deployment Overview](./05-deployment/overview.md) |
| [Setup Guide](./02-setup/development-environment.md) | [API Architecture](./01-core/api-architecture.md) | [Railway (SDK Service)](./05-deployment/sdk-service-railway.md) |
| [Architecture](./01-core/architecture.md) | [React 19 Guide](./03-development/react-19-guide.md) | [Vercel (Dashboard)](./05-deployment/dashboard-vercel.md) |

## 📖 Documentation Sections

### [01 - Core Concepts](./01-core/)
Essential architecture and design documentation.

- **[Architecture](./01-core/architecture.md)** - Visual system architecture with diagrams
- **[Monorepo Guide](./01-core/monorepo-guide.md)** - Comprehensive Turborepo guide
- **[Monorepo Cheatsheet](./01-core/monorepo-cheatsheet.md)** - Quick command reference
- **[API Architecture](./01-core/api-architecture.md)** - Management vs Runtime APIs explained

**When to use:** Understanding the system, onboarding new team members

---

### [02 - Setup](./02-setup/)
Get Peek-a-boo running on your machine.

- **[Development Environment](./02-setup/development-environment.md)** - Complete setup guide
- **[Installing Dependencies](./02-setup/installing-dependencies.md)** - pnpm and workspace deps
- **[Environment Variables](./02-setup/environment-variables.md)** - Configuration guide

**When to use:** First-time setup, environment configuration

---

### [03 - Development](./03-development/)
Day-to-day development workflows and patterns.

- **[Developer Workflow](./03-development/developer-workflow.md)** - Daily development guide
- **[React 19 Guide](./03-development/react-19-guide.md)** - Server Components & Actions
- **[UI Components](./03-development/ui-components.md)** - Shadcn/ui component system
- **[NestJS: Adding Modules](./03-development/nestjs/adding-modules.md)** - Backend development

**When to use:** Building features, understanding patterns

---

### [04 - Database](./04-database/)
PostgreSQL and Prisma database operations.

- **[Setup](./04-database/setup.md)** - Database configuration
- **[Migrations](./04-database/migrations.md)** - Creating and managing migrations
- **[Seeding](./04-database/seeding.md)** - Test data and seed scripts
- **[Prisma Deep Dive](./04-database/prisma-deep-dive.md)** - Advanced Prisma usage

**When to use:** Database changes, migrations, schema updates

---

### [05 - Deployment](./05-deployment/)
Deploying to production environments.

- **[Overview](./05-deployment/overview.md)** - Deployment architecture
- **[Dashboard - Vercel](./05-deployment/dashboard-vercel.md)** - Next.js deployment
- **[SDK Service - Railway](./05-deployment/sdk-service-railway.md)** - NestJS deployment
- **[CI/CD Pipeline](./05-deployment/ci-cd-pipeline.md)** - Automated deployments

**When to use:** Deploying changes, CI/CD setup

---

### [06 - Troubleshooting](./06-troubleshooting/)
Solutions to common issues.

**Build & Dependencies:**
- [Build Dependencies](./06-troubleshooting/build-dependencies.md)
- [Lockfile Sync](./06-troubleshooting/lockfile-sync.md)

**Client SDK:**
- [TypeScript Declaration Bundling](./06-troubleshooting/client-sdk-typescript.md)
- [Module Configuration](./06-troubleshooting/sdk-module-config.md)
- [Lucide Dependency Resolution](./06-troubleshooting/lucide-dependency.md)

**Deployment:**
- [Vercel Deployment Fixes](./06-troubleshooting/vercel-deployment.md)
- [Vercel Config Issues](./06-troubleshooting/vercel-config.md)

**Frontend:**
- [ESLint & Routing Fixes](./06-troubleshooting/eslint-routing.md)

**When to use:** Encountering errors, debugging issues

---

### [07 - Decisions](./07-decisions/)
Architecture Decision Records (ADRs).

- [001 - Technology Stack](./07-decisions/001-technology-stack.md)
- [002 - Hybrid Architecture](./07-decisions/002-hybrid-architecture.md)
- [003 - pnpm Migration](./07-decisions/003-pnpm-migration.md)
- [004 - Turborepo Adoption](./07-decisions/004-turborepo-adoption.md)
- [005 - next-themes Implementation](./07-decisions/005-nextthemes-implementation.md)
- [006 - Theme Update](./07-decisions/006-theme-update.md)

**When to use:** Understanding why decisions were made

---

### [08 - Planning](./08-planning/)
Project phases and feature planning.

- [Phase 1: Create Project](./08-planning/phase-1-create-project.md)
- [Phase: Railway Deployment](./08-planning/phase-railway-deployment.md)

**When to use:** Understanding project history and roadmap

---

## 🎯 Common Tasks

### First Time Setup
```bash
# 1. Quick start (5 minutes)
See: docs/QUICK-START.md

# 2. Detailed setup
See: docs/02-setup/development-environment.md
```

### Adding a New Feature
```bash
# 1. Understand the architecture
See: docs/01-core/api-architecture.md

# 2. Follow development workflow
See: docs/03-development/developer-workflow.md

# 3. Add database changes (if needed)
See: docs/04-database/migrations.md
```

### Fixing a Bug
```bash
# 1. Check troubleshooting guide
See: docs/06-troubleshooting/README.md

# 2. Search for similar issues
See: docs/06-troubleshooting/ (all fixes documented)
```

### Deploying Changes
```bash
# 1. Read deployment overview
See: docs/05-deployment/overview.md

# 2. Deploy Dashboard
See: docs/05-deployment/dashboard-vercel.md

# 3. Deploy SDK Service
See: docs/05-deployment/sdk-service-railway.md
```

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│  Feature Flag SaaS Platform                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │  Dashboard  │  │ SDK Service │  │ Client SDK  │    │
│  │  (Next.js)  │  │  (NestJS)   │  │ (Rollup)    │    │
│  └──────┬──────┘  └──────┬──────┘  └──────┬───────┘    │
│         │ API calls      │ DB access       │ API calls  │
│         └────────────────┼─────────────────┘            │
│                          │                              │
│                 ┌────────┴─────────┐                    │
│                 │   Core Package   │                    │
│                 │ (Prisma + Types) │                    │
│                 └──────────────────┘                    │
│                          │                              │
│                          ▼                              │
│                     PostgreSQL                          │
└─────────────────────────────────────────────────────────┘
```

**Key Points:**
- Dashboard and Client SDK call APIs (no direct DB access)
- Only SDK Service accesses database (via Prisma)
- Core package provides shared types to all packages
- Turborepo orchestrates builds and caching

See [Architecture Guide](./01-core/architecture.md) for detailed diagrams.

## 📦 Project Structure

```
peek-a-boo/
├── apps/
│   ├── dashboard/           # Next.js frontend
│   └── sdk-service/         # NestJS backend
├── packages/
│   ├── core/                # Prisma + shared types
│   └── client-sdk/          # JavaScript SDK
└── docs/                    # You are here!
    ├── 01-core/             # Architecture & concepts
    ├── 02-setup/            # Getting started
    ├── 03-development/      # Day-to-day development
    ├── 04-database/         # Database operations
    ├── 05-deployment/       # Production deployment
    ├── 06-troubleshooting/  # Common issues
    ├── 07-decisions/        # ADRs
    └── 08-planning/         # Project phases
```

## 🔍 Finding What You Need

### By Role

**New Developer:**
1. [Quick Start](./QUICK-START.md)
2. [Architecture](./01-core/architecture.md)
3. [Developer Workflow](./03-development/developer-workflow.md)

**Frontend Developer:**
1. [React 19 Guide](./03-development/react-19-guide.md)
2. [UI Components](./03-development/ui-components.md)
3. [API Architecture](./01-core/api-architecture.md)

**Backend Developer:**
1. [NestJS: Adding Modules](./03-development/nestjs/adding-modules.md)
2. [API Architecture](./01-core/api-architecture.md)
3. [Database Migrations](./04-database/migrations.md)

**DevOps/Platform:**
1. [Deployment Overview](./05-deployment/overview.md)
2. [Railway Deployment](./05-deployment/sdk-service-railway.md)
3. [Vercel Deployment](./05-deployment/dashboard-vercel.md)

### By Task

**Setting Up:**
- [Quick Start](./QUICK-START.md) (5 min)
- [Development Environment](./02-setup/development-environment.md) (detailed)
- [Environment Variables](./02-setup/environment-variables.md)

**Building Features:**
- [Developer Workflow](./03-development/developer-workflow.md)
- [API Architecture](./01-core/api-architecture.md)
- [React 19 Guide](./03-development/react-19-guide.md)

**Database Work:**
- [Database Setup](./04-database/setup.md)
- [Migrations](./04-database/migrations.md)
- [Prisma Deep Dive](./04-database/prisma-deep-dive.md)

**Deployment:**
- [Deployment Overview](./05-deployment/overview.md)
- [CI/CD Pipeline](./05-deployment/ci-cd-pipeline.md)

**Debugging:**
- [Troubleshooting Index](./06-troubleshooting/README.md)
- [All Fixes](./06-troubleshooting/)

## 💡 Best Practices

### Documentation
- ✅ Update docs when making architectural changes
- ✅ Document solutions to problems you solve
- ✅ Keep READMEs up to date
- ✅ Add examples and code snippets

### Development
- ✅ Always build core package first: `pnpm build:core`
- ✅ Use exact commands from docs
- ✅ Check troubleshooting before asking for help
- ✅ Follow established patterns

### Git Workflow
- ✅ Create feature branches from `main`
- ✅ Write descriptive commit messages
- ✅ Test locally before pushing
- ✅ Request reviews for significant changes

## 🆘 Getting Help

1. **Search Documentation**: Use Cmd/Ctrl+F to search this page
2. **Check Troubleshooting**: [06-troubleshooting/](./06-troubleshooting/)
3. **Review Similar Issues**: Check [GitHub Issues](https://github.com/peek-a-boo/issues)
4. **Ask the Team**: Use team chat or create an issue

## 📊 Documentation Statistics

- **Total Guides**: 40+
- **Core Concepts**: 4
- **Setup Guides**: 3
- **Development Guides**: 5+
- **Database Guides**: 4
- **Deployment Guides**: 4
- **Troubleshooting Fixes**: 8+
- **Architecture Decisions**: 6
- **Planning Documents**: 2

**Last Updated**: October 2025

## 🤝 Contributing to Docs

Found an error or want to improve the docs?

1. **Small fixes**: Edit directly and commit
2. **New guides**: Follow existing structure and naming
3. **Major changes**: Discuss with team first

### Writing Guidelines

- Use clear, concise language
- Include code examples
- Add screenshots for UI-heavy topics
- Link to related documentation
- Test all commands before documenting

## 📚 External Resources

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)

---

**Ready to build?** Start with the [Quick Start Guide](./QUICK-START.md)!

*These docs are maintained with ❤️ by the Peek-a-boo engineering team*
