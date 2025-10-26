# Development Guides

Day-to-day development workflows, patterns, and best practices.

## 📚 In This Section

### [Developer Workflow](./developer-workflow.md)
Complete guide to the daily development workflow in the monorepo.

**Covers:**
- Making changes across packages
- Running dev servers
- Testing changes
- Building packages
- Git workflow

### [React 19 Server Components Guide](./react-19-guide.md)
How we use React 19 features in the Dashboard.

**Covers:**
- Server Components vs Client Components
- Server Actions for mutations
- useOptimistic for instant UI updates
- useActionState for form handling
- Data fetching patterns
- ISR caching strategies

### [UI Components](./ui-components.md)
Guide to the UI component system (Shadcn/ui).

**Covers:**
- Available components
- Theme system (dark/light mode)
- Adding new components
- Styling patterns
- Accessibility

### NestJS Guides

#### [Adding Modules](./nestjs/adding-modules.md)
Step-by-step guide to adding new NestJS modules to the SDK Service.

**Covers:**
- Creating controllers
- Creating services
- Setting up DTOs
- Database integration with Prisma
- Testing modules

## 🎯 Common Tasks

### Adding a New Feature
1. Read [Developer Workflow](./developer-workflow.md)
2. Review [Architecture](../01-core/architecture.md)
3. Check [API Architecture](../01-core/api-architecture.md) for API patterns

### Working with the Dashboard
- See [React 19 Guide](./react-19-guide.md)
- See [UI Components](./ui-components.md)

### Working with SDK Service
- See [NestJS: Adding Modules](./nestjs/adding-modules.md)
- See [Database Operations](../04-database/)

### Working with Client SDK
- See [Developer Workflow](./developer-workflow.md)
- See [API Architecture](../01-core/api-architecture.md)

## 🔗 Related Sections

- [Core Concepts](../01-core/) - Architecture and design patterns
- [Database](../04-database/) - Database operations
- [Deployment](../05-deployment/) - Deploying your changes
- [Troubleshooting](../06-troubleshooting/) - Common issues

---

[← Back to Documentation Home](../README.md)
