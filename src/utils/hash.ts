import crypto, { HashOptions } from 'crypto';
import { WinstonLogger } from '../interfaces/Logger';

const ERR_VALUE = -1;

/**
 * Function that allows to hash a string using a predefined algorithm
 *
 * @param algorithm Algorithm to be used during the hash
 * @param data The string that should be hashed
 * @param throwError Whether the function should throw when invalid algorithm is used
 * @param options optional HashOptions
 * @param logger optional WinstonLogger
 * @returns The hex digest of the hashed string or an ERR_VALUE if throwing is disabled
 */
export const hash = (
  algorithm: string,
  data: string,
  throwError: boolean = true,
  options?: HashOptions,
  logger?: WinstonLogger,
): string | number => {
  try {
    return crypto.createHash(algorithm, options).update(data).digest('hex');
  } catch (e) {
    logger?.error(e);
    if (throwError) throw e;
    return ERR_VALUE;
  }
};
