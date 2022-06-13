import path from 'path';
import fs from 'fs-extra';
import util from 'util';
import { fileWriter, fileReader, gzipStream } from '../../../helpers/stream/streamHelper';
import { exec } from 'child_process';

const pExec = util.promisify(exec);
const pRemove = util.promisify(fs.remove);
const assetsPath = path.join(__dirname, '/../../assets');

beforeAll(() => {
  fs.ensureDirSync(assetsPath);
});

afterAll(async () => {
  await pRemove(`${assetsPath}/compress.txt.gz`);
  await pRemove(`${assetsPath}/uncompressed.txt`);
  await pRemove(`${assetsPath}/uncompress.txt`);
});

describe('Gzip Stream Test', () => {
  test('if compression is correct', async () => {
    const reader = fileReader({ absolutePath: `${assetsPath}/compress.txt` });
    const writer = fileWriter({ absolutePath: `${assetsPath}/compress.txt.gz` });
    const compress = gzipStream({ type: 'ZIP' });
    await new Promise((resolve) => {
      reader.pipe(compress).pipe(writer).on('finish', resolve);
    });

    expect(fs.existsSync(`${assetsPath}/compress.txt.gz`)).toStrictEqual(true);

    await pExec(`gunzip <${assetsPath}/compress.txt.gz >${assetsPath}/uncompressed.txt`);

    expect(fs.existsSync(`${assetsPath}/uncompressed.txt`)).toStrictEqual(true);

    let resultBase = '';
    let resultOut = '';
    await new Promise((resolve) => {
      const readerBase = fileReader({ absolutePath: `${assetsPath}/compress.txt` });
      readerBase.on('data', (chunk: string) => {
        resultBase += chunk;
      });
      readerBase.on('end', () => {
        const readerOut = fileReader({ absolutePath: `${assetsPath}/uncompressed.txt` });
        readerOut.on('data', (chunk: string) => {
          resultOut += chunk;
        });
        readerOut.on('end', resolve);
      });
    });

    expect(resultBase).toStrictEqual(resultOut);
  });

  test('if decompression is correct', async () => {
    const reader = fileReader({ absolutePath: `${assetsPath}/uncompress.gz` });
    const writer = fileWriter({ absolutePath: `${assetsPath}/uncompress.txt` });
    const uncompress = gzipStream({ type: 'UNZIP' });
    await new Promise((resolve) => {
      reader.pipe(uncompress).pipe(writer).on('finish', resolve);
    });

    expect(fs.existsSync(`${assetsPath}/uncompress.txt`)).toStrictEqual(true);

    let resultBase = '';
    let resultOut = '';
    await new Promise((resolve) => {
      const readerBase = fileReader({ absolutePath: `${assetsPath}/compress.txt` });
      readerBase.on('data', (chunk: string) => {
        resultBase += chunk;
      });
      readerBase.on('end', () => {
        const readerOut = fileReader({ absolutePath: `${assetsPath}/uncompress.txt` });
        readerOut.on('data', (chunk: string) => {
          resultOut += chunk;
        });
        readerOut.on('end', resolve);
      });
    });

    expect(resultBase).toStrictEqual(resultOut);
  });
});
