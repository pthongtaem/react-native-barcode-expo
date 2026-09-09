import React from 'react';
import renderer, { act, type ReactTestRenderer } from 'react-test-renderer';
import { Text } from 'react-native';
import Barcode from 'react-native-barcode-expo';

jest.mock('react-native-svg', () => {
  const actual = jest.requireActual('react-native-svg');
  return { ...actual, Path: () => { throw new Error('SVG rendering failed'); } };
});

it('shows a native text fallback when SVG rendering fails', async () => {
  const error = jest.spyOn(console, 'error').mockImplementation(() => {});
  const log = jest.spyOn(console, 'log').mockImplementation(() => {});
  let tree!: ReactTestRenderer;
  try {
    await act(async () => { tree = renderer.create(<Barcode value="Hello" />); });
    expect(tree.root.findByType(Text).props.children).toBe('Something went wrong.');
    expect(tree.root.findAllByType('h1')).toHaveLength(0);
  } finally {
    if (tree) await act(async () => tree.unmount());
    error.mockRestore();
    log.mockRestore();
  }
});
