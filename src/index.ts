// Helpers
export * from './helpers/logger/Logger';
export * from './helpers/file/streamHelper/streamHelper';

// Interfaces
export * from './interfaces/Logger';
export * from './interfaces/File';

import { Logger } from './helpers/logger/Logger';
import { StreamChainer } from './helpers/file/streamHelper/streamChainer';
import { StreamChainerConfiguration } from './interfaces/File';

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

const streamConfig: StreamChainerConfiguration = {
  name: 'Test Stream',
  items: [
    {
      type: 'FILE_READER',
      config: {
        absolutePath: './src/__tests__/assets/sample.csv.gz',
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
        headers: false,
      },
    },
    {
      type: 'FILE_WRITER',
      config: {
        absolutePath: './src/samplewritten.log',
      },
    },
  ],
};

const start = async () => {
  const pipeline = new StreamChainer(streamConfig, logger);
  await pipeline.run();
};

start().then(() => {
  logger.info('Script has successfully ended');
});
