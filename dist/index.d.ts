import React from 'react';
export type BarcodeFormat = 'CODE128' | 'CODE128A' | 'CODE128B' | 'CODE128C' | 'CODE39' | 'EAN13' | 'EAN8' | 'EAN5' | 'EAN2' | 'UPC' | 'UPCE' | 'ITF' | 'ITF14' | 'MSI' | 'MSI10' | 'MSI11' | 'MSI1010' | 'MSI1110' | 'pharmacode' | 'codabar';
type BarcodeProps = {
    value: string;
    format?: BarcodeFormat;
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
