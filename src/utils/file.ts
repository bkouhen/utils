import fs from 'fs-extra';
import { execSync } from 'child_process';
import { WinstonLogger } from '../interfaces/Logger';

const ERR_VALUE = -1;

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
  const fileExists = fs.pathExistsSync(filePath);
  if (!fileExists) {
    if (throwError) throw new Error(`countLines -- no file found at ${filePath}`);

    logger?.warn(`countLines -- no file found at ${filePath}`);
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
