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
│  └─────────────┘  └─────────────┘  └─────────────┘    │
│         │                 │                 │          │
│         └─────────────────┼─────────────────┘          │
│                           │                            │
│                  ┌─────────────┐                       │
│                  │   Shared    │                       │
│                  │  (Prisma)   │                       │
│                  └─────────────┘                       │
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
│   ├── 📁 shared/              # Database & utilities
│   └── 📁 client-sdk/          # JavaScript SDK
├── 📄 package.json             # Root workspace config
├── 📄 turbo.json              # Turborepo configuration
└── 📄 pnpm-workspace.yaml     # PNPM workspace setup
```

### Package Roles & Responsibilities

| Package | Type | Purpose | Tech Stack |
|---------|------|---------|------------|
| `@peek-a-boo/dashboard` | **App** | Admin dashboard for managing feature flags | Next.js, React, Tailwind, NextAuth |
| `@peek-a-boo/sdk-service` | **App** | Backend API & WebSocket service | NestJS, Socket.io, Express |
| `@peek-a-boo/shared` | **Package** | Database models, utilities, types | Prisma, TypeScript |
| `@peek-a-boo/client-sdk` | **Package** | Client library for feature flags | Rollup, TypeScript |

---

## 🔗 Dependency Graph

### Visual Dependency Flow
```
Build Order (Bottom → Top):

Level 1: 📦 @peek-a-boo/shared
         ├── Prisma Client Generation
         ├── Database Types
         └── Shared Utilities
              │
              ├─────────────────┬─────────────────┐
              ▼                 ▼                 ▼
Level 2: 📦 client-sdk    🚀 dashboard      🚀 sdk-service
         ├── SDK Build     ├── Next.js       ├── NestJS
         ├── Type Defs     ├── UI Components ├── API Routes
         └── Rollup        └── Auth Setup    └── WebSockets

Legend: 📦 = Package, 🚀 = Application
```

### Workspace Dependencies
```json
{
  "dashboard": ["@peek-a-boo/shared"],
  "sdk-service": ["@peek-a-boo/shared"], 
  "client-sdk": ["@peek-a-boo/shared"],
  "shared": []  // No internal dependencies
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
   ├── 📦 shared: prisma generate + tsc
   │   └── ✅ Generates types & client
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
   ├── 📦 shared: tsc --watch
   ├── 📦 client-sdk: rollup --watch  
   ├── 🚀 dashboard: next dev (port 3000)
   └── 🚀 sdk-service: nest start --watch (port 3001)
   
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

# Run command in specific workspace
pnpm --filter=@peek-a-boo/shared prisma:studio
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
- **Use workspace references**: `"@peek-a-boo/shared": "workspace:*"`
- **Leverage filtering**: Target specific packages with `--filter`
- **Trust the cache**: Let Turborepo handle incremental builds
- **Keep shared code in packages**: Don't duplicate logic across apps
- **Use consistent scripts**: Same script names across all packages

### ❌ Don'ts  
- **Don't bypass the build system**: Always use `turbo run` commands
- **Don't ignore cache**: `.turbo/` folder speeds up everything
- **Don't create circular dependencies**: Keep the dependency graph clean
- **Don't duplicate dependencies**: Use workspace inheritance
- **Don't skip type checking**: `lint:types` catches issues early

### 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails randomly | Clear cache: `turbo run build --force` |
| Types not updating | Rebuild shared: `pnpm build:shared` |
| Dev server issues | Restart with: `pnpm dev` |
| Dependency conflicts | Check workspace versions in package.json |

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