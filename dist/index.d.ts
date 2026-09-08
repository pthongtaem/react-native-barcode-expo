import React from 'react';
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
declare const Barcode: ({ value, format, width, height, text, textSize, textColor, lineColor, background, onError, }: props) => React.JSX.Element;
export default Barcode;
