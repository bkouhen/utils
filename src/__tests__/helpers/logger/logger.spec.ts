import { Logger } from '../../../helpers/logger/Logger';
import path from 'path';
import fs from 'fs-extra';

expect.extend({
  toMatchLogFormat(received: string, match: string) {
    const ts = received.split(' - ')[0];
    const message = received.split(' - ')[1];

    return message === match && new Date(ts).toString() !== 'Invalid Date'
      ? {
          pass: true,
          message: () => `Log Format OK`,
        }
      : {
          pass: false,
          message: () => `Log Format KO`,
        };
  },
});

expect.extend({
  toJSONMatcher(received: string, match: string) {
    const message = JSON.parse(received);
    delete message.timestamp;
    delete message.stack;
    const json = JSON.stringify(message);
    return json === match
      ? {
          pass: true,
          message: () => `Log Format OK`,
        }
      : {
          pass: false,
          message: () => `Log Format KO`,
        };
  },
});

expect.extend({
  HasErrorStackMatcher(received: string) {
    const message = JSON.parse(received) as object;
    return message.hasOwnProperty('stack')
      ? {
          pass: true,
          message: () => `Error Stack OK`,
        }
      : {
          pass: false,
          message: () => `Error Stack KO`,
        };
  },
});

const assetsPath = path.join(__dirname, '/../../assets');

beforeAll(() => {
  fs.ensureDirSync(assetsPath);
  const logFilePath = path.join(__dirname, '/../../assets/logfile.log');
  fs.ensureFileSync(logFilePath);
});

afterAll(async () => {
  const logFilePath = path.join(__dirname, '/../../assets/logfile.log');
  await fs.remove(logFilePath, (error) => {
    if (error) {
      console.log(error);
    }
  });
});

describe('Init Logger Test', () => {
  const logger = new Logger().initLogger({
    logLevel: 'debug',
    debugMode: true,
    consoleTransport: {
      enable: true,
    },
    fileTransport: {
      enable: true,
      filePath: path.join(__dirname, '/../../assets/logfile.log'),
    },
  });

  test('if Logger is successfully initialized', () => {
    expect(logger).toBeDefined();
  });

  test('if Log Level matches', () => {
    //@ts-ignore
    const level = logger.level;
    expect(level).toStrictEqual('debug');
  });

  test('if Console Transport is enabled', () => {
    //@ts-ignore
    const consoleSpy = jest.spyOn(console._stdout, 'write').mockImplementation();
    logger.debug('This is a debug test'); // => debug: This is a debug test
    //@ts-ignore
    expect(logger.transports.length).toBeGreaterThanOrEqual(1);
    expect(consoleSpy).toHaveBeenNthCalledWith(1, (expect as any).toMatchLogFormat(`debug: This is a debug test\n`));
  });

  test('if File Transport is enabled', () => {
    expect(logger.transports.length).toStrictEqual(2);
    expect(fs.existsSync(path.join(__dirname, '/../../assets/logfile.log'))).toStrictEqual(true);
  });
});

