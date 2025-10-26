# Client SDK TypeScript Declaration Bundling Fix

## Problem Explanation

When running `pnpm dev` or specifically `pnpm dev:client-sdk`, the build process would fail with the following error:

```
rollup v3.29.4
@peek-a-boo/client-sdk:dev: bundles dist/dts/index.d.ts → dist/index.d.ts...
@peek-a-boo/client-sdk:dev: [!] RollupError: Could not resolve entry module "dist/dts/index.d.ts".
```

This error occurred because Rollup was trying to bundle TypeScript declaration files (`d.ts`) that hadn't been generated yet. The issue was particularly problematic in watch mode (-w) because:

1. The TypeScript compiler hadn't generated the declaration files yet
2. The Rollup configuration was trying to bundle non-existent declaration files
3. This caused the entire development process to fail with exit code 1

## Fix

We implemented a multi-part solution:

1. Modified `packages/client-sdk/package.json` to explicitly generate declaration files before watch mode:

```json
{
  "scripts": {
    "clean": "rm -rf dist",
    "build": "npm run clean && rollup -c",
    "generate-dts": "tsc --declaration --emitDeclarationOnly --declarationDir dist/dts --project tsconfig.json",
    "dev": "npm run clean && npm run generate-dts && rollup -c -w",
    "test": "jest",
    "lint": "eslint src --ext .ts",
    "prepublishOnly": "npm run build"
  }
}
```

2. Updated `packages/client-sdk/tsconfig.json` to properly configure declaration output:

```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationDir": "dist/dts",
    "outDir": "dist/js"
    // ...other options
  }
}
```

3. Modified `packages/client-sdk/rollup.config.js` to handle watch mode differently:

```javascript
// Determine if we're in watch mode
const isWatchMode = process.argv.includes('-w') || process.argv.includes('--watch');

// Only include the dts bundle in non-watch mode
const configs = [
  // Main bundle configuration
  {
    // ...
    plugins: [
      // ...
      typescript({ 
        tsconfig: './tsconfig.json',
        // In watch mode, we generate declarations separately
        declaration: !isWatchMode,
        declarationDir: !isWatchMode ? './dist/dts' : undefined
      }),
      // ...
    ],
  }
];

// Only add the dts bundling in non-watch mode
if (!isWatchMode) {
  configs.push({
    input: 'dist/dts/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts()],
  });
}

export default configs;
```

## Fix Explanation

The solution works through several complementary approaches:

1. **Separated Declaration Generation**: By adding a `generate-dts` script that explicitly runs TypeScript compiler to generate declarations, we ensure the declaration files exist before Rollup tries to bundle them.

2. **Watch Mode Detection**: The Rollup configuration now detects if it's running in watch mode and adapts its behavior accordingly:
   - In normal build mode, it generates declarations and bundles them
   - In watch mode, it skips the declaration bundling step since we handle it separately

3. **Proper TypeScript Configuration**: The `tsconfig.json` now correctly separates JavaScript output (`outDir`) from TypeScript declarations (`declarationDir`), ensuring both can be generated and managed independently.

This solution allows:
- Clean builds to work correctly for production
- Watch mode to work correctly during development
- Rollup to focus on bundling JavaScript code in watch mode
- TypeScript compiler to handle declaration generation separately

The fix maintains the proper TypeScript declaration files needed for TypeScript users of the client SDK while enabling a smooth development experience for the SDK developers. 