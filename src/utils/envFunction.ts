import { EnvFormatter, EnvTransformer } from '../interfaces/Env';

export const str: EnvTransformer<string> = (val?: string) => (val ? String(val) : undefined);

export const int: EnvTransformer<number> = (val?: string) => (val && !isNaN(parseInt(val)) ? parseInt(val) : undefined);

export const float: EnvTransformer<number> = (val?: string) =>
  val && !isNaN(parseFloat(val)) ? parseFloat(val) : undefined;

export const bool: EnvTransformer<boolean> = (val?: string) => {
  if (val === 'true') return true;
  if (val === 'false') return false;
  return;
};

export const json: EnvTransformer<unknown> = <T>(val?: string): T | undefined => {
  if (!val) return;

  try {
    return JSON.parse(val) as T;
  } catch {}
};

export const array =
  <T>(delimiter: string, fn: EnvTransformer<T>): EnvTransformer<T[]> =>
  (val?: string) => {
    if (!delimiter) return;
    const baseElements = val?.split?.(delimiter) ?? [];
    if (!baseElements.length) return;

    const mappedElements = baseElements.map(fn).filter((el) => el !== undefined) as T[];

    if (!mappedElements.length) return;
    return mappedElements;
  };

export const base64 =
  (escape: boolean = false): EnvTransformer<string> =>
  (val?: string) => {
    if (!val) return;

    if (escape) return Buffer.from(val, 'base64').toString().replace(/\n/g, '\\n');

    return Buffer.from(val, 'base64').toString();
  };

export const defaultValue =
  <T>(defaultVal: T): EnvFormatter<T> =>
  (val?: T): T =>
    val ?? defaultVal;

export const required: EnvFormatter<unknown> = <T>(val?: T): T => {
  if (val === undefined) throw new Error('Unable to parse the value, check its type');

  return val;
};
