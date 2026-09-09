"use strict";

import React from 'react';
import { jsx as _jsx } from "react/jsx-runtime";
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
      return /*#__PURE__*/_jsx("h1", {
        children: "Something went wrong."
      });
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
//# sourceMappingURL=ErrorBoundary.js.map