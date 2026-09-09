import React, { useEffect, useMemo, useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import ErrorBoundary from './ErrorBoundary';
import { createBarcode } from './encoding';
import type { BarcodeProps } from './types';

export type { BarcodeFormat } from './types';

const Barcode = ({
  value,
  format = 'CODE128',
  width = 2,
  height = 100,
  text,
  textSize,
  textColor = '#000000',
  lineColor = '#000000',
  background = '#ffffff',
  onError,
}: BarcodeProps) => {
  const { geometry, error } = useMemo(
    () => createBarcode(value, format, width, height),
    [value, format, width, height],
  );

  const onErrorRef = useRef(onError);
  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  // Report each validation result after commit without repeating it when
  // an inline callback changes identity during a parent state update.
  useEffect(() => {
    if (error) onErrorRef.current?.(error);
  }, [error]);

  if (error && !onError) throw error;

  return (
    <ErrorBoundary>
      <View style={[styles.svgContainer, { backgroundColor: background }]}>
        <Svg height={height} width={geometry.width} fill={lineColor}>
          <Path d={geometry.path} />
        </Svg>
        {typeof text !== 'undefined' && (
          <Text
            style={{
              color: textColor,
              width: geometry.width,
              fontSize: textSize,
              textAlign: 'center',
            }}
          >
            {text}
          </Text>
        )}
      </View>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  svgContainer: {
    alignItems: 'center',
    padding: 10,
  },
});

export default Barcode;
