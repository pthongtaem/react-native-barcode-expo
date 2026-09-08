import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { Button, Text } from 'react-native';
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
    tree.root.findByType(Button).props.onPress();
  });
  expect(tree.root.findByType(Path).props.d).not.toBe(initialPath);
  expect(tree.root.findAllByType(Text).some(node => node.props.children === 'World')).toBe(true);
  await act(async () => tree.unmount());
});
