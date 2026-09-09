import React from 'react';
import renderer, { act, type ReactTestRenderer } from 'react-test-renderer';
import Svg, { Path } from 'react-native-svg';
import { Text } from 'react-native';
import Barcode from 'react-native-barcode-expo';

it('re-encodes when format changes without changing value', async () => {
  let tree!: ReactTestRenderer;
  await act(async () => { tree = renderer.create(<Barcode value="5901234123457" />); });
  const before = tree.root.findByType(Path).props.d;
  await act(async () => { tree.update(<Barcode value="5901234123457" format="EAN13" />); });
  expect(tree.root.findByType(Svg).props.width).toBe(190);
  expect(tree.root.findByType(Path).props.d).not.toBe(before);
  await act(async () => tree.unmount());
});

it('updates bar geometry when width and height change', async () => {
  let tree!: ReactTestRenderer;
  await act(async () => { tree = renderer.create(<Barcode value="5901234123457" format="EAN13" />); });
  await act(async () => { tree.update(<Barcode value="5901234123457" format="EAN13" width={3} height={60} />); });
  expect(tree.root.findByType(Svg).props.width).toBe(285);
  expect(tree.root.findByType(Svg).props.height).toBe(60);
  expect(tree.root.findByType(Path).props.d).toMatch(/^M0,0h3v60h-3z/);
  await act(async () => tree.unmount());
});

it('clears stale bars on invalid input and recovers on valid input', async () => {
  const onError = jest.fn();
  let tree!: ReactTestRenderer;
  await act(async () => { tree = renderer.create(<Barcode value="5901234123457" format="EAN13" onError={onError} />); });
  await act(async () => { tree.update(<Barcode value="ABC" format="EAN13" onError={onError} />); });
  expect(onError).toHaveBeenCalledWith(new Error('Invalid barcode for selected format.'));
  expect(tree.root.findByType(Path).props.d).toBe('');
  expect(tree.root.findByType(Svg).props.width).toBe(0);
  await act(async () => { tree.update(<Barcode value="5901234123457" format="EAN13" onError={onError} />); });
  expect(tree.root.findByType(Svg).props.width).toBe(190);
  expect(tree.root.findByType(Path).props.d).toMatch(/^M/);
  await act(async () => tree.unmount());
});

it('reports an invalid format change with unchanged value', async () => {
  const onError = jest.fn();
  let tree!: ReactTestRenderer;
  await act(async () => { tree = renderer.create(<Barcode value="Hello" onError={onError} />); });
  await act(async () => {
    // @ts-expect-error Exercise invalid format input from JavaScript callers.
    tree.update(<Barcode value="Hello" format="toString" onError={onError} />);
  });
  expect(onError).toHaveBeenCalledWith(new Error('Invalid barcode format.'));
  expect(tree.root.findByType(Path).props.d).toBe('');
  await act(async () => tree.unmount());
});

it('throws validation errors when no error handler is provided', async () => {
  const error = jest.spyOn(console, 'error').mockImplementation(() => {});
  try {
    const renderInvalidBarcode = async () => {
      await act(async () => { renderer.create(<Barcode value="" />); });
    };
    await expect(renderInvalidBarcode())
      .rejects.toThrow('Barcode value must be a non-empty string');
  } finally {
    error.mockRestore();
  }
});

it('does not repeat an error when an inline handler updates parent state', async () => {
  function Parent() {
    const [count, setCount] = React.useState(0);
    return <>
      <Text>{count}</Text>
      <Barcode value="" onError={() => {
        // Bound the regression so broken code fails instead of hanging the test.
        if (count < 3) setCount(count + 1);
      }} />
    </>;
  }
  let tree!: ReactTestRenderer;
  await act(async () => { tree = renderer.create(<Parent />); });
  expect(tree.root.findByType(Text).props.children).toBe(1);
  await act(async () => tree.unmount());
});