describe('Debug Logger Test - Simple', () => {
  test('string interpolation on different log levels', () => {
    const logger = new Logger().initLogger({
      logLevel: 'silly',
      debugMode: true,
      debugFormatting: {
        splat: true,
      },
      consoleTransport: {
        enable: true,
      },
    });

    //@ts-ignore
    const consoleSpy = jest.spyOn(console._stdout, 'write').mockImplementation();
    logger.silly('test level 6', 'silly', { level: 'silly' }); // => silly: test level 6 silly { level: 'silly' }
    logger.debug('test level', 5, 'debug', { level: 'debug' }); // => debug: test level 5 debug { level: 'debug' }
    logger.verbose('test %s', 'level', 4, 'verbose', { level: 'verbose' }); // => verbose: test level 4 verbose { level: 'verbose' }
    logger.http('test level', 3, 'http', { level: 'http' }); // => http: test level 3 http { level: 'http' }
    logger.info('test level', 2, 'info', { level: 'info' }); // => info: test level 2 info { level: 'info' }
    logger.warn('test level', 1, 'warn', { level: 'warn' }); // => warn: test level 1 warn { level: 'warn' }
    logger.error('test level', 0, 'error', { level: 'error' }); // => error: test level 0 error { level: 'error' }

    expect(consoleSpy).toHaveBeenNthCalledWith(
      1,
      (expect as any).toMatchLogFormat(`silly: test level 6 silly { level: 'silly' }\n`),
    );
    expect(consoleSpy).toHaveBeenNthCalledWith(
      2,
      (expect as any).toMatchLogFormat(`debug: test level 5 debug { level: 'debug' }\n`),
    );
    expect(consoleSpy).toHaveBeenNthCalledWith(
      3,
      (expect as any).toMatchLogFormat(`verbose: test level level 4 verbose { level: 'verbose' }\n`),
    );
    expect(consoleSpy).toHaveBeenNthCalledWith(
      4,
      (expect as any).toMatchLogFormat(`http: test level 3 http { level: 'http' }\n`),
    );
    expect(consoleSpy).toHaveBeenNthCalledWith(
      5,
      (expect as any).toMatchLogFormat(`info: test level 2 info { level: 'info' }\n`),
    );
    expect(consoleSpy).toHaveBeenNthCalledWith(
      6,
      (expect as any).toMatchLogFormat(`warn: test level 1 warn { level: 'warn' }\n`),
    );
    expect(consoleSpy).toHaveBeenNthCalledWith(
      7,
      (expect as any).toMatchLogFormat(`error: test level 0 error { level: 'error' }\n`),
    );
  });

  test('error stack on debug mode', () => {
    const logger = new Logger().initLogger({
      logLevel: 'debug',
      debugMode: true,
      errorStack: true,
      debugFormatting: {
        splat: false,
      },
      consoleTransport: {
        enable: true,
      },
    });

    //@ts-ignore
    const consoleSpy = jest.spyOn(console._stdout, 'write').mockImplementation();
    logger.error('New error message', new Error('Oops'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('error: New error message Oops\nError: Oops'));
  });
});

describe('Debug Logger Test - Json', () => {
  test('if JSON Format is valid', () => {
    const logger = new Logger().initLogger({
      logLevel: 'debug',
      debugMode: true,
      errorStack: false,
      defaultMeta: {
        service: 'my-service',
        appName: 'my-app-name',
      },
      debugFormatting: {
        splat: false,
        json: true,
      },
      consoleTransport: {
        enable: true,
      },
    });

    //@ts-ignore
    const consoleSpy = jest.spyOn(console._stdout, 'write').mockImplementation();
    const expectedJsonLog = {
      service: 'my-service',
      appName: 'my-app-name',
      property: 'value',
      property2: 'value2',
      level: 'debug',
      message: 'test debug on json format',
    };
    logger.debug('test debug on json format', { property: 'value', property2: 'value2' });
    expect(logger.defaultMeta).toStrictEqual({ service: 'my-service', appName: 'my-app-name' });
    expect(consoleSpy).toHaveBeenCalledWith((expect as any).toJSONMatcher(JSON.stringify(expectedJsonLog)));
  });

  test('error stack in json format', () => {
    const logger = new Logger().initLogger({
      logLevel: 'debug',
      debugMode: true,
      errorStack: true,
      defaultMeta: {
        service: 'my-service',
        appName: 'my-app-name',
      },
      debugFormatting: {
        splat: false,
        json: true,
      },
      consoleTransport: {
        enable: true,
      },
    });

    //@ts-ignore
    const consoleSpy = jest.spyOn(console._stdout, 'write').mockImplementation();
    const expectedJsonLog = {
      service: 'my-service',
      appName: 'my-app-name',
      level: 'error',
      message: 'test error on json format Oops',
    };
    logger.error('test error on json format', new Error('Oops'));
    expect(logger.defaultMeta).toStrictEqual({ service: 'my-service', appName: 'my-app-name' });
    expect(consoleSpy).toHaveBeenCalledWith((expect as any).HasErrorStackMatcher());
    expect(consoleSpy).toHaveBeenCalledWith((expect as any).toJSONMatcher(JSON.stringify(expectedJsonLog)));
  });
});

describe('Logger Test - Json', () => {
  test('if JSON Format is valid', () => {
    const logger = new Logger().initLogger({
      logLevel: 'debug',
      errorStack: false,
      defaultMeta: {
        service: 'my-service',
        appName: 'my-app-name',
      },
      consoleTransport: {
        enable: true,
      },
    });

    //@ts-ignore
    const consoleSpy = jest.spyOn(console._stdout, 'write').mockImplementation();
    const expectedJsonLog = {
      service: 'my-service',
      appName: 'my-app-name',
      property: 'value',
      property2: 'value2',
      level: 'debug',
      message: 'test debug on json format',
    };
    logger.debug('test debug on json format', { property: 'value', property2: 'value2' });
    expect(logger.defaultMeta).toStrictEqual({ service: 'my-service', appName: 'my-app-name' });
    expect(consoleSpy).toHaveBeenCalledWith((expect as any).toJSONMatcher(JSON.stringify(expectedJsonLog)));
  });

  test('error stack in json format', () => {
    const logger = new Logger().initLogger({
      logLevel: 'debug',
      errorStack: true,
      defaultMeta: {
        service: 'my-service',
        appName: 'my-app-name',
      },
      consoleTransport: {
        enable: true,
      },
    });

    //@ts-ignore
    const consoleSpy = jest.spyOn(console._stdout, 'write').mockImplementation();
    const expectedJsonLog = {
      service: 'my-service',
      appName: 'my-app-name',
      level: 'error',
      message: 'test error on json format Oops',
    };
    logger.error('test error on json format', new Error('Oops'));
    expect(logger.defaultMeta).toStrictEqual({ service: 'my-service', appName: 'my-app-name' });
    expect(consoleSpy).toHaveBeenCalledWith((expect as any).HasErrorStackMatcher());
    expect(consoleSpy).toHaveBeenCalledWith((expect as any).toJSONMatcher(JSON.stringify(expectedJsonLog)));
  });
});
