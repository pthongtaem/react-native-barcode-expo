# Contributing

This guide covers local development, package checks, and releases. For installation and the public API, see the [README](README.md).

## Local development

The Expo example targets SDK 57.

Use Node.js 22.13 or newer and Yarn 4.18.0. Both projects pin the same Yarn version, and the CLI is checked into `.yarn/releases`. Keep `nodeLinker: node-modules`; the example and package checks expect regular `node_modules` directories.

Enable [Corepack](https://yarnpkg.com/corepack) if it is available in your Node installation, then verify `yarn --version` prints `4.18.0`. Without Corepack, invoke the checked-in CLI directly: `node .yarn/releases/yarn-4.18.0.cjs <command>` at the root, or `node ../.yarn/releases/yarn-4.18.0.cjs <command>` from `example-expo`.

The root and example remain separate Yarn projects with separate committed lockfiles. The example overrides `xcode/uuid` to 11.1.1 to address GHSA-w5hq-g745-h8pq while retaining CommonJS support and the `uuid.v4()` API used by `xcode`. Reassess this override when `xcode` updates its dependency.

On a fresh checkout, `dist` is absent. Install the root dependencies and build before installing the example or running typecheck. From the repository root:

```sh
yarn install --immutable
yarn build
yarn lint
yarn typecheck
cd example-expo
yarn install --immutable
npx expo install --check
yarn test
yarn start
```

The example installs the package from the built `dist` directory (`file:../dist`). The build generates its package manifest so the example consumes the compiled library without copying the root development dependencies. After changing the library, rebuild it and run `yarn add react-native-barcode-expo@file:../dist` in the example to refresh the local package copy. This recomputes the content hash stored in the example lockfile; commit that lockfile when the build changes. Build before installing the example in CI as well. Use `yarn install --immutable` for reproducible installs after checkout. Yarn 4 does not support the old `yarn install --force` workflow, and plain `yarn up react-native-barcode-expo` can replace the local dependency with a registry version.

## Run on iOS Simulator

Install Xcode and an iOS Simulator runtime, then complete the build and installation steps above. From `example-expo`, run:

```sh
yarn ios
```

Allow Expo CLI to install or update Expo Go to the version recommended for SDK 57. When the app opens, it displays a barcode labeled `Hello`. Tap **Press me** to change both the barcode and its label to `World`. Tap **Show EAN13** to display `5901234123457`, or **Press me** to return to CODE128. Use **Text size 24**, **Text size 32**, and **Default text size** to resize the label and restore its original size. The bars stay unchanged when only the text size changes.

If Expo Go reports **Could not connect to the server** when using localhost, Metro may be listening on IPv6 (`::1`) while Expo Go connects to IPv4 (`127.0.0.1`). Stop Metro with Ctrl+C and restart with:

```sh
NODE_OPTIONS=--dns-result-order=ipv4first npx expo start --ios --localhost --port 8081
```

Stop Metro with Ctrl+C when finished, and quit Simulator separately.

## Package and release checks

The library is built with React Native Builder Bob. `dist/commonjs` contains CommonJS output, `dist/module` contains ESM output, and `dist/typescript` contains declarations for both module systems. The small `dist/index.cjs` adapter preserves the existing direct `require('react-native-barcode-expo')` component export. Metro can still consume `src/index.tsx` through the `react-native` entry.

Use the package name when importing; generated paths have changed from the old Microbundle layout. The unused UMD and separate modern bundles are no longer generated. `dist/package.json` is generated for the example's `file:../dist` dependency; npm releases are packed from the repository root.

Install the root and `example-expo` dependencies using the development steps above, then run from the repository root:

```sh
npm run release:check
```

This runs lint, packs and installs the actual `.tgz` in a temporary consumer, runs the existing barcode tests against its CommonJS, ESM, and React Native entry points, checks its published TypeScript declarations, and typechecks the repository. The temporary consumer reuses the example's installed peer dependencies and test tools; the library and its production dependencies are installed through npm. This is a package smoke test, not a native device test. Registry access is required, and temporary files are removed when the command finishes.

Use `npm run test:package` to run only the package checks. The `prepack` lifecycle runs `npm run build` automatically before `npm pack` and `npm publish`, so packaging rebuilds `dist` from source. Build output is ignored by Git and generated locally. The root `package.json` explicitly includes `dist` in `files`, so the built JavaScript and declarations are included in npm packages. Do not use `--ignore-scripts` when packing or publishing from a clean checkout. GitHub source archives do not contain built entry points; use npm for a ready-to-use package, or follow the local build steps when working from source.

Run `yarn npm audit --recursive` at the root to check the library's dependency lockfile, including build tools. The example has its own lockfile and can be audited separately from `example-expo`. An audit result reflects known advisories at the time of the check, not a guarantee of security.

For a release, update the version first, run `npm run release:check`, refresh the example's local package with `yarn add react-native-barcode-expo@file:../dist` in `example-expo`, and commit the version, source changes, and updated example lockfile. Do not commit `dist`. Publish the checked commit with `npm publish --access public`, then verify the npm version and create its matching GitHub tag/release. The checks do not publish anything and must pass before publishing; `prepack` automatically builds but does not run the full test suite.

Record the commands run, their results, and any platform testing limitations in the pull request. Summarize release-specific validation and upgrade notes in the GitHub release notes.
