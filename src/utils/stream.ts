import util from 'util';
import stream from 'stream';

/**
 * Allows to promisify the ending of a stream execution
 */
export const finished = util.promisify(stream.finished);
