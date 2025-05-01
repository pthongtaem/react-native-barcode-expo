import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import barcodes from 'jsbarcode/src/barcodes';
import Svg, { Path } from 'react-native-svg';

import ErrorBoundary from './ErrorBoundary';

type props = {
  value: string;
  format?: string;
  width?: number;
  height?: number;
  text?: string;
  textSize?: number;
  textColor?: string;
  lineColor?: string;
  background?: string;
  onError?: (error: Error) => any;
};

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
}: props) => {
  const [bars, setBars] = useState([]);
  const [barCodeWidth, setBarCodeWidth] = useState(0);

  const props = {
    value,
    format,
    width,
    height,
    text,
    textSize,
    textColor,
    lineColor,
    background,
    onError,
  };

  useEffect(() => {
    update();
  }, [value]);

  const update = () => {
    const encoder = barcodes[format];
    const encoded = encode(value, encoder, props);

    if (encoded) {
      setBars(drawSvgBarCode(encoded, props));
      setBarCodeWidth(encoded.data.length * width);
    }
  };

  const drawSvgBarCode = (encoding, options: props) => {
    const rects = [];
    // binary data of barcode
    const binary = encoding.data;

    let barWidth = 0;
    let x = 0;
    let yFrom = 0;

    for (let b = 0; b < binary.length; b++) {
      x = b * options.width;
      if (binary[b] === '1') {
        barWidth++;
      } else if (barWidth > 0) {
        rects[rects.length] = drawRect(
          x - options.width * barWidth,
          yFrom,
          options.width * barWidth,
          options.height,
        );
        barWidth = 0;
      }
    }

    // Last draw is needed since the barcode ends with 1
    if (barWidth > 0) {
      rects[rects.length] = drawRect(
        x - options.width * (barWidth - 1),
        yFrom,
        options.width * barWidth,
        options.height,
      );
    }

    return rects;
  };

  const drawRect = (x, y, width, height) => {
    return `M${x},${y}h${width}v${height}h-${width}z`;
  };

  // encode() handles the Encoder call and builds the binary string to be rendered
  const encode = (text: string, Encoder: any, options: props) => {
    // If text is not a non-empty string, throw error.
    if (typeof text !== 'string' || text.length === 0) {
      if (options.onError) {
        options.onError(new Error('Barcode value must be a non-empty string'));
        return;
      }
      throw new Error('Barcode value must be a non-empty string');
    }

    let encoder;

    try {
      encoder = new Encoder(text, options);
    } catch (error) {
      // If the encoder could not be instantiated, throw error.
      if (options.onError) {
        options.onError(new Error('Invalid barcode format.'));
        return;
      }
      throw new Error('Invalid barcode format.');
    }

    // If the input is not valid for the encoder, throw error.
    if (!encoder.valid()) {
      if (options.onError) {
        options.onError(new Error('Invalid barcode for selected format.'));
        return;
      }
      throw new Error('Invalid barcode for selected format.');
    }

    // Make a request for the binary data (and other infromation) that should be rendered
    // encoded stucture is {
    //  text: 'xxxxx',
    //  data: '110100100001....'
    // }
    const encoded = encoder.encode();
    return encoded;
  };

  const backgroundStyle = {
    backgroundColor: background,
  };
  return (
    <ErrorBoundary>
      <View style={[styles.svgContainer, backgroundStyle]}>
        <Svg height={height} width={barCodeWidth} fill={lineColor}>
          <Path d={bars.join(' ')} />
        </Svg>
        {typeof text !== 'undefined' && (
          <Text
            style={{
              color: textColor,
              width: barCodeWidth,
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
