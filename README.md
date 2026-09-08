
# react-native-barcode-expo

React Native component to generate barcodes. Uses [JsBarcode](https://github.com/lindell/JsBarcode) for encoding of data.

## Getting started

#### Step 1

Install `react-native-barcode-expo`:

    yarn add react-native-barcode-expo


#### Step 2

Install the native SVG dependency using the version selected by your Expo SDK:

```sh
npx expo install react-native-svg
```

For bare React Native, install `react-native-svg` and run `npx pod-install` for iOS.

#### Step 3

Start using the component

```javascript
import Barcode from 'react-native-barcode-expo';

<Barcode value="Hello World" format="CODE128" />
```

You can find more info about the supported barcodes in the [JsBarcode README](https://github.com/lindell/JsBarcode#supported-barcodes).

![](./images/example.png)

## Properties

Only `value` is required. All other props are optional.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | Required | Non-empty data to encode. It must be valid for the selected format. |
| `format` | `BarcodeFormat` | `"CODE128"` | Barcode format supported by JsBarcode, such as `CODE128`, `CODE39`, or `EAN13`. |
| `width` | `number` | `2` | Width of a single bar, rather than the total barcode width. |
| `height` | `number` | `100` | Height of the barcode bars. |
| `text` | `string` | Not displayed | Label below the barcode. Pass `text={value}` to display the encoded value; this does not change the encoded data. |
| `textSize` | `number` | React Native default | Font size of the label. Has no effect unless `text` is provided. Omitting it preserves the default text size. |
| `textColor` | `string` | `"#000000"` | Label color. |
| `lineColor` | `string` | `"#000000"` | Bar color. |
| `background` | `string` | `"#ffffff"` | Background color. |
| `onError` | `(error: Error) => void` | Not set | Called for an empty value, an unsupported format, or data invalid for the selected format. Without a handler, these validation errors are thrown. |

To customize the label size:

```jsx
<Barcode value="Hello World" text="Hello World" textSize={24} />
```

Changing `textSize` updates the label without changing the encoded barcode.

## TypeScript formats

The `format` prop uses the exported `BarcodeFormat` union, so your editor can suggest valid names and TypeScript catches misspellings such as `"EAN-13"`:

```tsx
import Barcode, { type BarcodeFormat } from 'react-native-barcode-expo';

const format: BarcodeFormat = 'EAN13';

<Barcode value="5901234123457" format={format} />;
```

Supported names are case-sensitive:

| Family | Formats |
| --- | --- |
| Code 128 / Code 39 | `CODE128`, `CODE128A`, `CODE128B`, `CODE128C`, `CODE39` |
| EAN / UPC | `EAN13`, `EAN8`, `EAN5`, `EAN2`, `UPC`, `UPCE` |
| Interleaved 2 of 5 | `ITF`, `ITF14` |
| MSI | `MSI`, `MSI10`, `MSI11`, `MSI1010`, `MSI1110` |
| Other | `pharmacode`, `codabar` |

When upgrading existing TypeScript code, annotate format variables or state with `BarcodeFormat` instead of `string`. Validate external strings before treating them as a `BarcodeFormat`; a type assertion does not validate API data. JavaScript callers still receive runtime validation through `onError`, and each format still requires suitable barcode data.

## EAN-13

Use `format="EAN13"` (without a hyphen) and numeric data. JsBarcode accepts 12 digits and calculates the final checksum digit, or 13 digits with a valid checksum. `Hello World` is not valid EAN-13 data.

```jsx
<Barcode
  value="5901234123457"
  format="EAN13"
  text="5901234123457"
  onError={(error) => console.warn(error.message)}
/>
```

`value="590123412345"` produces the same bars because its checksum is `7`. The optional `text` label is displayed exactly as supplied; it is not automatically updated with the checksum.

EAN/UPC sections are combined into one barcode with uniform bar heights; labels use the same `text` and `textSize` props as other formats. No `flat` prop is needed or supported by this component.

## Handling invalid values

For example, `EAN13` requires valid numeric data, so `ABC` triggers `onError`. Handle the error and show a message instead of leaving a barcode on screen:

```jsx
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import Barcode from 'react-native-barcode-expo';

export default function BarcodeExample() {
  const [error, setError] = useState(null);

  return (
    <View>
      {error ? (
        <Text>{error}</Text>
      ) : (
        <Barcode
          value="ABC"
          format="EAN13"
          onError={(error) => setError(error.message)}
        />
      )}
    </View>
  );
}
```

If your UI lets users correct the input, clear the error when they submit a new value so the barcode can mount again.

## Upgrading from 2.x to 3.0.0

Version 3 moves `react-native-svg` from a fixed dependency to a peer dependency. Install it explicitly in your app so its JavaScript and native versions match your Expo SDK:

```sh
npm install react-native-barcode-expo@^3.0.0
npx expo install react-native-svg
npx expo install --check
```

For bare React Native, install a `react-native-svg` version compatible with your React Native version, run `npx pod-install` for iOS, and rebuild the native app. If you use an Expo development build, rebuild it after changing the native SVG dependency.

The component import and props remain the same. Version 3 accepts React 18 or 19 and lets the app choose React Native and SVG versions within the declared peer ranges. The example and simulator verification below cover SDK 57; other SDK combinations have not been runtime-tested in this release.


## Expo compatibility and local development

The example targets [Expo SDK 57](https://expo.dev/changelog/sdk-57), with React 19.2.3, React Native 0.86.3, and react-native-svg 15.15.4. React, React Native, and SVG are peer dependencies so the consuming app controls their versions. Always use `npx expo install react-native-svg` to select the native version compatible with your SDK; the peer range alone does not guarantee that every combination is compatible.

Use Node.js 22.13 or newer and Yarn 1.22.19. From the repository root:

```sh
yarn install
yarn lint
yarn typecheck
yarn build
cd example-expo
yarn install
npx expo install --check
yarn test
yarn start
```

The example installs the package from the built `dist` directory (`file:../dist`). The build generates its package manifest so the example consumes the compiled library without copying the root development dependencies. After changing the library, rebuild it and run `yarn install --force` in the example to refresh the local package copy.

### Run on iOS Simulator

Install Xcode and an iOS Simulator runtime, then complete the build and installation steps above. From `example-expo`, run:

```sh
yarn ios
```

Allow Expo CLI to install or update Expo Go to the version recommended for SDK 57. When the app opens, it displays a barcode labeled `Hello`. Tap **Press me** to change both the barcode and its label to `World`. Tap **Show EAN13** to display `5901234123457`, or **Press me** to return to CODE128. Use **Text size 24**, **Text size 32**, and **Default text size** to resize the label and restore its original size. The bars stay unchanged when only the text size changes.

If Expo Go reports **Could not connect to the server** when using localhost, Metro may be listening on IPv6 (`::1`) while Expo Go connects to IPv4 (`127.0.0.1`). Stop Metro with Ctrl+C and restart with:

```sh
NODE_OPTIONS=--dns-result-order=ipv4first npx expo start --ios --localhost --port 8081
```

This command was used for the simulator test below. Stop Metro with Ctrl+C when finished, and quit Simulator separately.

### Verification

Verified locally on September 8, 2026:

| Check | Result |
| --- | --- |
| `yarn lint` | Passed: source, type fixtures, build scripts, and example app/tests |
| `yarn typecheck` | Passed for source and built declarations |
| `yarn build` | Passed |
| `yarn test` in `example-expo` | Passed: 12 tests covering EAN13 binary output and checksum validation, EAN8/UPC rendering, format switching, barcode updates, and label sizing |
| `npx expo install --check` | Dependencies matched SDK 57 |
| `npx expo-doctor@latest` | 21/21 checks passed |
| `npx expo export --platform all` | iOS, Android, and web bundles generated successfully |
| iPhone 17 Simulator, iOS 26.4, Expo Go 57.0.9 | `Hello` rendered; text size changed Default → 24 → 32 → Default while the bars stayed unchanged; EAN13 `5901234123457` displayed and switched back to CODE128 with **Press me**; no runtime error observed |

Android and web were verified by bundling only. Physical devices were not tested.
