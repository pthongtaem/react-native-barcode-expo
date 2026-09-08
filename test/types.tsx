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
