import winston from 'winston';

export type WinstonLogger = winston.Logger;

type LoggerDefaultMeta = object;

export interface LoggerConfigOptions {
  logLevel: string;
  errorStack?: boolean;
  debugMode?: boolean;
  debugFormatting?: {
    colors?: boolean;
    pretty?: boolean;
    splat?: boolean;
    json?: boolean;
  };
  defaultMeta?: LoggerDefaultMeta;
  consoleTransport?: {
    enable: boolean;
  };
  fileTransport?: {
    enable: boolean;
    filePath: string;
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
