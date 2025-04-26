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






