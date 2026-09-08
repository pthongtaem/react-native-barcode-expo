import React from 'react';
type BarcodeProps = {
    value: string;
    format?: string;
    width?: number;
    height?: number;
    text?: string;
    textSize?: number;
    textColor?: string;
    lineColor?: string;
    background?: string;
    onError?: (error: Error) => void;
};
declare const Barcode: ({ value, format, width, height, text, textSize, textColor, lineColor, background, onError, }: BarcodeProps) => React.JSX.Element;
export default Barcode;
