// Main Modules
import { SPLAT } from 'triple-beam';
import { format } from 'util';
import winston from 'winston';
// Interfaces
import { LoggerConfigOptions, WinstonLogger } from './interfaces';
const { combine, timestamp, errors, colorize, json, simple } = winston.format;

/**
 * Class defining a Winston Logger
 * @example
 * ```ts
 * import { Logger } from './lib/logger/Logger';
 * const logger = new Logger().initLogger({
 *  logLevel: 'debug',
 *  debug: true,
 *  errorStack: true,
 *  consoleTransport: true,
 *  formats: { splat: true },
 * });

 * logger.debug('New debug message');
 * ```
 */
export class Logger {
  private logger: WinstonLogger;

  /**
   * Initialize a Winston Logger Instance
   * @param {LoggerConfigOptions} options - options passed to the Logger as configuration
   * @returns {WinstonLogger} The generated Logger instance
   */
  public initLogger(options: LoggerConfigOptions): WinstonLogger {
    const logger = winston.createLogger({
      level: options.logLevel,
      levels: winston.config.npm.levels,
      defaultMeta: { ...options.defaultMeta },
    });

    if (options.consoleTransport === true) {
      logger.add(this.generateConsoleTransport(options));
    }

    if (options.fileTransport) {
      logger.add(this.generateFileTransport(options));
    }

    this.logger = logger;
    return this.logger;
  }

  /**
   * Initialize a Winston File Transport
   * @param {LoggerConfigOptions} options - options passed to the Logger as configuration
   * @returns {winston.transport} The generated Transport instance
   */
  private generateFileTransport(options: LoggerConfigOptions): winston.transport {
    return new winston.transports.File({
      filename: options.fileTransport,
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        json(),
        errors({ stack: true }),
        this.formatLogMessage(options),
      ),
    });
  }

  /**
   * Initialize a Winston Console Transport
   * @param {LoggerConfigOptions} options - options passed to the Logger as configuration
   * @returns {winston.transport} The generated Transport instance
   */
  private generateConsoleTransport(options: LoggerConfigOptions): winston.transport {
    if (options.debug) {
      const formats: winston.Logform.Format[] = [];
      if (options.formats?.splat) formats.push(this.addSplatDebug());
      formats.push(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        simple(),
        errors({ stack: true }),
        this.formatLogMessage(options),
      );
      if (options.formats?.colorize) formats.push(colorize());
      return new winston.transports.Console({
        format: combine(...formats),
      });
    }

    return new winston.transports.Console({
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        json(),
        errors({ stack: true }),
        this.formatLogMessage(options),
      ),
    });
  }

  /**
   * Functions that returns the log message after formatting
   * @param {LoggerConfigOptions} options - options passed to the Logger as configuration
   * @returns {winston.Logform.Format} The formatted message
   */
  private formatLogMessage(options: LoggerConfigOptions): winston.Logform.Format {
    return winston.format.printf((info) => {
      const log = `${info.timestamp} - ${info.level}: ${info.message}`;
      if (options.debug) {
        if (options.errorStack) {
          return info.stack ? `${log}\n${info.stack}` : log;
        }
        return log;
      }

      if (options.errorStack) {
        info.stack = info.stack ? info.stack.replace(/\n/g, '') : undefined;
        return JSON.stringify(info);
      }

      delete info.stack;
      return JSON.stringify(info);
    });
  }

  private addSplatDebug() {
    return {
      transform(info: winston.Logform.TransformableInfo): winston.Logform.TransformableInfo {
        //@ts-ignore
        const splatArgs = info[SPLAT];
        if (splatArgs && !info.stack) {
          info.message = format(info.message, ...splatArgs);
          return info;
        }
        return info;
      },
    };
  }
}
