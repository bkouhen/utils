export const str: (val?: string) => string | undefined = String;

export const int = (val?: string): number | undefined => (val && !isNaN(parseInt(val)) ? parseInt(val) : undefined);

export const float = (val?: string): number | undefined =>
  val && !isNaN(parseFloat(val)) ? parseFloat(val) : undefined;

export const bool = (val?: string): boolean | undefined => {
  if (val === 'true') return true;
  if (val === 'false') return false;
  return;
};

export const json = <T>(val?: string): T | undefined => {
  if (!val) return;

  try {
    return JSON.parse(val) as T;
  } catch {}
};

export const array = <T>(delimiter: string, fn: (val?: string) => T | undefined) => {
  return (val?: string): T[] | undefined => {
    if (!delimiter) return;
    const baseElements = val?.split(delimiter) ?? [];
    if (!baseElements.length) return;

    const mappedElements = baseElements.map(fn).filter((el) => el !== undefined) as T[];

    if (!mappedElements.length) return;
    return mappedElements;
  };
};

export const base64 =
  (escape: boolean = false) =>
  (val?: string): string | undefined => {
    if (!val) return;

    if (escape) return Buffer.from(val, 'base64').toString().replace(/\n/g, '\\n');

    return Buffer.from(val, 'base64').toString();
  };

export const defaultValue =
  <T>(defaultVal: T) =>
  (val?: T): T =>
    val ?? defaultVal;

export const required = <T>(val?: T): T => {
  if (val === undefined) throw new Error('Unable to parse the value, check its type');

  return val;
};
