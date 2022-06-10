// Helpers
export * as Helpers from './helpers/index';

// Interfaces
export * as Interfaces from './interfaces/index';

// Utils
export * as Utils from './utils/index';

import { Logger } from './helpers/logger/Logger';

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

import { spawn as originalSpawn } from 'child_process';
import { spawn, pExec, spawnSync } from './utils/process';

const start = async () => {
  logger.info('Starting script');
  // await new Promise((resolve) => {
  //   const ls = spawn('ls -alh');
  //   ls.stdout.on('data', (data) => console.log(data.toString()));
  //   ls.stderr.on('data', (data) => console.error(data.toString()));
  //   ls.on('close', (exitCode) => {
  //     console.log('command exited with code ' + exitCode);
  //     resolve(undefined);
  //   });
  // });

  const lsSync = spawnSync('npm i --prefix ./src');
  console.dir(lsSync);
  console.log(lsSync.stdout.toString());
  console.log(lsSync.stderr.toString());
};

start().then(() => {
  logger.info('Script has successfully ended');
});
