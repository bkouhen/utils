import { StreamChainer } from '../../../helpers/stream/streamChainer';
import { Logger } from '../../../helpers/logger/Logger';
import { StreamChainerConfiguration } from '../../../interfaces/File';
import { lineSplitStream } from '../../../helpers/stream/streamHelper';
import path from 'path';
import util from 'util';
import fs from 'fs-extra';
import stream from 'stream';

import { spawn } from 'child_process';

jest.setTimeout(30000);

const pRemove = util.promisify(fs.remove);
const assetsPath = path.join(__dirname, '/../../assets');

const logger = new Logger().initLogger({
  logLevel: 'debug',
  debugMode: true,
  debugFormatting: {
    colors: true,
  },
  consoleTransport: {
    enable: true,
  },
});

beforeAll(() => {});

afterAll(async () => {
  await pRemove(`${assetsPath}/sample.long.written.csv.gz`);
});

describe('Stream Chainer Test - Errors', () => {
  test('if it throws when no config file', async () => {
    //@ts-ignore
    const config: StreamChainerConfiguration = null;
    const streamChainer = new StreamChainer(config, logger);
    try {
      await streamChainer.run();
    } catch (e) {
      expect(e.message).toMatch('Chain Configuration is required');
    }
  });

  test('if it throws when no items in the pipeline', async () => {
    const config: StreamChainerConfiguration = { name: 'THROW_0_ITEMS', items: [] };
    const streamChainer = new StreamChainer(config, logger);
    try {
      await streamChainer.run();
    } catch (e) {
      expect(e.message).toMatch('Config file has 0 items');
    }
  });

  test('if it throws when only one item in the pipeline', async () => {
    const config: StreamChainerConfiguration = {
      name: 'THROW_1_ITEM_ONLY',
      items: [{ type: 'FILE_READER', config: { absolutePath: '/dev/null' } }],
    };
    const streamChainer = new StreamChainer(config, logger);
    try {
      await streamChainer.run();
    } catch (e) {
      expect(e.message).toMatch('Cannot chain only 1 item');
    }
  });

  test('if it throws when first item is not a readable stream', async () => {
    const config: StreamChainerConfiguration = {
      name: 'THROW_FIRST_NOT_READABLE',
      items: [
        { type: 'FILE_WRITER', config: { absolutePath: '/dev/null' } },
        { type: 'FILE_WRITER', config: { absolutePath: '/dev/null' } },
      ],
    };
    const streamChainer = new StreamChainer(config, logger);
    try {
      await streamChainer.run();
    } catch (e) {
      expect(e.message).toMatch('First Chained Item should be a ReadableStream');
    }
  });

  test('if it throws when pipeline is not correctly configured', async () => {
    const config: StreamChainerConfiguration = {
      name: 'THROW_BAD_CHAIN',
      items: [
        { type: 'FILE_READER', config: { absolutePath: '/dev/null' } },
        { type: 'FILE_READER', config: { absolutePath: '/dev/null' } },
      ],
    };
    const streamChainer = new StreamChainer(config, logger);
    try {
      await streamChainer.run();
    } catch (e) {
      expect(e.message).toMatch('There seems to be an error in the items you chained together');
    }
  });
});

describe('Stream Chainer Test - Complete Process', () => {
  test('if file process is complete and correct', async () => {
    const config: StreamChainerConfiguration = {
      name: 'STREAM_CHAIN',
      items: [
        {
          type: 'FILE_DOWNLOADER',
          config: {
            url: 'https://github.com/bkouhen/utils/raw/master/src/__tests__/assets/sample.long.csv.gz',
          },
        },
        {
          type: 'GZIP',
          config: { type: 'UNZIP' },
        },
        {
          type: 'CSV_PARSER',
          config: {
            delimiter: ',',
            headers: true,
          },
        },
        {
          type: 'CSV_FORMATTER',
          config: {
            delimiter: ';',
            headers: true,
            includeEndRowDelimiter: true,
          },
        },
        {
          type: 'GZIP',
          config: { type: 'ZIP' },
        },
        {
          type: 'FILE_WRITER',
          config: {
            absolutePath: path.join(assetsPath, 'sample.long.written.csv.gz'),
          },
        },
      ],
    };
    const streamChainer = new StreamChainer(config, logger);
    await streamChainer.run();
    expect(fs.existsSync(`${assetsPath}/sample.long.written.csv.gz`)).toStrictEqual(true);

    let resBase = 0;
    let resOut = 0;
    let filesMatch = true;

    const resultMap = new Map<number, string>();

    const gunzipBase = spawn('gunzip', ['-c', `${assetsPath}/sample.long.csv.gz`]);
    const pipeBase = gunzipBase.stdout.pipe(lineSplitStream()).pipe(new stream.PassThrough({ objectMode: true }));

    for await (const data of pipeBase) {
      const lineSplit = data.toString().split(',').join('');
      resultMap.set(resBase, lineSplit);
      resBase += 1;
    }

    const gunzipOut = spawn('gunzip', ['-c', `${assetsPath}/sample.long.written.csv.gz`]);
    const pipeOut = gunzipOut.stdout.pipe(lineSplitStream()).pipe(new stream.PassThrough({ objectMode: true }));

    for await (const data of pipeOut) {
      const lineSplit = data.toString().split(';').join('');
      const mapValue = resultMap.get(resOut);
      if (mapValue !== lineSplit) filesMatch = false;
      resOut += 1;
    }

    expect(resBase).toStrictEqual(resOut);
    expect(filesMatch).toBeTruthy();
  });
});
