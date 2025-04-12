import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import { readFileSync } from 'fs';

// Import package.json as JSON using the readFileSync workaround
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

// Determine if we're in watch mode
const isWatchMode = process.argv.includes('-w') || process.argv.includes('--watch');

// Only include the dts bundle in non-watch mode
const configs = [
  // Main bundle - ESM, CommonJS, and UMD builds
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: true,
      },
      {
        name: 'PeekABoo',
        file: pkg.browser,
        format: 'umd',
        sourcemap: true,
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({ 
        tsconfig: './tsconfig.json',
        // In watch mode, we generate declarations separately
        declaration: !isWatchMode,
        declarationDir: !isWatchMode ? './dist/dts' : undefined
      }),
      terser(),
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