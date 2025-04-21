# Installing Dependencies in a Turborepo with pnpm

This guide explains how to install dependencies in our monorepo structure using pnpm and Turborepo, with Tailwind CSS v4 as a practical example.

## Understanding Our Project Structure

Our project uses:
- **Turborepo** for managing our monorepo
- **pnpm** as our package manager
- Workspace packages in the `apps/` and `packages/` directories

The structure is defined in our `pnpm-workspace.yaml` file, which specifies which directories contain workspace packages.

## Installing Dependencies

### For a Specific Workspace

To install a dependency for a specific workspace (such as our dashboard app), you'll need to use the `--filter` flag with pnpm.

#### Example: Installing Tailwind CSS v4 for the Dashboard App

Following the [official Tailwind CSS v4 guide for Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs), here's how to install Tailwind CSS v4 in our dashboard app:

```bash
# Navigate to the root of the monorepo
cd /path/to/peek-a-boo

# Install Tailwind CSS and its required packages
pnpm add -D tailwindcss @tailwindcss/postcss postcss --filter @peek-a-boo/dashboard
```

### Explanation

1. The `--filter` flag tells pnpm which workspace to install the dependency in
2. `@peek-a-boo/dashboard` is the package name defined in the dashboard's package.json
3. `-D` specifies that these are development dependencies
4. In Tailwind CSS v4, we install `tailwindcss` and `@tailwindcss/postcss` packages (notice the change from previous versions)

## Setting Up Configuration Files

For Tailwind CSS v4 to work properly, you need:

1. **postcss.config.mjs** (note the changed extension from .js to .mjs):
```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

2. **Import Tailwind CSS in your global CSS file**:

In your `./src/app/globals.css`:
```css
@import "tailwindcss";
```

3. **No separate tailwind.config file needed**

Tailwind CSS v4 no longer requires a separate configuration file by default, making setup much simpler.

## Verifying Installation

After installation, check the `package.json` in the dashboard app to confirm that the dependencies were added correctly:

```json
"devDependencies": {
  "tailwindcss": "^4.x.x",
  "@tailwindcss/postcss": "^4.x.x",
  "postcss": "^8.x.x",
  // other dependencies...
}
```

## Using Tailwind in Your Components

You can start using Tailwind's utility classes right away in your React components:

```tsx
export default function Home() {
  return (
    <h1 className="text-3xl font-bold underline">
      Hello world!
    </h1>
  )
}
```

## Other Common pnpm Commands in a Turborepo

### Install a Shared Dependency Across All Workspaces

```bash
pnpm add -w package-name
```

This adds a dependency to the root `package.json`.

### Install a Dependency Only in the Root Package

```bash
pnpm add package-name --ignore-workspace-root-check
```

### Update a Dependency Across All Workspaces

```bash
pnpm update package-name -r
```

### Install Multiple Dependencies at Once

```bash
pnpm add -D package1 package2 package3 --filter @peek-a-boo/dashboard
```

### Install an Exact Version of a Package

```bash
pnpm add -D package-name@1.2.3 --filter @peek-a-boo/dashboard
```

## Working with Turborepo

Turborepo optimizes builds by caching results. When you modify dependencies:

1. Clear the Turborepo cache if needed: `pnpm turbo clean`
2. Build with proper filtering: `pnpm turbo build --filter=@peek-a-boo/dashboard...`

## Common Issues and Solutions

### Peer Dependency Warnings

If you see peer dependency warnings, you may need to install the missing peer dependencies:

```bash
pnpm add -D missing-peer-dependency --filter @peek-a-boo/dashboard
```

### Workspace Dependencies

To use one workspace package in another (e.g., using a shared package in dashboard):

```json
// In dashboard package.json
"dependencies": {
  "@peek-a-boo/shared": "workspace:*"
}
```

## Best Practices

1. Always run commands from the root of the monorepo
2. Use package names as defined in each package.json file
3. Check the turbo.json file to understand workspace dependencies
4. Keep versions consistent across workspaces when possible
5. Use the `-D` flag for development dependencies
6. Document new dependencies in project documentation

## Further Reading

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs/installation)
- [Tailwind CSS Next.js Guide](https://tailwindcss.com/docs/installation/framework-guides/nextjs)
- [pnpm Documentation](https://pnpm.io/workspaces)
- [Turborepo Documentation](https://turbo.build/repo/docs) 