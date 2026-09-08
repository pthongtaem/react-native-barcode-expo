import React from 'react';
import renderer, { act } from 'react-test-renderer';
import Svg, { Path } from 'react-native-svg';
import Barcode from 'react-native-barcode-expo';

// EAN-13 5901234123457: leading digit 5 selects LGGLLG parity.
// Guards + left digits 901234 + center guard + right digits 123457.
const expectedEAN13 = [
  '101', '0001011', '0100111', '0110011', '0010011', '0111101', '0011101',
  '01010', '1100110', '1101100', '1000010', '1011100', '1001110', '1000100', '101',
].join('');

it.each(['5901234123457', '590123412345'])('renders the correct EAN13 bars for %s', async value => {
  let tree;
  await act(async () => {
    tree = renderer.create(<Barcode value={value} format="EAN13" />);
  });
  expect(tree.root.findByType(Svg).props.width).toBe(190);
  const path = tree.root.findByType(Path).props.d;
  // Read the filled modules from the actual SVG rectangles, independently of encoding.
  const modules = Array(95).fill('0');
  const rectangles = [...path.matchAll(/M(\d+),0h(\d+)v100h-\d+z/g)];
  expect(rectangles.length).toBeGreaterThan(0);
  for (const [, x, width] of rectangles) {
    modules.fill('1', Number(x) / 2, (Number(x) + Number(width)) / 2);
  }
  expect(modules.join('')).toBe(expectedEAN13);
  await act(async () => tree.unmount());
});

it.each([
  ['EAN8', '96385074', 134],
  ['UPC', '036000291452', 190],
])('renders multi-part %s encodings', async (format, value, width) => {
  let tree;
  await act(async () => {
    tree = renderer.create(<Barcode value={value} format={format} />);
  });
  expect(tree.root.findByType(Svg).props.width).toBe(width);
  expect(tree.root.findByType(Path).props.d).toMatch(/^M/);
  await act(async () => tree.unmount());
});

it.each([
  ['EAN13', 'Hello World', 'Invalid barcode for selected format.'],
  ['EAN13', '5901234123458', 'Invalid barcode for selected format.'],
  ['EAN-13', '5901234123457', 'Invalid barcode format.'],
])('reports invalid input for %s: %s', async (format, value, message) => {
  const onError = jest.fn();
  let tree;
  await act(async () => {
    tree = renderer.create(<Barcode value={value} format={format} onError={onError} />);
  });
  expect(onError).toHaveBeenCalledWith(new Error(message));
  expect(tree.root.findByType(Path).props.d).toBe('');
  await act(async () => tree.unmount());
});
