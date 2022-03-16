import { Transform, TransformCallback } from 'stream';
import through from 'through';
import got, { StreamOptions } from 'got';
import split from 'split';
import { lineSplitOptions } from '../../../interfaces/File';

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
        split(regex, null, { maxLength: options.maxLength, trailing: false })
      : //@ts-ignore
        split(regex, null, { trailing: false });
  }

  return split();
};
