import * as fastCsv from 'fast-csv';
import { StreamOptions } from 'got';

export interface lineSplitOptions {
  regex?: RegExp;
  ndjson?: boolean;
  maxLength?: number;
}

export interface FileWriterOptions {
  absolutePath: string;
}

export interface FileReaderOptions {
  absolutePath: string;
}

export interface GzipOptions {
  type: 'ZIP' | 'UNZIP';
}

export interface StreamChainerConfiguration {
  name: string;
  items: StreamChainItem[];
}

export interface FileReaderItem {
  type: 'FILE_READER';
  config: FileReaderOptions;
}

export interface FileWriterItem {
  type: 'FILE_WRITER';
  config: FileWriterOptions;
}

export interface FileDownloaderItem {
  type: 'FILE_DOWNLOADER';
  config: StreamOptions;
}

export interface LineSplitterItem {
  type: 'LINE_SPLITTER';
  config: lineSplitOptions;
}

export interface CsvParserItem {
  type: 'CSV_PARSER';
  config: fastCsv.ParserOptionsArgs;
}

export interface CsvFormatterItem {
  type: 'CSV_FORMATTER';
  config: fastCsv.FormatterOptionsArgs<fastCsv.FormatterRow, fastCsv.FormatterRow>;
}

export interface GzipItem {
  type: 'GZIP';
  config: GzipOptions;
}

export type ItemName =
  | 'FILE_READER'
  | 'FILE_WRITER'
  | 'LINE_SPLITTER'
  | 'CSV_PARSER'
  | 'CSV_FORMATTER'
  | 'FILE_DOWNLOADER'
  | 'GZIP';

export type StreamChainItem =
  | FileReaderItem
  | FileWriterItem
  | FileDownloaderItem
  | LineSplitterItem
  | CsvParserItem
  | CsvFormatterItem
  | GzipItem;
