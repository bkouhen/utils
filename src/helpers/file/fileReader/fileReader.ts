import split from 'split';
import stream from 'stream';
import { WinstonLogger } from '../../../interfaces/Logger';

export class FileReader extends stream.Readable {
  constructor(logger: WinstonLogger) {
    super();
  }
}
