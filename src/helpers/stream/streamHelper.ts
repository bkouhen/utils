import { Transform, TransformCallback } from 'stream';
import through from 'through';
import got, { StreamOptions } from 'got';
import split from 'split';
import * as fastCsv from 'fast-csv';
import { FileWriterOptions, FileReaderOptions, GzipOptions, lineSplitOptions } from '../../interfaces/File';
import fs from 'fs';
import zlib from 'zlib';

export class FileDownloader extends Transform {
  constructor(options: StreamOptions) {
    super({
      readableObjectMode: true,
      writableObjectMode: false,
    });
    return got.stream.get(options).pipe(this);
  }

  _transform(chunk: any, encoding: BufferEncoding, next: TransformCallback): void {
    try {
      this.push(chunk);
      next();
    } catch (e) {
      next(e as Error);
    }
  }
}

export const fileDownloader = (options: StreamOptions): FileDownloader => new FileDownloader(options);

export const fileReader = (options: FileReaderOptions): fs.ReadStream => fs.createReadStream(options.absolutePath);

export const fileWriter = (options: FileWriterOptions): fs.WriteStream => fs.createWriteStream(options.absolutePath);

export const lineSplitStream = (options?: lineSplitOptions): through.ThroughStream => {
  if (options?.ndjson) {
    return options?.maxLength
      ? //@ts-ignore
        split(JSON.parse, null, { maxLength: options?.maxLength, trailing: false })
      : //@ts-ignore
        split(JSON.parse, null, { trailing: false });
  }

  if (options?.regex) {
    return options?.maxLength
      ? //@ts-ignore
        split(options.regex, null, { maxLength: options.maxLength, trailing: false })
      : //@ts-ignore
        split(options.regex, null, { trailing: false });
  }
  return options?.maxLength
    ? //@ts-ignore
      split(null, null, { maxLength: options.maxLength, trailing: false })
    : //@ts-ignore
      split(null, null, { trailing: false });
};

export const csvParser = (
  options: fastCsv.ParserOptionsArgs,
): fastCsv.CsvParserStream<fastCsv.ParserRow<any>, fastCsv.ParserRow<any>> => {
  return fastCsv.parse({ ...options });
};

export const csvFormatter = (
  options: fastCsv.FormatterOptionsArgs<fastCsv.FormatterRow, fastCsv.FormatterRow>,
): fastCsv.CsvFormatterStream<fastCsv.FormatterRow, fastCsv.FormatterRow> => {
  return fastCsv.format({ ...options });
};

export const gzipStream = (options: GzipOptions): zlib.Gzip | zlib.Gunzip =>
  options.type === 'ZIP' ? zlib.createGzip() : zlib.createUnzip();
