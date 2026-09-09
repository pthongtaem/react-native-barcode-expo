"use strict";

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import barcodes from 'jsbarcode/src/barcodes';
import Svg, { Path } from 'react-native-svg';
import ErrorBoundary from "./ErrorBoundary.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
  onError
}) => {
  const [bars, setBars] = useState([]);
  const [barCodeWidth, setBarCodeWidth] = useState(0);
  const barcodeProps = {
    value,
    format,
    width,
    height,
    text,
    textSize,
    textColor,
    lineColor,
    background,
    onError
  };
  useEffect(() => {
    update();
  }, [value]);
  const update = () => {
    const encoder = barcodes[format];
    const encoded = encode(value, encoder, barcodeProps);
    if (encoded) {
      setBars(drawSvgBarCode(encoded, barcodeProps));
      setBarCodeWidth(encoded.data.length * width);
    }
  };
  const drawSvgBarCode = (encoding, options) => {
    const rects = [];
    // binary data of barcode
    const binary = encoding.data;
    let barWidth = 0;
    let x = 0;
    const yFrom = 0;
    for (let b = 0; b < binary.length; b++) {
      x = b * options.width;
      if (binary[b] === '1') {
        barWidth++;
      } else if (barWidth > 0) {
        rects[rects.length] = drawRect(x - options.width * barWidth, yFrom, options.width * barWidth, options.height);
        barWidth = 0;
      }
    }

    // Last draw is needed since the barcode ends with 1
    if (barWidth > 0) {
      rects[rects.length] = drawRect(x - options.width * (barWidth - 1), yFrom, options.width * barWidth, options.height);
    }
    return rects;
  };
  const drawRect = (x, y, width, height) => {
    return `M${x},${y}h${width}v${height}h-${width}z`;
  };

  // encode() handles the Encoder call and builds the binary string to be rendered
  const encode = (text, Encoder, options) => {
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
    } catch {
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

    // EAN/UPC encoders return ordered sections (guards and digit groups).
    // Our renderer uses uniform bar heights and a separate React Native label.
    const encoded = encoder.encode();
    const sections = Array.isArray(encoded) ? encoded : [encoded];
    return {
      data: sections.map(section => section.data).join('')
    };
  };
  const backgroundStyle = {
    backgroundColor: background
  };
  return /*#__PURE__*/_jsx(ErrorBoundary, {
    children: /*#__PURE__*/_jsxs(View, {
      style: [styles.svgContainer, backgroundStyle],
      children: [/*#__PURE__*/_jsx(Svg, {
        height: height,
        width: barCodeWidth,
        fill: lineColor,
        children: /*#__PURE__*/_jsx(Path, {
          d: bars.join(' ')
        })
      }), typeof text !== 'undefined' && /*#__PURE__*/_jsx(Text, {
        style: {
          color: textColor,
          width: barCodeWidth,
          fontSize: textSize,
          textAlign: 'center'
        },
        children: text
      })]
    })
  });
};
const styles = StyleSheet.create({
  svgContainer: {
    alignItems: 'center',
    padding: 10
  }
});
export default Barcode;
//# sourceMappingURL=index.js.map