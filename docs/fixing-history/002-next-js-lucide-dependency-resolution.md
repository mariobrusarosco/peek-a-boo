# Next.js Lucide React Dependency Resolution Fix

## Problem Explanation

When running `pnpm dev` or specifically `pnpm dev:dashboard`, the Next.js application would fail to start with the following error:

```
@peek-a-boo/dashboard:dev: Caused by:
@peek-a-boo/dashboard:dev:     Syntax Error] {
@peek-a-boo/dashboard:dev:   code: 'GenericFailure'
@peek-a-boo/dashboard:dev: }
@peek-a-boo/dashboard:dev:  ⨯ unhandledRejection: [Error: 
@peek-a-boo/dashboard:dev:   × Expression expected
@peek-a-boo/dashboard:dev:    ╭─[/home/mario/coding/peek-a-boo/apps/dashboard/node_modules/lucide-react:1:1]
@peek-a-boo/dashboard:dev:  1 │ ../../../node_modules/.pnpm/lucide-react@0.284.0_react@18.3.1/node_modules/lucide-react
@peek-a-boo/dashboard:dev:    · ─
```

This error occurred because:

1. PNPM creates a node_modules structure that uses symlinks to avoid duplication
2. Next.js was finding a path reference instead of the actual module contents
3. The import was resolving to a path string instead of the module code
4. The path string wasn't valid JavaScript/TypeScript code, causing a syntax error

This is a common issue with pnpm's dependency structure in monorepos, particularly with Next.js applications.

## Fix

We implemented a two-part solution:

1. Fixed the immediate version issue in `apps/dashboard/package.json`:

```json
{
  "dependencies": {
    // Changed from "^0.284.0" to remove the caret
    "lucide-react": "0.284.0"
  }
}
```

2. Modified the `.npmrc` file to specifically hoist the lucide-react package:

```
node-linker=hoisted
resolution-mode=highest
auto-install-peers=true
strict-peer-dependencies=false
shamefully-hoist=true
save-workspace-protocol=rolling
save-prefix=''
engine-strict=true
public-hoist-pattern[]=next
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]=*prettier*
public-hoist-pattern[]=lucide-react
```

3. Cleaned and reinstalled the node_modules to apply the changes:

```bash
rm -rf node_modules apps/dashboard/node_modules packages/*/node_modules && pnpm install
```

## Fix Explanation

The solution works by addressing pnpm's dependency resolution structure:

1. **Fixed Version**: By removing the caret (`^`) from the version number, we prevent potential version mismatches that could exacerbate the issue.

2. **Public Hoisting**: The most important fix was adding `lucide-react` to the `public-hoist-pattern` in `.npmrc`. This tells pnpm to hoist the lucide-react package to the root node_modules directory, making it directly accessible to all packages without going through symlinks.

3. **Clean Install**: By removing all node_modules folders and reinstalling, we ensured the new hoisting pattern was applied correctly.

PNPM's default behavior creates a nested node_modules structure that uses symlinks to maintain package isolation while avoiding duplication. This is generally more efficient, but Next.js and some other tools expect a flat node_modules structure like npm or yarn create.

The "shamefully-hoist" option helps with this, but sometimes specific packages need explicit hoisting patterns. In this case, lucide-react had to be explicitly hoisted to the root node_modules folder.

This fix allows:
- Next.js to properly import and use lucide-react components
- Maintaining pnpm's dependency management benefits
- Avoiding duplicate installations of the package

It's a common pattern required when using pnpm with Next.js and similar frameworks that haven't fully adapted to pnpm's node_modules structure. 