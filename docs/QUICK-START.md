# 🚀 Quick Start Guide

**Get Peek-a-boo running in 5 minutes!**

## Prerequisites

- Node.js 18+
- pnpm 8+
- Docker & Docker Compose

## Setup Steps

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Database

```bash
docker compose up -d
```

### 3. Setup Environment

```bash
# Copy environment file
cp packages/core/.env.example packages/core/.env
```

### 4. Build Core Package

```bash
pnpm build:core
```

### 5. Run Migrations

```bash
pnpm run prisma:migrate:dev
```

### 6. Seed Database (Optional)

```bash
pnpm run prisma:seed
```

Login with:
- **Email**: `admin@peek-a-boo.dev`
- **Password**: `password123`

### 7. Start Development Servers

```bash
pnpm dev
```

## Access Your Apps

- 🖥️ **Dashboard**: http://localhost:3000
- ⚡ **SDK Service**: http://localhost:6001
- 🗄️ **Prisma Studio**: `pnpm --filter=@peek-a-boo/core prisma:studio` → http://localhost:5555

## Next Steps

- 📖 [Full Setup Guide](./02-setup/development-environment.md)
- 🏗️ [Architecture Overview](./01-core/architecture.md)
- 💻 [Developer Workflow](./03-development/developer-workflow.md)
- 🗄️ [Database Guide](./04-database/setup.md)

## Common Issues

**Build fails?**
```bash
turbo run build --force  # Clear cache
```

**Types not updating?**
```bash
pnpm build:core  # Rebuild shared types
```

**Database connection issues?**
- Ensure Docker is running: `docker compose ps`
- Check port 5438 is available
- Verify DATABASE_URL in `packages/core/.env`

## Need Help?

- 📚 [Full Documentation](./README.md)
- 🐛 [Troubleshooting](./06-troubleshooting/README.md)
- 💬 Report issues on GitHub

---

**Ready to build?** Check out the [Developer Workflow](./03-development/developer-workflow.md) guide!
