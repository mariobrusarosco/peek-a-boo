# 🚀 Turborepo Guide: Peek-a-boo Monorepo Architecture

> **A visual guide to understanding how Turborepo powers our feature flag SaaS platform**

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Workspace Architecture](#workspace-architecture)
- [Dependency Graph](#dependency-graph)
- [Task Pipeline](#task-pipeline)
- [Development Workflows](#development-workflows)
- [Build & Deploy Process](#build--deploy-process)
- [Best Practices](#best-practices)

---

## 🏗️ Project Overview

**Peek-a-boo** is a feature flag SaaS platform built as a monorepo using Turborepo, PNPM workspaces, and TypeScript.

```
🎯 What we're building:
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

---

## 🏛️ Workspace Architecture

### Directory Structure
```
peek-a-boo/
├── 📁 apps/                    # Main applications
│   ├── 📁 dashboard/           # Next.js frontend
│   └── 📁 sdk-service/         # NestJS backend
├── 📁 packages/                # Shared libraries
│   ├── 📁 core/                # Database & utilities
│   └── 📁 client-sdk/          # JavaScript SDK
├── 📄 package.json             # Root workspace config
├── 📄 turbo.json              # Turborepo configuration
└── 📄 pnpm-workspace.yaml     # PNPM workspace setup
```

### Package Roles & Responsibilities

| Package | Type | Purpose | Tech Stack | Database Access |
|---------|------|---------|------------|-----------------|
| `@peek-a-boo/dashboard` | **App** | Admin dashboard for managing feature flags | Next.js, React, Tailwind, NextAuth | ❌ API only |
| `@peek-a-boo/sdk-service` | **App** | Backend API & WebSocket service | NestJS, Socket.io, Express | ✅ Direct (Prisma) |
| `@peek-a-boo/core` | **Package** | Database models, utilities, types | Prisma, TypeScript | N/A (provides client) |
| `@peek-a-boo/client-sdk` | **Package** | Client library for feature flags | Rollup, TypeScript | ❌ API only |

---

## 🔗 Dependency Graph

### Build-Time Dependencies
```
Build Order (Bottom → Top):

Level 1: 📦 @peek-a-boo/core
         ├── Prisma Client Generation
         ├── Database Types (Used by ALL ✅)
         └── Shared Utilities
              │
              ├─────────────────┬─────────────────┐
              ▼                 ▼                 ▼
Level 2: 📦 client-sdk    🚀 dashboard      🚀 sdk-service
         │                │                 │
         ├─ Imports:      ├─ Imports:       ├─ Imports:
         │  • Types ✅    │  • Types ✅     │  • Types ✅
         │  • Prisma ❌   │  • Prisma ❌    │  • Prisma ✅
         │                │                 │
         └─ For data:     └─ For data:      └─ For data:
            Uses API ➜       Uses API ➜        Uses DB ⚡

Legend: 📦 = Package, 🚀 = Application
```

**Key Points:**
- ✅ **All packages import TypeScript types** from `@peek-a-boo/core`
- ⚡ **Only SDK Service uses Prisma** for database access
- 🌐 **Dashboard & Client SDK call APIs** for data (no direct DB access)

### Runtime Data Flow
```
End User App ─────▶ Client SDK ─────┐
                                     │
                                     ▼
Dashboard (Next.js) ───────────▶ SDK Service (NestJS) ───▶ Database
                                     │
                                     └─────────────────────▶ WebSocket
                                                                │
                                                                ▼
                                                         Real-time updates

Data Flow:
• Dashboard → SDK Service → Database (Management APIs)
• Client SDK → SDK Service → Database (Runtime APIs)
• SDK Service ← Database (Only service with DB access)
```

### Workspace Dependencies
```json
{
  "dashboard": ["@peek-a-boo/core"],      // Types only, calls API for data
  "sdk-service": ["@peek-a-boo/core"],    // Types + Prisma, direct DB access
  "client-sdk": ["@peek-a-boo/core"],     // Types only, calls API for data
  "core": []                              // No internal dependencies
}
```

---

## ⚙️ Task Pipeline

### Turborepo Configuration (`turbo.json`)
```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],           // Wait for dependencies
      "outputs": ["dist/**", ".next/**"], // Cache these folders
      "env": ["DATABASE_URL", "SUPABASE_*"] // Env affects cache
    },
    "dev": {
      "cache": false,      // Don't cache dev mode
      "persistent": true   // Keep processes running
    }
  }
}
```

### Task Execution Flow

#### 🔨 Build Process
```
1. turbo run build
   │
   ├── 📦 core: prisma generate + tsc
   │   └── ✅ Generates Prisma client & TypeScript types
   │
   ├── 📦 client-sdk: rollup build
   │   └── ✅ Creates UMD/ESM bundles
   │
   ├── 🚀 dashboard: next build
   │   └── ✅ Static site generation
   │
   └── 🚀 sdk-service: nest build
       └── ✅ Compiles to dist/
```

#### 🔄 Development Process
```
1. turbo run dev
   │
   ├── 📦 core: tsc --watch (types only)
   ├── 📦 client-sdk: rollup --watch
   ├── 🚀 dashboard: next dev (port 3000) → Calls API
   └── 🚀 sdk-service: nest start --watch (port 6001) → Accesses DB

   All processes run in parallel! 🎉
```

---

## 💻 Development Workflows

### Common Commands

| Command | What it does | When to use |
|---------|--------------|-------------|
| `pnpm dev` | Start all apps in dev mode | Daily development |
| `pnpm dev:dashboard` | Only run dashboard | Frontend-only work |
| `pnpm dev:sdk-service` | Only run backend | API development |
| `pnpm build` | Build everything | Before deployment |
| `pnpm test` | Run all tests | CI/CD pipeline |
| `pnpm lint` | Lint all packages | Code quality checks |

### Filtering Examples
```bash
# Build only dashboard and its dependencies
pnpm build --filter=@peek-a-boo/dashboard...

# Test specific package
pnpm test --filter=@peek-a-boo/sdk-service

# Run command in specific workspace (e.g., Prisma Studio)
pnpm --filter=@peek-a-boo/core prisma:studio

# Build core package only
pnpm build:core
```

### Development Flow Diagram
```
Developer Workflow:

1. 📝 Make changes to any package
   │
2. 🔍 Turborepo detects changes
   │
3. 🧠 Determines what needs rebuilding
   │
4. ⚡ Runs only affected tasks
   │
5. 💾 Caches successful builds
   │
6. 🚀 Hot reload in development
```

---

## 🚀 Build & Deploy Process

### Production Build Pipeline
```
CI/CD Pipeline:

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Code Push     │───▶│  Turborepo      │───▶│    Deploy       │
│                 │    │                 │    │                 │
│ • Git commit    │    │ • Install deps  │    │ • Dashboard →   │
│ • PR merge      │    │ • Run build     │    │   Vercel        │
│ • Release tag   │    │ • Run tests     │    │ • SDK Service → │
│                 │    │ • Cache results │    │   Railway       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Environment-Specific Builds
```bash
# Development
pnpm dev                    # All services with hot reload

# Staging  
pnpm build:ci              # Optimized build with caching

# Production
pnpm build:dashboard       # Dashboard for Vercel
pnpm build:sdk-service     # Service for Railway
```

---

## 🎯 Best Practices

### ✅ Do's
- **Use workspace references**: `"@peek-a-boo/core": "workspace:*"`
- **Leverage filtering**: Target specific packages with `--filter`
- **Trust the cache**: Let Turborepo handle incremental builds
- **Keep shared code in packages**: Don't duplicate logic across apps
- **Use consistent scripts**: Same script names across all packages
- **Import types only when needed**: `import type { ... }` from core

### ❌ Don'ts
- **Don't bypass the build system**: Always use `turbo run` commands
- **Don't ignore cache**: `.turbo/` folder speeds up everything
- **Don't create circular dependencies**: Keep the dependency graph clean
- **Don't duplicate dependencies**: Use workspace inheritance
- **Don't skip type checking**: `lint:types` catches issues early
- **Don't access database directly from Dashboard/Client SDK**: Use API calls

### 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails randomly | Clear cache: `turbo run build --force` |
| Types not updating | Rebuild core: `pnpm build:core` |
| Prisma client issues | Regenerate: `pnpm --filter=@peek-a-boo/core prisma:generate` |
| Dev server issues | Restart with: `pnpm dev` |
| Dependency conflicts | Check workspace versions in package.json |
| API connection fails | Check SDK Service is running on port 6001 |

---

## 📊 Performance Benefits

### Before Turborepo
```
Traditional Monorepo:
├── Build time: ~5-8 minutes
├── Test time: ~3-5 minutes  
├── No caching
├── Sequential builds
└── Full rebuilds always
```

### With Turborepo
```
Turborepo Monorepo:
├── Build time: ~1-3 minutes (cached)
├── Test time: ~30s-1min (cached)
├── Intelligent caching
├── Parallel execution
└── Incremental builds
```

### Cache Hit Rates
- **Local Development**: ~80-90% cache hits
- **CI/CD Pipeline**: ~60-70% cache hits  
- **Clean Builds**: 0% (expected)

---

## 🎓 Learning Resources

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [PNPM Workspaces](https://pnpm.io/workspaces)
- [Monorepo Best Practices](https://monorepo.tools/)

---

*This guide is maintained by the Peek-a-boo engineering team. Questions? Ask in #engineering-help* 💬