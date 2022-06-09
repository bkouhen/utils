import { EnvFormatter, EnvTransformer, EnvParser } from '../../interfaces/Env';

/**
 * Function that parses the environment variable and chains different functions before returning a value
 *
 * @param functions list of functions that should transform step by step the parsed environment variable
 * @returns a value as defined by the EnvTransformer chain of functions
 */
export const env: EnvParser =
  (...functions: Function[]) =>
  (varName: string) => {
    try {
      const pEnv = process.env[varName];
      if (!functions.length) return pEnv;
      if (functions.length === 1) return functions[0](pEnv);

      return functions.reduce((prev: Function, curr: Function) => {
        return (...args: any[]) => {
          return prev(curr(...args));
        };
      })(pEnv);
    } catch (e) {
      throw new Error(`Error while parsing variable ${varName}: ${e.message}`);
    }
  };

/**
 * Function that transforms a value into a string
 *
 * @param val parsed environment variable as a string
 * @returns a string value
 */
export const str: EnvTransformer<string> = (val?: string) => (val ? String(val) : undefined);

/**
 * Function that transforms a value into an integer
 *
 * @param val parsed environment variable as a string
 * @returns an integer value
 */
export const int: EnvTransformer<number> = (val?: string) => (val && !isNaN(parseInt(val)) ? parseInt(val) : undefined);

/**
 * Function that transforms a value into a float
 *
 * @param val parsed environment variable as a string
 * @returns a float value
 */
export const float: EnvTransformer<number> = (val?: string) =>
  val && !isNaN(parseFloat(val)) ? parseFloat(val) : undefined;

/**
 * Function that transforms a value into a boolean
 *
 * @param val parsed environment variable as a string
 * @returns a boolean value
 */
export const bool: EnvTransformer<boolean> = (val?: string) => {
  if (val === 'true') return true;
  if (val === 'false') return false;
  return;
};

/**
 * Function that transforms a value into a json object
 *
 * @param val parsed environment variable as a stringified json
 * @returns an object value (generic Type)
 */
export const json: EnvTransformer<unknown> = <T>(val?: string): T | undefined => {
  if (!val) return;

  try {
    return JSON.parse(val) as T;
  } catch {}
};

/**
 * Function that transforms an  value into a array
 *
 * @param delimiter character that delimits the array elements
 * @param fn function that transforms a string into another type
 * @returns an array value (generic Type)
 */

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

/**
 * Function that transforms an encoded base64 value into a decoded one
 *
 * @param escape whether the '\n' character should be escaped or not
 * @returns a string value
 */
export const base64 =
  (escape: boolean = false): EnvTransformer<string> =>
  (val?: string) => {
    if (!val) return;

    if (escape) return Buffer.from(val, 'base64').toString().replace(/\n/g, '\\n');

    return Buffer.from(val, 'base64').toString();
  };

/**
 * Function that makes sure a default value is always available
 *
 * @param defaultVal the default value that should be returned if the parsed env var is undefined or null
 * @returns a value (generic Type)
 */
export const defaultValue =
  <T>(defaultVal: T): EnvFormatter<T> =>
  (val?: T): T =>
    val ?? defaultVal;

/**
 * Function that makes sure the parsed environment variable is available
 *
 * @param val parsed environment variable as a string
 * @returns a the value as is (generic Type)
 */
export const required: EnvFormatter<unknown> = <T>(val?: T): T => {
  if (val === undefined) throw new Error('Unable to parse the value, check its type');

  return val;
};
