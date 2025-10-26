# Deployment Guides

Comprehensive guides for deploying Peek-a-boo to production environments.

## 📚 In This Section

### [Overview](./overview.md)
High-level overview of the deployment architecture.

**Covers:**
- Deployment targets (Vercel, Railway, Supabase)
- Environment requirements
- CI/CD pipeline overview
- Pre-deployment checklist

### [Dashboard - Vercel](./dashboard-vercel.md)
Guide to deploying the Next.js Dashboard to Vercel.

**Covers:**
- Vercel project setup
- Build configuration
- Environment variables
- Custom domain setup
- Troubleshooting Vercel deployments

### [SDK Service - Railway](./sdk-service-railway.md)
Guide to deploying the NestJS SDK Service to Railway.

**Covers:**
- Railway project setup
- Monorepo deployment configuration
- Environment variables
- Database connection
- WebSocket configuration
- Troubleshooting Railway deployments

### [CI/CD Pipeline](./ci-cd-pipeline.md)
Automated deployment pipeline with GitHub Actions.

**Covers:**
- GitHub Actions workflow
- Automated testing
- Build optimization
- Deployment triggers
- Environment-specific deployments

## 🚀 Quick Deployment

### Dashboard (Vercel)
```bash
# Build locally first
pnpm build:dashboard

# Deploy via Vercel CLI
pnpm deploy:dashboard
```

### SDK Service (Railway)
```bash
# Build locally first
pnpm build:sdk-service

# Deploy via Railway CLI
pnpm deploy:sdk-service
```

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Build succeeds locally
- [ ] Security review complete

### Dashboard (Vercel)
- [ ] Vercel project created
- [ ] Environment variables set
- [ ] Domain configured
- [ ] Build settings verified
- [ ] Deploy and test

### SDK Service (Railway)
- [ ] Railway project created
- [ ] Database connected (Supabase)
- [ ] Environment variables set
- [ ] Port configuration verified
- [ ] Deploy and test

### Post-Deployment
- [ ] Health checks passing
- [ ] APIs responding correctly
- [ ] WebSocket connections working
- [ ] Database migrations applied
- [ ] Monitor logs for errors

## 🌍 Deployment Targets

| Service | Platform | URL Pattern |
|---------|----------|-------------|
| **Dashboard** | Vercel | `https://peek-a-boo-dashboard.vercel.app` |
| **SDK Service** | Railway | `https://sdk-service.up.railway.app` |
| **Database** | Supabase | Connection via DATABASE_URL |

## 🔐 Environment Variables

### Critical Variables
```bash
# Database
DATABASE_URL=           # Supabase connection string
DATABASE_DIRECT_URL=    # Supabase direct connection

# Dashboard
NEXTAUTH_URL=           # Dashboard URL
NEXTAUTH_SECRET=        # Auth secret
NEXT_PUBLIC_SDK_SERVICE_URL=  # SDK Service URL

# SDK Service
PORT=                   # Railway assigns this
DATABASE_URL=           # Same as above
```

See [Environment Variables Guide](../02-setup/environment-variables.md) for complete list.

## ⚠️ Important Notes

1. **Build order matters**: Always build `core` first
2. **Monorepo considerations**: Vercel and Railway need special config
3. **Database migrations**: Run before deploying new code
4. **Environment variables**: Different for prod vs dev
5. **Port configuration**: Dashboard (3000), SDK Service (6001/dynamic)

## 🔧 Troubleshooting

Common issues:
- Build failures → Check `turbo.json` env array
- Module not found → Rebuild core package
- Database connection → Check DATABASE_URL
- API timeouts → Check Railway/Vercel logs

For detailed troubleshooting, see [Troubleshooting Guide](../06-troubleshooting/).

## 🔗 Related Sections

- [Setup](../02-setup/environment-variables.md) - Environment configuration
- [Database](../04-database/) - Database setup and migrations
- [Troubleshooting](../06-troubleshooting/) - Common deployment issues

---

[← Back to Documentation Home](../README.md)
