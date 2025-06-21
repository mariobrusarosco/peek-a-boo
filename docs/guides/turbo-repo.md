# Creating a new package

1. Add a new folder in the `packages` folder.
2. Add a `package.json` file to the new folder.
3. Add a name property to the `package.json` file. Eg. `"name": "@peek-a-boo/package_name_here"`
4. Now it's time to define the package's entry point.

```json
{
  "exports": {
    ".": "./src/index.ts"
  }
}
```

5. Run `pnpm install`. This will add an entry in the `pnpm-lock.yaml` file.
6. Add the package name to the `packages` array in the `turbo.json` file.


# Multi-package versions

Package "A" can use lodash 1.0.0
Package "B" can use lodash 2.0.0

By doing so we're creating mismatched versions. It might be for a reason. Maybe package "A" is using a feature that is not available in lodash 2.0.0. Maybe package "B" is using a feature that is not available in lodash 1.0.0.

## General rule:

Avoid mismatched versions as much as possible.

## Reason

We can blot our bundle size. We're increase the size by adding two versions of the same package,
that may have overlapping features.

## Execption of the rule

Migration processs can be painfull and we might need this level of control.
"While we're migrating Package "A"  to be more robust and be named to "Package AA", we need to keep using lodash 1.0.0 for some time."

## How to manage multiple version on a monorepo

We can leverage Syncpack to manage multiple versions of the same package.

## TODO research and use syncpack a bit more
```bash
npx syncpack sync --config syncpack.config.json
```

```json
{
  "packages": ["apps/*", "packages/*"]
}
``` 


# Handling Dependencies

## Peer Dependencies
In practice this is the most helpful prop of the family. (https://youtube.com/clip/UgkxLmBGmeQf3FPhbaXew5mjI7y4XLxEPAap?si=6numXJAfyWTgKdt6)[source]


## Understanding Environment Variable Handling in Turborepo

Turborepo is a powerful tool for managing monorepos, but it's important to understand how it handles environment variables, especially when running builds in CI/CD environments like Vercel or Railway.

### Default Behavior

By default, Turborepo tasks might not automatically inherit all environment variables present in the parent execution environment (e.g., the environment where `turbo build` or `turbo dev` is called). This is a deliberate design to ensure build reproducibility and to give you explicit control over what a task can "see."

### The `env` Property in `turbo.json`

To make specific environment variables available to the scripts executed by a Turborepo task, you need to list them in the `env` array within that task's definition in your `turbo.json` file.

**Example from `turbo.json`:**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env"], // For local dev, tells Turbo to re-run if .env files change
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"],
      "env": [ // Environment variables passed to this task
        "DATABASE_URL",
        "API_KEY",
        "NEXTAUTH_URL",
        "NEXTAUTH_SECRET",
        "NODE_ENV"
        // Add any other environment variables your build scripts need
      ]
    },
    "dev": {
      "cache": false, // Often good to disable cache for dev
      "persistent": true
      // For 'dev' tasks, Turbo often passes variables more readily,
      // but for 'build' in CI, explicit 'env' is crucial.
    }
    // ... other tasks
  }
}
```

**Why is this important for CI/CD (e.g., Vercel, Railway)?**

When your code is built on a platform like Vercel:
1.  You typically define secrets or environment variables in the Vercel project settings.
2.  Vercel's build environment has these variables available.
3.  However, when Turborepo runs your `build` script (e.g., `pnpm build` which in turn might call `turbo run build`), it will only pass through the environment variables listed in the `tasks.build.env` array in `turbo.json`.

If a required variable (like `DATABASE_URL` for Prisma client generation during `next build`, or `NEXTAUTH_SECRET`) is not listed in the `env` array for the `build` task, your build script will not be able to access it, often leading to build failures or runtime errors in the deployed application.

**`globalDependencies` vs. `env` for `.env` files:**

*   `"globalDependencies": ["**/.env"]`: This tells Turborepo that your tasks might depend on the content of `.env` files. If an `.env` file changes, Turborepo knows it might need to re-run tasks that depend on it. This is primarily for local development convenience where `.env` files are directly used.
*   `tasks.<task-name>.env`: This is about *passing through* variables that are already set in the environment (e.g., by the CI/CD system from its secrets management) to the task's execution context.

**In summary:** For builds in CI/CD environments, always ensure that all environment variables required by your build scripts are explicitly listed in the `env` array of the corresponding task definition in `turbo.json`.
