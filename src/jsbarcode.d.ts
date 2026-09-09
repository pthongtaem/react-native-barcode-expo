// JsBarcode does not ship declarations for this internal encoder registry.
declare module 'jsbarcode/src/barcodes' {
  type Encoding = { data: string };
  type Encoder = new (
    value: string,
    options: { width: number; height: number },
  ) => { valid(): boolean; encode(): Encoding | Encoding[] };
  const barcodes: Record<string, Encoder | undefined>;
  export default barcodes;
}
