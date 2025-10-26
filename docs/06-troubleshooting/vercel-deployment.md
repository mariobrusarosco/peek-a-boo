# Fix Log: 003 - Vercel Deployment Failures for Dashboard App

## Date: 2025-05-10

## Issues Resolved:

Two primary issues were preventing the `@peek-a-boo/dashboard` application from deploying successfully on Vercel:

1.  **Unsupported `.npmrc` configuration**: Vercel builds were failing with an error related to `use-node-version` in an `.npmrc` file.
2.  **Missing Environment Variables during Turborepo Build**: After resolving the first issue, builds were failing because necessary environment variables were not accessible to the build scripts managed by Turborepo.

---

### Issue 1: Unsupported `.npmrc` Configuration

#### a) What was the issue?
Vercel's deployment pipeline for the `apps/dashboard` Next.js application was failing with the error:
`Error: Detected unsupported "use-node-version" in your ".npmrc". Please use "engines" in your "package.json" instead.`

This indicated Vercel does not support specifying the Node.js version via the `use-node-version` directive in an `.npmrc` file.

#### b) How it was solved (Troubleshooting & Solution):
1.  **Initial Checks**:
    *   Confirmed the `apps/dashboard/package.json` had an `engines` field (e.g., `"node": ">=22.0.0"`).
    *   Verified Vercel project UI settings for Node.js version were aligned (e.g., `22.x`).
2.  **Discovery of Root `.npmrc`**: An initial search for `.npmrc` at the project root yielded no results, which was misleading. A subsequent attempt to create a placeholder `.npmrc` (using `write_to_file`) failed because the file `c:\Users\mario\coding\peek-a-boo\.npmrc` already existed.
3.  **Identifying the Culprit**: Viewing the contents of the root `c:\Users\mario\coding\peek-a-boo\.npmrc` revealed the problematic lines:
    ```
    use-node-version=22.0.0
    node-version=22.0.0
    ```
4.  **Resolution**: The root `.npmrc` file was edited to remove these two lines. Vercel relies on the `engines` field in the application's `package.json` (e.g., `apps/dashboard/package.json`) and its own UI settings to determine the Node.js version for the build and runtime environment.

#### c) Why this solved it:
Removing the unsupported `use-node-version` and the redundant `node-version` directives from the root `.npmrc` file allowed Vercel's build process to proceed without conflict, using its preferred methods for Node.js version selection.

---

### Issue 2: Missing Environment Variables during Turborepo Build

#### a) What was the issue?
After fixing the `.npmrc` issue, Vercel builds for `@peek-a-boo/dashboard` still failed. The error message was `ERROR run failed: command exited (2)`, and build logs showed warnings for missing environment variables during the build process of `@peek-a-boo/shared` and `@peek-a-boo/dashboard`:
```
[warn] @peek-a-boo/shared#build
[warn]   - NEXTAUTH_URL, NEXTAUTH_SECRET, DATABASE_URL, etc.
[warn] @peek-a-boo/dashboard#build
[warn]   - NEXTAUTH_URL, NEXTAUTH_SECRET, DATABASE_URL, etc.
```
This indicated that environment variables set in Vercel's project settings were not being passed through to the individual package build scripts when orchestrated by Turborepo.

#### b) How it was solved (Troubleshooting & Solution):
1.  **Reviewing Turborepo Configuration**: The `turbo.json` file was inspected. The `build` task was configured as follows:
    ```json
    "tasks": {
      "build": {
        "dependsOn": ["^build"],
        "outputs": ["dist/**", ".next/**"],
        "env": [] // This was the key problem
      }
    }
    ```
    The empty `env: []` array meant Turborepo would not pass any environment variables from the Vercel build environment to the tasks.
2.  **Resolution**: The `turbo.json` file was modified to explicitly list the environment variables required by the build tasks:
    ```json
    "tasks": {
      "build": {
        "dependsOn": ["^build"],
        "outputs": ["dist/**", ".next/**"],
        "env": [
          "DATABASE_URL",
          "SUPABASE_PROJECT_ID",
          "SUPABASE_DB_PASSWORD",
          "NEXTAUTH_URL",
          "NEXTAUTH_SECRET",
          "NEXT_PUBLIC_SUPABASE_URL",
          "NEXT_PUBLIC_SUPABASE_ANON_KEY",
          "NODE_ENV",
          "VERCEL_ENV",
          "VERCEL_URL"
        ]
      }
    }
    ```

#### c) Why this solved it:
By specifying the required environment variables in the `tasks.build.env` array within `turbo.json`, Turborepo was instructed to pass these variables from Vercel's build environment (where they are set as secrets/project variables) into the execution context of each package's `build` script. This allowed the `next build` process (and any build steps in `shared`) to access necessary configuration values.

---

## Key Takeaways:

*   Deployment platforms like Vercel have specific ways they expect Node.js versions to be defined (typically `package.json` `engines` field and UI settings, not `use-node-version` in `.npmrc`).
*   Root-level configuration files (like `.npmrc`) in a monorepo can affect builds of specific applications within that monorepo on platforms like Vercel.
*   Turborepo requires explicit configuration (`env` array in task definitions in `turbo.json`) to pass environment variables from the CI/CD environment to individual package build scripts.
