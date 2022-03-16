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
