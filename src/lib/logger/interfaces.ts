import winston from 'winston';

export type WinstonLogger = winston.Logger;

type LoggerDefaultMeta = object;

export interface LoggerConfigOptions {
  logLevel: string;
  debug?: boolean;
  errorStack?: boolean;
  defaultMeta?: LoggerDefaultMeta;
  consoleTransport?: boolean;
  fileTransport?: string;
  formats?: {
    splat?: boolean;
    colorize?: boolean;
  };
}

export enum FontStyles {
  bold = 'bold',
  dim = 'dim',
  italic = 'italic',
  underline = 'underline',
  inverse = 'inverse',
  hidden = 'hidden',
  strikethrough = 'strikethrough',
}

export enum ForegroundColors {
  black = 'black',
  red = 'red',
  green = 'green',
  yellow = 'yellow',
  blue = 'blue',
  magenta = 'magenta',
  cyan = 'cyan',
  white = 'white',
  gray = 'gray',
  grey = 'grey',
}

export enum BackgroundColors {
  blackBG = 'blackBG',
  redBG = 'redBG',
  greenBG = 'greenBG',
  yellowBG = 'yellowBG',
  blueBG = 'blueBG',
  magentaBG = 'magentaBG',
  cyanBG = 'cyanBG',
  whiteBG = 'whiteBG',
}
