# Client SDK Module Type Configuration Fix

## Problem Explanation

When running `pnpm dev` or `pnpm dev:client-sdk`, the following warning and error would appear:

```
@peek-a-boo/client-sdk:dev: (node:12845) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///home/mario/coding/peek-a-boo/packages/client-sdk/rollup.config.js?1744473388230 is not specified and it doesn't parse as CommonJS.
@peek-a-boo/client-sdk:dev: Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
@peek-a-boo/client-sdk:dev: To eliminate this warning, add "type": "module" to /home/mario/coding/peek-a-boo/packages/client-sdk/package.json.
@peek-a-boo/client-sdk:dev: (Use `node --trace-warnings ...` to show where the warning was created)
@peek-a-boo/client-sdk:dev: [!] TypeError: Module "file:///home/mario/coding/peek-a-boo/packages/client-sdk/package.json" needs an import attribute of "type: json"
```

This issue occurred because:

1. The Rollup configuration was using ES module syntax with `import/export` statements
2. Node.js was detecting this but had no explicit instruction on how to parse the file
3. The package.json was being imported directly using ESM syntax, which requires special handling for JSON files in ESM

## Fix

We implemented a two-part solution:

1. Added module type specification in `packages/client-sdk/package.json`:

```json
{
  "name": "@peek-a-boo/client-sdk",
  "version": "0.1.0",
  "description": "JavaScript client SDK for the Peek-a-boo feature flag service",
  "private": true,
  "type": "module",
  "main": "dist/index.js",
  // ...rest of the file
}
```

2. Modified the way `package.json` is imported in `packages/client-sdk/rollup.config.js`:

```javascript
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import { readFileSync } from 'fs';

// Import package.json as JSON using the readFileSync workaround
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

// ...rest of the file
```

## Fix Explanation

The solution addresses two distinct issues related to ES modules in Node.js:

1. **Module Type Specification**: By adding `"type": "module"` to package.json, we explicitly tell Node.js to parse all .js files in the package as ES modules by default. This eliminates the warning about ambiguous module type and the performance overhead from re-parsing.

2. **JSON Import in ESM**: In ES modules, importing JSON files directly (using `import pkg from './package.json'`) requires special handling. The standard ESM approach is to use the `fs` module to read and parse the JSON file:
   - We import the `readFileSync` function from the Node.js `fs` module
   - We use `new URL('./package.json', import.meta.url)` to create a proper file URL that works with ESM's resolution system
   - We read the file as a string and parse it with `JSON.parse()`

This solution ensures that:
- Node.js correctly treats the Rollup configuration as an ES module
- The package.json file can be read and accessed properly in an ESM context
- No warnings or errors appear during the build process

This is a common pattern when working with modern JavaScript tooling that uses ES modules in Node.js environments. 