# Troubleshooting

Solutions to common issues encountered when developing with Peek-a-boo.

## 📚 Issue Categories

### 🔧 Build & Dependencies
- [Build Dependencies](./build-dependencies.md) - Fixing build order and dependency issues
- [Lockfile Sync](./lockfile-sync.md) - Resolving pnpm lockfile conflicts

### 📦 Client SDK
- [TypeScript Declaration Bundling](./client-sdk-typescript.md) - Fixing TypeScript declaration generation
- [Module Configuration](./sdk-module-config.md) - ESM vs CommonJS configuration issues
- [Lucide Dependency Resolution](./lucide-dependency.md) - Fixing lucide-react module resolution

### 🚀 Deployment
- [Vercel Deployment Fixes](./vercel-deployment.md) - Comprehensive Vercel deployment troubleshooting
- [Vercel Config](./vercel-config.md) - Vercel configuration issues
- [Railway Deployment](../05-deployment/sdk-service-railway.md#troubleshooting) - See deployment guide

### 🎨 Frontend
- [ESLint & Routing Fixes](./eslint-routing.md) - ESLint configuration and Next.js routing issues

### 🗄️ Database
- See [Database Troubleshooting](../04-database/setup.md#troubleshooting)
- Connection issues
- Migration problems
- Prisma client errors

## 🎯 Quick Fixes

### Build Failing?
```bash
# Clear Turborepo cache
turbo run build --force

# Rebuild core package
pnpm build:core

# Clean install
rm -rf node_modules apps/*/node_modules packages/*/node_modules
pnpm install
```

### Types Not Updating?
```bash
# Regenerate Prisma client
pnpm --filter=@peek-a-boo/core prisma:generate

# Rebuild core
pnpm build:core

# Restart TypeScript server in your editor
```

### Dev Server Issues?
```bash
# Kill all node processes
pkill -f node

# Restart everything
pnpm dev
```

### Database Connection Failed?
```bash
# Check Docker is running
docker compose ps

# Restart database
docker compose down
docker compose up -d

# Verify port 5438 is available
lsof -i :5438
```

### Port Already in Use?
```bash
# Find process using port
lsof -i :3000  # Dashboard
lsof -i :6001  # SDK Service
lsof -i :5438  # Database

# Kill process
kill -9 <PID>
```

## 📖 Issue Index

All documented issues with solutions:

| Issue | Category | Status | Guide |
|-------|----------|--------|-------|
| TypeScript declarations not bundling | Client SDK | ✅ Resolved | [Link](./client-sdk-typescript.md) |
| Lucide React module resolution | Build | ✅ Resolved | [Link](./lucide-dependency.md) |
| ESM vs CommonJS config | Client SDK | ✅ Resolved | [Link](./sdk-module-config.md) |
| Vercel deployment failures | Deployment | ✅ Resolved | [Link](./vercel-deployment.md) |
| Build dependencies incorrect | Build | ✅ Resolved | [Link](./build-dependencies.md) |
| Lockfile out of sync | Dependencies | ✅ Resolved | [Link](./lockfile-sync.md) |
| ESLint routing errors | Frontend | ✅ Resolved | [Link](./eslint-routing.md) |
| Vercel config issues | Deployment | ✅ Resolved | [Link](./vercel-config.md) |

## 🆘 Still Stuck?

If you can't find a solution here:

1. **Check related sections:**
   - [Setup Guides](../02-setup/)
   - [Database Guide](../04-database/)
   - [Deployment Guides](../05-deployment/)

2. **Search GitHub Issues:**
   - Check closed issues for similar problems
   - Open a new issue with details

3. **Review recent changes:**
   - Use `git log` to see what changed
   - Check if issue started after a specific commit

4. **Ask for help:**
   - Include error messages
   - Share relevant configuration
   - Mention steps to reproduce

## 💡 Tips for Preventing Issues

1. **Always build core first**: `pnpm build:core`
2. **Use exact commands from docs**: Don't improvise
3. **Keep dependencies updated**: Regular `pnpm update`
4. **Check environment variables**: Compare with `.env.example`
5. **Read error messages**: They usually tell you what's wrong
6. **Use Turborepo cache wisely**: Clear when stuck

## 🔗 Related Sections

- [Setup](../02-setup/) - Proper setup prevents many issues
- [Development](../03-development/) - Best practices
- [Deployment](../05-deployment/) - Deployment-specific issues

---

[← Back to Documentation Home](../README.md)
