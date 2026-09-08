import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import barcodes from 'jsbarcode/src/barcodes';
import Svg, { Path } from 'react-native-svg';

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}

var ErrorBoundary = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(ErrorBoundary, _React$Component);

  function ErrorBoundary(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.state = {
      hasError: false
    };
    return _this;
  }

  ErrorBoundary.getDerivedStateFromError = function getDerivedStateFromError(error) {
    return {
      hasError: true
    };
  };

  var _proto = ErrorBoundary.prototype;

  _proto.componentDidCatch = function componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  };

  _proto.render = function render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return /*#__PURE__*/React.createElement("h1", null, "Something went wrong.");
    }

    return this.props.children;
  };

  return ErrorBoundary;
}(React.Component);

var Barcode = function Barcode(_ref) {
  var value = _ref.value,
      _ref$format = _ref.format,
      format = _ref$format === void 0 ? 'CODE128' : _ref$format,
      _ref$width = _ref.width,
      width = _ref$width === void 0 ? 2 : _ref$width,
      _ref$height = _ref.height,
      height = _ref$height === void 0 ? 100 : _ref$height,
      text = _ref.text,
      textSize = _ref.textSize,
      _ref$textColor = _ref.textColor,
      textColor = _ref$textColor === void 0 ? '#000000' : _ref$textColor,
      _ref$lineColor = _ref.lineColor,
      lineColor = _ref$lineColor === void 0 ? '#000000' : _ref$lineColor,
      _ref$background = _ref.background,
      background = _ref$background === void 0 ? '#ffffff' : _ref$background,
      onError = _ref.onError;

  var _useState = useState([]),
      bars = _useState[0],
      setBars = _useState[1];

  var _useState2 = useState(0),
      barCodeWidth = _useState2[0],
      setBarCodeWidth = _useState2[1];

  var props = {
    value: value,
    format: format,
    width: width,
    height: height,
    text: text,
    textSize: textSize,
    textColor: textColor,
    lineColor: lineColor,
    background: background,
    onError: onError
  };
  useEffect(function () {
    update();
  }, [value]);

  var update = function update() {
    var encoder = barcodes[format];
    var encoded = encode(value, encoder, props);

    if (encoded) {
      setBars(drawSvgBarCode(encoded, props));
      setBarCodeWidth(encoded.data.length * width);
    }
  };

  var drawSvgBarCode = function drawSvgBarCode(encoding, options) {
    var rects = []; // binary data of barcode

    var binary = encoding.data;
    var barWidth = 0;
    var x = 0;
    var yFrom = 0;

    for (var b = 0; b < binary.length; b++) {
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

  var drawRect = function drawRect(x, y, width, height) {
    return "M" + x + "," + y + "h" + width + "v" + height + "h-" + width + "z";
  }; // encode() handles the Encoder call and builds the binary string to be rendered


  var encode = function encode(text, Encoder, options) {
    // If text is not a non-empty string, throw error.
    if (typeof text !== 'string' || text.length === 0) {
      if (options.onError) {
        options.onError(new Error('Barcode value must be a non-empty string'));
        return;
      }

      throw new Error('Barcode value must be a non-empty string');
    }

    var encoder;

    try {
      encoder = new Encoder(text, options);
    } catch (error) {
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


    var encoded = encoder.encode();
    return encoded;
  };

  var backgroundStyle = {
    backgroundColor: background
  };
  return /*#__PURE__*/React.createElement(ErrorBoundary, null, /*#__PURE__*/React.createElement(View, {
    style: [styles.svgContainer, backgroundStyle]
  }, /*#__PURE__*/React.createElement(Svg, {
    height: height,
    width: barCodeWidth,
    fill: lineColor
  }, /*#__PURE__*/React.createElement(Path, {
    d: bars.join(' ')
  })), typeof text !== 'undefined' && /*#__PURE__*/React.createElement(Text, {
    style: {
      color: textColor,
      width: barCodeWidth,
      fontSize: textSize,
      textAlign: 'center'
    }
  }, text)));
};

var styles = StyleSheet.create({
  svgContainer: {
    alignItems: 'center',
    padding: 10
  }
});

export { Barcode as default };
//# sourceMappingURL=index.esm.mjs.map
