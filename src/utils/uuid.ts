import { v1 as uuidv1, V1Options, validate as uuidValidate, version as uuidVersion } from 'uuid';
import { hash } from './hash';
import { WinstonLogger } from '../interfaces/Logger';

const ERR_VALUE = -1;

export const generateUUID = (
  identifier: string,
  timestamp: number,
  throwError: boolean = true,
  logger?: WinstonLogger,
): string | number => {
  if (timestamp.toString().length !== 10 && timestamp.toString().length !== 13) {
    if (throwError) {
      throw new Error(`generateUUID - Timestamp provided neither on seconds nor miliseconds format: ${timestamp}`);
    }
    logger?.error(`generateUUID - Timestamp provided neither on seconds nor miliseconds format: ${timestamp}`);
    return ERR_VALUE;
  }

  if (timestamp.toString().length === 10) {
    logger?.warn(
      `generateUUID - Timestamp provided in seconds: ${timestamp} - Converted to miliseconds: ${timestamp * 1000}`,
    );
    timestamp = timestamp * 1000;
  }

  const uuidNode = Buffer.from(hash('SHA256', identifier, true, undefined, logger) as string);
  const arrByte: number[] = Array.from(Uint8Array.from(uuidNode).slice(0, 6));

  const v1options: V1Options = {
    node: arrByte,
    clockseq: 0,
    msecs: timestamp,
    nsecs: 0,
  };

  return uuidv1(v1options);
};

export const validateUUID = (uuid: string): boolean => uuidValidate(uuid);
export const getUUIDVersion = (uuid: string): number => uuidVersion(uuid);
