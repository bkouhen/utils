import util from 'util';
import stream from 'stream';
import { fileWriter } from '../helpers/stream/streamHelper';

/**
 * Allows to promisify the ending of a stream execution
 */
export const finished = util.promisify(stream.finished);

/**
 * Function that generates a new Write Stream in an absolute file path and writes successive line arguments into it before closing file
 *
 * @param filePath absolute path of the file
 * @param args all lines to write in the file
 */
export const writeSuccessively = async (filePath: string, ...args: string[]): Promise<void> => {
  await new Promise((resolve) => {
    const writer = fileWriter({ absolutePath: filePath });
    args.forEach((arg) => writer.write(arg));
    writer.close();
    writer.on('finish', resolve);
  });
};
