import { StreamChainer } from '../helpers/file/streamHelper/streamChainer';
import { Logger } from '../helpers/logger/Logger';
import { StreamChainerConfiguration } from '../interfaces/File';
import path from 'path';

const assetsPath = path.join(__dirname, '/assets');

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

afterAll(() => {});

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

describe('', () => {});
