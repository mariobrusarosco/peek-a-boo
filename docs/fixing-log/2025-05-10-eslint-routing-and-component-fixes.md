# Fixing Log: 2025-05-10 - ESLint Configuration for SDK Service and Client SDK

## Issue Summary

The `apps/sdk-service` and `packages/client-sdk` packages within the Peek-a-boo monorepo were experiencing linting failures. The primary error was "ESLint couldn't find a configuration file." Attempts to use the `pnpm create @eslint/config` interactive tool led to further complications, including the generation of unexpected configuration file formats (e.g., `eslint.config.mjs` - the new "flat config") and confusion when multiple config files might have co-existed. Additionally, the `packages/client-sdk` was missing essential devDependencies required for TypeScript linting.

## Resolution Steps

1.  **Clean Slate**: Ensured a clean state by removing any pre-existing or problematic ESLint configuration files (e.g., `.eslintrc.js`, `eslint.config.mjs`) from both `apps/sdk-service/` and `packages/client-sdk/`.

2.  **Manual ESLint Configuration File Creation**:
    *   A new `.eslintrc.json` file was created in `c:\Users\mario\coding\peek-a-boo\apps\sdk-service\` with a baseline configuration suitable for a Node.js and TypeScript environment. Content:
        ```json
        {
          "root": true,
          "parser": "@typescript-eslint/parser",
          "plugins": [
            "@typescript-eslint"
          ],
          "extends": [
            "eslint:recommended",
            "plugin:@typescript-eslint/recommended"
          ],
          "env": {
            "node": true,
            "es6": true
          },
          "parserOptions": {
            "ecmaVersion": 2020,
            "sourceType": "module"
          },
          "rules": {}
        }
        ```
    *   A new `.eslintrc.json` file was created in `c:\Users\mario\coding\peek-a-boo\packages\client-sdk\` with a baseline configuration suitable for a Browser and TypeScript environment. Content:
        ```json
        {
          "root": true,
          "parser": "@typescript-eslint/parser",
          "plugins": [
            "@typescript-eslint"
          ],
          "extends": [
            "eslint:recommended",
            "plugin:@typescript-eslint/recommended"
          ],
          "env": {
            "browser": true,
            "es6": true
          },
          "parserOptions": {
            "ecmaVersion": 2020,
            "sourceType": "module"
          },
          "rules": {}
        }
        ```

3.  **Dependency Verification and Updates**:
    *   The `package.json` for `apps/sdk-service/` was confirmed to already include the necessary `eslint`, `@typescript-eslint/parser`, and `@typescript-eslint/eslint-plugin` devDependencies.
    *   The `package.json` for `packages/client-sdk/` was found to be missing `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin`.
    *   These missing devDependencies were added to `packages/client-sdk/package.json`:
        ```json
        "@typescript-eslint/eslint-plugin": "^6.0.0",
        "@typescript-eslint/parser": "^6.0.0",
        ```

4.  **Dependency Installation**: The USER ran `pnpm install` from the monorepo root (`c:\Users\mario\coding\peek-a-boo\`) to install the newly added dependencies for `packages/client-sdk`.

## Outcome

After these steps, the ESLint configuration issues were resolved. The `turbo run lint` command (or equivalent `pnpm lint` from the root) now executes successfully for both `apps/sdk-service` and `packages/client-sdk`, allowing for proper code linting according to the defined TypeScript standards.
