import barcodes from 'jsbarcode/src/barcodes';
import type { BarcodeFormat } from './types';

type BarcodeGeometry = { path: string; width: number };
type BarcodeResult =
  | { geometry: BarcodeGeometry; error: null }
  | { geometry: BarcodeGeometry; error: Error };

function encode(value: string, format: BarcodeFormat, width: number, height: number): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error('Barcode value must be a non-empty string');
  }

  const Encoder = Object.prototype.hasOwnProperty.call(barcodes, format) ? barcodes[format] : undefined;
  if (!Encoder) throw new Error('Invalid barcode format.');
  let encoder;
  try {
    encoder = new Encoder(value, { width, height });
  } catch {
    throw new Error('Invalid barcode format.');
  }
  if (!encoder.valid()) throw new Error('Invalid barcode for selected format.');

  // EAN/UPC encoders return ordered guard and digit sections.
  const encoded = encoder.encode();
  const sections = Array.isArray(encoded) ? encoded : [encoded];
  return sections.map(section => section.data).join('');
}

function drawPath(binary: string, width: number, height: number): string {
  const paths: string[] = [];
  let start = 0;
  while (start < binary.length) {
    if (binary[start] !== '1') {
      start++;
      continue;
    }
    let end = start + 1;
    while (binary[end] === '1') end++;
    const barWidth = (end - start) * width;
    paths.push(`M${start * width},0h${barWidth}v${height}h-${barWidth}z`);
    start = end;
  }
  return paths.join(' ');
}

export function createBarcode(value: string, format: BarcodeFormat, width: number, height: number): BarcodeResult {
  try {
    const binary = encode(value, format, width, height);
    return { geometry: { path: drawPath(binary, width, height), width: binary.length * width }, error: null };
  } catch (cause) {
    return {
      geometry: { path: '', width: 0 },
      error: cause instanceof Error ? cause : new Error(String(cause)),
    };
  }
}
