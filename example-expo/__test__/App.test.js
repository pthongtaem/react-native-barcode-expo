import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { StyleSheet, Text } from 'react-native';
import Barcode from 'react-native-barcode-expo';
import { Path } from 'react-native-svg';

import App from '../App';

it('renders barcode bars and updates them when the button is pressed', async () => {
  let tree;
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
  let tree;
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
