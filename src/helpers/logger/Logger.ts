// Main Modules
import winston from 'winston';
import { SPLAT } from 'triple-beam';
import { format } from 'util';
const { combine, timestamp, errors, colorize, json, simple, prettyPrint, splat } = winston.format;

// Interfaces
import { WinstonLogger, LoggerConfigOptions } from '../../interfaces/Logger';

/** Class defining a Winston Logger */
export class Logger {
  private logger: WinstonLogger;

  constructor() {}

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

    if (options.consoleTransport && options.consoleTransport.enable) {
      logger.add(this.generateConsoleTransport(options));
    }

    if (options.fileTransport && options.fileTransport.enable) {
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
      filename: options.fileTransport?.filePath,
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
    if (options.debugMode) {
      const formats: winston.Logform.Format[] = [];
      formats.push(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }));
      if (options.debugFormatting?.splat) {
        formats.push(this.addSplatDebug());
        formats.push(splat());
      }
      if (options.debugFormatting?.json) formats.push(json());
      if (!options.debugFormatting?.json) formats.push(simple());
      if (options.debugFormatting?.pretty) formats.push(prettyPrint());
      formats.push(errors({ stack: true }));
      formats.push(this.formatLogMessage(options));
      if (options.debugFormatting?.colors) formats.push(colorize({ all: true }));

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

  private addSplatDebug() {
    return {
      transform(info: winston.Logform.TransformableInfo): winston.Logform.TransformableInfo {
        //@ts-ignore
        const splatArgs = info[SPLAT];
        if (splatArgs) {
          const stringArgs = format(...splatArgs);
          info.message = `${info.message} ${stringArgs}`;
          return info;
        }
        return info;
      },
    };
  }

  /**
   * Functions that returns the log message after formatting
   * @param {LoggerConfigOptions} options - options passed to the Logger as configuration
   * @returns {winston.Logform.Format} The formatted message
   */
  private formatLogMessage(options: LoggerConfigOptions): winston.Logform.Format {
    return winston.format.printf((info) => {
      const log = `${info.timestamp} - ${info.level}: ${info.message}`;
      if (options.debugMode && options.debugFormatting && options.debugFormatting.json) {
        if (options.errorStack) {
          return JSON.stringify(info);
        }
        delete info.stack;
        return JSON.stringify(info);
      }

      if (options.debugMode) {
        if (options.errorStack) {
          return info.stack ? `${log}\n${info.stack}` : log;
        }
        delete info.stack;
        return log;
      }

      if (options.errorStack) {
        info.stack = info.stack ? info.stack.split('\n') : undefined;
        return JSON.stringify(info);
      }

      delete info.stack;
      return JSON.stringify(info);
    });
  }
}
