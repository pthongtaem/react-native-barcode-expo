# Contributing

This guide covers local development, package checks, and releases. For installation and the public API, see the [README](README.md).

## Local development

The Expo example targets SDK 57.

Use Node.js 22.13 or newer and Yarn 1.22.19. From the repository root:

```sh
yarn install
yarn build
yarn lint
yarn typecheck
cd example-expo
yarn install
npx expo install --check
yarn test
yarn start
```

The example installs the package from the built `dist` directory (`file:../dist`). The build generates its package manifest so the example consumes the compiled library without copying the root development dependencies. After changing the library, rebuild it and run `yarn install --force` in the example to refresh the local package copy.

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

Use `npm run test:package` to run only the package checks. The `prepack` lifecycle runs `npm run build` automatically before `npm pack` and `npm publish`, so packaging rebuilds `dist` from source. Build output remains committed to Git; review and commit any generated changes before releasing.

Run `yarn audit` at the root to check the library's dependency lockfile, including build tools. The example has its own lockfile and can be audited separately from `example-expo`. An audit result reflects known advisories at the time of the check, not a guarantee of security.

For a release, update the version first, run `npm run release:check`, refresh the example's local package with `yarn install --force` in `example-expo`, and commit the version, lockfile, and generated changes. Publish the checked commit with `npm publish --access public`, then verify the npm version and create its matching GitHub tag/release. The checks do not publish anything and must pass before publishing; `prepack` automatically builds but does not run the full test suite.

Record the commands run, their results, and any platform testing limitations in the pull request. Summarize release-specific validation and upgrade notes in the GitHub release notes.
