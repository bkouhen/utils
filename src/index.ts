// Helpers
export * from './helpers/logger/Logger';
export * from './helpers/file/streamHelper/streamHelper';

// Interfaces
export * as Interfaces from './interfaces/index';

// Utils
export * as Utils from './utils/index';

import { Logger } from './helpers/logger/Logger';
import { countLinesSync } from './utils/file';

console.log(__dirname);

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

const start = async () => {
  logger.info('Starting script');
  const numberOfLines = countLinesSync('/home/bkouhen/scripts/utils/package.json', true, logger);
  logger.info(`${numberOfLines} lines for the file`);
};

start().then(() => {
  logger.info('Script has successfully ended');
});
