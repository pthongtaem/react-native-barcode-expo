import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import barcodes from 'jsbarcode/src/barcodes';
import Svg, { Path } from 'react-native-svg';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true
    };
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return /*#__PURE__*/React.createElement("h1", null, "Something went wrong.");
    }

    return this.props.children;
  }

}

const Barcode = ({
  value,
  format: _format = 'CODE128',
  width: _width = 2,
  height: _height = 100,
  text,
  textSize,
  textColor: _textColor = '#000000',
  lineColor: _lineColor = '#000000',
  background: _background = '#ffffff',
  onError
}) => {
  const [bars, setBars] = useState([]);
  const [barCodeWidth, setBarCodeWidth] = useState(0);
  const barcodeProps = {
    value,
    format: _format,
    width: _width,
    height: _height,
    text,
    textSize,
    textColor: _textColor,
    lineColor: _lineColor,
    background: _background,
    onError
  };
  useEffect(() => {
    update();
  }, [value]);

  const update = () => {
    const encoder = barcodes[_format];
    const encoded = encode(value, encoder, barcodeProps);

    if (encoded) {
      setBars(drawSvgBarCode(encoded, barcodeProps));
      setBarCodeWidth(encoded.data.length * _width);
    }
  };

  const drawSvgBarCode = (encoding, options) => {
    const rects = []; // binary data of barcode

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
    } // Last draw is needed since the barcode ends with 1


    if (barWidth > 0) {
      rects[rects.length] = drawRect(x - options.width * (barWidth - 1), yFrom, options.width * barWidth, options.height);
    }

    return rects;
  };

  const drawRect = (x, y, width, height) => {
    return `M${x},${y}h${width}v${height}h-${width}z`;
  }; // encode() handles the Encoder call and builds the binary string to be rendered


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
    } catch (_unused) {
      // If the encoder could not be instantiated, throw error.
      if (options.onError) {
        options.onError(new Error('Invalid barcode format.'));
        return;
      }

      throw new Error('Invalid barcode format.');
    } // If the input is not valid for the encoder, throw error.


    if (!encoder.valid()) {
      if (options.onError) {
        options.onError(new Error('Invalid barcode for selected format.'));
        return;
      }

      throw new Error('Invalid barcode for selected format.');
    } // Make a request for the binary data (and other infromation) that should be rendered
    // encoded stucture is {
    //  text: 'xxxxx',
    //  data: '110100100001....'
    // }


    const encoded = encoder.encode();
    return encoded;
  };

  const backgroundStyle = {
    backgroundColor: _background
  };
  return /*#__PURE__*/React.createElement(ErrorBoundary, null, /*#__PURE__*/React.createElement(View, {
    style: [styles.svgContainer, backgroundStyle]
  }, /*#__PURE__*/React.createElement(Svg, {
    height: _height,
    width: barCodeWidth,
    fill: _lineColor
  }, /*#__PURE__*/React.createElement(Path, {
    d: bars.join(' ')
  })), typeof text !== 'undefined' && /*#__PURE__*/React.createElement(Text, {
    style: {
      color: _textColor,
      width: barCodeWidth,
      fontSize: textSize,
      textAlign: 'center'
    }
  }, text)));
};

const styles = StyleSheet.create({
  svgContainer: {
    alignItems: 'center',
    padding: 10
  }
});

export { Barcode as default };
//# sourceMappingURL=index.modern.js.map
