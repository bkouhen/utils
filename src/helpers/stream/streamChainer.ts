import { StreamChainerConfiguration } from '../../interfaces/File';
import { WinstonLogger } from '../../interfaces/Logger';

import * as streamHelper from './streamHelper';

import moment from 'moment';
import stream from 'stream';

export class StreamChainer {
  constructor(private config: StreamChainerConfiguration, private logger?: WinstonLogger) {}

  public async run() {
    const initTimer = moment();

    if (!this.config) {
      throw new Error('Chain Configuration is required');
    }

    this.logger?.info(`Starting the following Stream Chain ${this.config.name}`);

    const chainItems = await Promise.all(
      this.config.items.map((item) => {
        if (item.type === 'FILE_READER') return streamHelper.fileReader(item.config);
        if (item.type === 'FILE_WRITER') return streamHelper.fileWriter(item.config);
        if (item.type === 'FILE_DOWNLOADER') return streamHelper.fileDownloader(item.config);
        if (item.type === 'LINE_SPLITTER') return streamHelper.lineSplitStream(item.config);
        if (item.type === 'CSV_PARSER') return streamHelper.csvParser(item.config);
        if (item.type === 'CSV_FORMATTER') return streamHelper.csvFormatter(item.config);
        if (item.type === 'GZIP') return streamHelper.gzipStream(item.config);
        return undefined;
      }),
    );

    if (chainItems.length === 0) throw new Error('Config file has 0 items');
    if (chainItems.length === 1) throw new Error('Cannot chain only 1 item');

    const pipeline = new Promise((resolve, reject) => {
      chainItems
        .reduce(
          //@ts-ignore
          (prev: stream.Readable | null, curr: stream.Writable | stream.Transform | stream.Duplex, index: number) => {
            if (prev === null) {
              if (!(curr instanceof stream.Readable)) {
                return reject(new Error('First Chained Item should be a ReadableStream'));
              }
              curr.on('error', (error: Error) => {
                this.logger?.error(
                  `Error happened on the following item ${this.config.items[index].type} : ${error.message}`,
                );
              });
              return curr;
            }
            if (
              prev instanceof stream.Readable &&
              (curr instanceof stream.Writable || curr instanceof stream.Transform || curr instanceof stream.Duplex)
            ) {
              return prev.pipe(curr).on('error', (e) => {
                return reject(e);
              });
            } else {
              return reject(new Error('There seems to be an error in the items you chained together'));
            }
          },
          null,
        )
        ?.on('finish', () => {
          const processDuration = moment.duration((moment() as any) - (initTimer as any)).humanize();
          this.logger?.info(`StreamChain ${this.config.name} ended with a duration of ${processDuration}`);
          resolve(undefined);
        })
        .on('error', (e) => reject(e));
    });
    return pipeline;
  }
}
