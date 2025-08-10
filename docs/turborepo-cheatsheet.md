# 🚀 Turborepo Cheat Sheet

> **Quick reference for Peek-a-boo engineers**

## 📋 Essential Commands

### 🔥 Daily Development
```bash
# Start everything in dev mode
pnpm dev

# Start specific app only
pnpm dev:dashboard      # Next.js on :3000
pnpm dev:sdk-service    # NestJS on :3001
pnpm dev:client-sdk     # Rollup watch mode

# Build everything
pnpm build

# Run tests
pnpm test
```

### 🎯 Targeted Operations
```bash
# Build with dependencies (recommended)
pnpm build --filter=@peek-a-boo/dashboard...

# Build single package only
pnpm build --filter=@peek-a-boo/dashboard

# Test specific package
pnpm test --filter=@peek-a-boo/sdk-service

# Lint everything
pnpm lint
```

### 🧹 Cache Management
```bash
# Force rebuild (ignore cache)
turbo run build --force

# Clear all cache
rm -rf .turbo

# Check what would run
turbo run build --dry-run
```

## 📦 Package Quick Reference

| Package | Port | Build Output | Main Purpose |
|---------|------|--------------|--------------|
| `dashboard` | 3000 | `.next/` | Admin UI for feature flags |
| `sdk-service` | 3001 | `dist/` | API + WebSocket server |
| `client-sdk` | - | `dist/` | JS library for clients |
| `shared` | - | `dist/` | Database + shared types |

## 🔗 Workspace Dependencies

```
shared (base)
├── dashboard (depends on shared)
├── sdk-service (depends on shared)
└── client-sdk (depends on shared)
```

## ⚡ Performance Tips

### ✅ Fast Development
- Use `pnpm dev:dashboard` when only working on frontend
- Use `pnpm dev:sdk-service` when only working on backend
- Trust the cache - don't force rebuild unless necessary
- Keep `.turbo/` folder for faster builds

### 🚀 Efficient Building
- Use `--filter` to build only what you need
- Let Turborepo handle dependencies automatically
- Cache hits save 60-80% of build time

## 🛠️ Troubleshooting

### Common Issues & Solutions

| Problem | Quick Fix |
|---------|-----------|
| Types not updating | `pnpm build:shared` |
| Build randomly fails | `turbo run build --force` |
| Dev server won't start | Kill processes: `pkill -f "next\|nest"` |
| Prisma client outdated | `cd packages/shared && npx prisma generate` |
| Port already in use | `lsof -ti:3000 \| xargs kill -9` |

### 🔍 Debug Commands
```bash
# See what Turbo would run
turbo run build --dry-run --graph

# Verbose output
turbo run build --verbose

# Check workspace info
pnpm list --depth=0

# See all available scripts
pnpm run
```

## 📁 Important Files

| File | Purpose |
|------|---------|
| `turbo.json` | Task pipeline configuration |
| `pnpm-workspace.yaml` | Workspace package definitions |
| `package.json` | Root scripts and dependencies |
| `.turbo/` | Cache directory (don't commit) |

## 🎯 Filtering Syntax

```bash
# Package and its dependencies
--filter=@peek-a-boo/dashboard...

# Package only (no deps)
--filter=@peek-a-boo/dashboard

# Multiple packages
--filter=@peek-a-boo/dashboard --filter=@peek-a-boo/sdk-service

# All apps
--filter=./apps/*

# All packages
--filter=./packages/*
```

## 🚀 Deployment Commands

```bash
# Production builds
pnpm build:dashboard    # For Vercel
pnpm build:sdk-service  # For Railway

# CI/CD optimized
pnpm build:ci          # Dashboard with dependencies

# Database operations
pnpm prisma:migrate:dev    # Development
pnpm prisma:migrate:deploy # Production
```

## 📊 Environment Variables

### Required for Build
```bash
DATABASE_URL=
SUPABASE_PROJECT_ID=
SUPABASE_DB_PASSWORD=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### Development vs Production
- **Dev**: Uses `.env.local` files
- **Prod**: Set in Vercel/Railway dashboards
- **Shared**: Managed in `packages/shared/.env`

## 🎨 Code Organization

### Where to Put New Code

| Type | Location | Example |
|------|----------|---------|
| Database models | `packages/shared/prisma/` | User, FeatureFlag |
| Shared utilities | `packages/shared/src/` | validation, helpers |
| Dashboard pages | `apps/dashboard/src/` | admin routes |
| API endpoints | `apps/sdk-service/src/` | REST/WebSocket |
| SDK functions | `packages/client-sdk/src/` | public API |

### Import Patterns
```typescript
// ✅ Good - workspace reference
import { User } from '@peek-a-boo/shared'

// ❌ Bad - relative path across packages
import { User } from '../../packages/shared/src/types'
```

## 🔄 Git Workflow

### Branch Strategy
```bash
main                    # Production ready
├── develop            # Integration branch
├── feature/flag-ui    # Feature branches
└── hotfix/auth-bug    # Emergency fixes
```

### Commit Messages
```bash
feat(dashboard): add feature flag toggle UI
fix(sdk-service): resolve WebSocket connection issue
docs(turbo): update deployment guide
chore(deps): upgrade Next.js to v14
```

---

## 🆘 Need Help?

- 📖 **Full Guide**: See `docs/turborepo-guide.md`
- 🏗️ **Architecture**: See `docs/architecture-diagrams.md`
- 💬 **Team Chat**: #engineering-help
- 📚 **Turborepo Docs**: https://turbo.build/repo/docs

---

*Keep this cheat sheet handy for quick reference during development!* ⚡