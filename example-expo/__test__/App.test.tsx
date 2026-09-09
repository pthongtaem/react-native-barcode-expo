import React from 'react';
import renderer, { act, type ReactTestRenderer } from 'react-test-renderer';
import { StyleSheet, Text } from 'react-native';
import Barcode from 'react-native-barcode-expo';
import { Path } from 'react-native-svg';

import App from '../App';

it('renders barcode bars and updates them when the button is pressed', async () => {
  let tree!: ReactTestRenderer;
  await act(async () => {
    tree = renderer.create(<App />);
  });
  const initialPath = tree.root.findByType(Path).props.d;
  expect(initialPath).toMatch(/^M/);
  expect(tree.root.findAllByType(Text).some(node => node.props.children === 'Hello')).toBe(true);

  await act(async () => {
    tree.root.findByProps({ title: 'Press me' }).props.onPress();
  });
  expect(tree.root.findByType(Path).props.d).not.toBe(initialPath);
  expect(tree.root.findAllByType(Text).some(node => node.props.children === 'World')).toBe(true);
  await act(async () => tree.unmount());
});


it('lets users change and reset the barcode label size', async () => {
  let tree!: ReactTestRenderer;
  await act(async () => {
    tree = renderer.create(<App />);
  });
  const fontSize = () => StyleSheet.flatten(
    tree.root.findByType(Barcode).findByType(Text).props.style,
  ).fontSize;
  const bars = tree.root.findByType(Path).props.d;
  expect(fontSize()).toBeUndefined();
  for (const [title, expected] of [
    ['Text size 24', 24],
    ['Text size 32', 32],
    ['Default text size', undefined],
  ]) {
    await act(async () => tree.root.findByProps({ title }).props.onPress());
    expect(fontSize()).toBe(expected);
    expect(tree.root.findByType(Path).props.d).toBe(bars);
  }
  await act(async () => tree.unmount());
});

it('shows the EAN13 example and can return to CODE128', async () => {
  let tree!: ReactTestRenderer;
  await act(async () => { tree = renderer.create(<App />); });
  await act(async () => tree.root.findByProps({ title: 'Show EAN13' }).props.onPress());
  expect(tree.root.findByType(Barcode).props).toMatchObject({
    format: 'EAN13', value: '5901234123457', text: '5901234123457',
  });
  expect(tree.root.findByType(Path).props.d).toMatch(/^M/);
  await act(async () => tree.root.findByProps({ title: 'Press me' }).props.onPress());
  expect(tree.root.findByType(Barcode).props).toMatchObject({ format: 'CODE128', value: 'World' });
  await act(async () => tree.unmount());
});
