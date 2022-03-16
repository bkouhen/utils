// Helpers
export * from './helpers/logger/Logger';
export * from './helpers/file/fileReader/fileReader';

// Interfaces
export * from './interfaces/Logger';

import { fileDownloader, lineSplitStream } from './helpers/file/streamHelper/streamHelper';
import stream, { PassThrough } from 'stream';
import util from 'util';
import fs from 'fs';

const finished = util.promisify(stream.finished);

const start = async () => {
  const downloader = fileDownloader({
    url: 'https://raw.githubusercontent.com/dominictarr/split/master/readme.markdown',
  });

  const writer = fs.createWriteStream('./file.txt');
  const splitter = lineSplitStream({ ndjson: false });

  await Promise.resolve(finished(downloader.pipe(writer)));
  const parseStream = fs
    .createReadStream('./file.txt')
    .pipe(splitter)
    .pipe(new PassThrough({ objectMode: true }));

  for await (const chunk of parseStream) {
    console.log('CHUNK', chunk);
  }
};

start().then(() => {
  console.log('Script finished');
});
