import React from 'react';
import Barcode from '../src';
import BuiltBarcode from '../dist';

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
