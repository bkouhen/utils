import fs from 'fs-extra';
import stream, { TransformCallback } from 'stream';
import { execSync } from 'child_process';
import { pExec } from './process';
import { WinstonLogger } from '../interfaces/Logger';
import { lineSplitStream } from '../helpers/stream/streamHelper';

const ERR_VALUE = -1;

/**
 * Function that checks if a file does exist at the mentioned path
 *
 * @param filePath Absolute path to the file which should be processed
 * @param throwError Whether the function should throw if an error happened
 * @param logger Optional winston logger to be provided to the function
 * @returns true or false
 */
export const fileExists = (filePath: string, throwError: boolean, logger?: WinstonLogger): boolean => {
  const fileExists = fs.pathExistsSync(filePath);
  if (!fileExists) {
    if (throwError) {
      throw new Error(`countLines -- no file found at ${filePath}`);
    }

    logger?.warn(`countLines -- no file found at ${filePath}`);
    return false;
  }
  return fileExists;
};

/**
 * Function that synchronously counts the number of lines of a file
 *
 * @param filePath Absolute path to the file which should be processed
 * @param throwError Whether the function should throw if an error happened
 * @param logger Optional winston logger to be provided to the function
 * @returns an integer that should be positive. If result is -1, it means that either the file has not been found or
 * there was an error with the wc execution (maybe not in a UNIX environment)
 */
export const countLinesSync = (filePath: string, throwError: boolean = true, logger?: WinstonLogger): number => {
  if (!fileExists(filePath, throwError, logger)) {
    logger?.error(`No file found at ${filePath} - returning -1 as a value`);
    return ERR_VALUE;
  }

  try {
    return parseInt(execSync(`wc -l ${filePath}`).toString());
  } catch (e) {
    logger?.error(e);
    if (throwError) throw e;
    return ERR_VALUE;
  }
};

/**
 * Function that asynchronously counts the number of lines of a file
 *
 * @param filePath Absolute path to the file which should be processed
 * @param throwError Whether the function should throw if an error happened
 * @param logger Optional winston logger to be provided to the function
 * @returns an integer that should be positive. If result is -1, it means that either the file has not been found or
 * there was an error with the wc execution (maybe not in a UNIX environment)
 */
export const countLines = async (
  filePath: string,
  throwError: boolean = true,
  logger?: WinstonLogger,
): Promise<number> => {
  if (!fileExists(filePath, throwError, logger)) {
    logger?.error(`No file found at ${filePath} - returning -1 as a value`);
    return ERR_VALUE;
  }

  try {
    const numberOfLines = (await pExec(`wc -l ${filePath}`)).stdout;
    return parseInt(numberOfLines);
  } catch (e) {
    logger?.error(e);
    if (throwError) throw e;
    return ERR_VALUE;
  }
};

/**
 * Function that asynchronously counts the number of lines from a readable stream as an input
 *
 * @param readableStream Input readable stream
 * @returns the number of lines of the file read through the input stream
 */
export const countLinesFromStream = async (readableStream: stream.Readable): Promise<number> => {
  let lines = 0;
  return new Promise((resolve) => {
    const lineSplitter = lineSplitStream();
    const countStream = new stream.Transform({
      transform: (chunk: string, encoding: BufferEncoding, next: TransformCallback) => {
        lines++;
        next(null, chunk);
      },
    });
    const noop = fs.createWriteStream('/dev/null');
    noop.on('finish', () => resolve(lines));
    readableStream.pipe(lineSplitter).pipe(countStream).pipe(noop);
  });
};
