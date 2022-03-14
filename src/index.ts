import { Logger } from './helpers/Logger';
import path from 'path';

// Helpers
export * from './helpers/Logger';

// Interfaces
export * from './interfaces/Logger';

// const start = async () => {
//   const logger = new Logger().initLogger({
//     logLevel: 'debug',
//     defaultMeta: { service: 'my-service', appName: 'application-name' },
//     debugMode: false,
//     errorStack: true,
//     consoleTransport: {
//       enable: true,
//     },
//     fileTransport: {
//       enable: false,
//       filePath: path.join(__dirname, '/logfile.log'),
//     },
//     debugFormatting: {
//       colors: true,
//       json: false,
//       splat: true,
//       pretty: true,
//     },
//   });

//   logger.info('This is a very crucial message', { prop1: '1', prop2: '2' });
//   logger.error('Error Message', new Error('ERROR'));
// };

// start().then(() => {
//   //console.log('Script finished');
// });
