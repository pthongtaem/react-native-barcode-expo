import React from 'react';
import Barcode, { type BarcodeFormat } from '../src';
import BuiltBarcode, { type BarcodeFormat as BuiltBarcodeFormat } from '../dist';

// Every prop except value has a default or is optional in the public API.
const minimal = <Barcode value="Hello World" />;
const customized = <Barcode value="123456" format="CODE128" width={3} height={80} />;
void minimal;
void customized;

const built = <BuiltBarcode value="Hello World" />;
void built;

const sized = <Barcode value="Hello" text="Label" textSize={24} />;
const builtSized = <BuiltBarcode value="Hello" text="Label" textSize={24} />;
// @ts-expect-error textSize takes a number, not a CSS string.
const invalidSize = <Barcode value="Hello" textSize="24px" />;
void sized;
void builtSized;
void invalidSize;

// Format spelling is part of the public API, for source and packaged types.
// @ts-expect-error EAN13 does not contain a hyphen.
const invalidFormat = <Barcode value="5901234123457" format="EAN-13" />;
// @ts-expect-error Unknown formats are not accepted by the packaged component.
const invalidBuiltFormat = <BuiltBarcode value="Hello" format="CODE129" />;
// @ts-expect-error Encoder names are case-sensitive.
const wrongCaseFormat = <Barcode value="123" format="PHARMACODE" />;
void invalidFormat;
void invalidBuiltFormat;
void wrongCaseFormat;


const supportedFormats: BarcodeFormat[] = [
  'CODE128', 'CODE128A', 'CODE128B', 'CODE128C', 'CODE39',
  'EAN13', 'EAN8', 'EAN5', 'EAN2', 'UPC', 'UPCE', 'ITF', 'ITF14',
  'MSI', 'MSI10', 'MSI11', 'MSI1010', 'MSI1110', 'pharmacode', 'codabar',
];
const builtFormats: BuiltBarcodeFormat[] = supportedFormats;
const typedExamples = builtFormats.map(format => <BuiltBarcode key={format} value="123" format={format} />);
// @ts-expect-error The exported type rejects unrestricted strings.
const unknownFormat: BarcodeFormat = 'unknown';
void typedExamples;
void unknownFormat;
