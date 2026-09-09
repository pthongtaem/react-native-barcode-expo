import React from 'react';
import renderer, { act, type ReactTestRenderer } from 'react-test-renderer';
import { StyleSheet, Text } from 'react-native';
import { Path } from 'react-native-svg';
import Barcode from 'react-native-barcode-expo';

it('updates text size without changing the encoded bars and restores the default', async () => {
  let tree!: ReactTestRenderer;
  await act(async () => {
    tree = renderer.create(<Barcode value="Hello" text="Label" textSize={24} />);
  });
  const labelStyle = () => StyleSheet.flatten(tree.root.findByType(Text).props.style);
  const bars = tree.root.findByType(Path).props.d;
  expect(bars).toMatch(/^M/);
  expect(labelStyle().fontSize).toBe(24);

  await act(async () => {
    tree.update(<Barcode value="Hello" text="Label" textSize={32} />);
  });
  expect(labelStyle().fontSize).toBe(32);
  expect(tree.root.findByType(Path).props.d).toBe(bars);

  await act(async () => {
    tree.update(<Barcode value="Hello" text="Label" />);
  });
  expect(labelStyle().fontSize).toBeUndefined();
  expect(tree.root.findByType(Path).props.d).toBe(bars);
  await act(async () => tree.unmount());
});

it('does not add a label when only textSize is provided', async () => {
  let tree!: ReactTestRenderer;
  await act(async () => {
    tree = renderer.create(<Barcode value="Hello" textSize={24} />);
  });
  expect(tree.root.findAllByType(Text)).toHaveLength(0);
  expect(tree.root.findByType(Path).props.d).toMatch(/^M/);
  await act(async () => tree.unmount());
});
