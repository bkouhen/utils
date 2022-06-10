import path from 'path';
import fs from 'fs-extra';
import util from 'util';
import { fileDownloader, fileWriter, fileReader } from '../../../helpers/file/streamHelper/streamHelper';
const pRemove = util.promisify(fs.remove);

const assetsPath = path.join(__dirname, '/../../assets');

beforeAll(() => {
  fs.ensureDirSync(assetsPath);
});

afterAll(async () => {
  await pRemove(`${assetsPath}/downloaded.txt`);
});

describe('File Downloader Test', () => {
  test('if file is correctly downloaded', async () => {
    const downloader = fileDownloader({
      url: 'https://raw.githubusercontent.com/dominictarr/split/master/readme.markdown',
    });
    const writer = fileWriter({ absolutePath: `${assetsPath}/downloaded.txt` });
    await new Promise((resolve) => {
      downloader.pipe(writer).on('finish', resolve);
    });

    expect(fs.existsSync(`${assetsPath}/downloaded.txt`)).toStrictEqual(true);

    let resultBase = '';
    let resultOut = '';
    await new Promise((resolve) => {
      const readerBase = fileReader({ absolutePath: `${assetsPath}/sample.md` });
      readerBase.on('data', (chunk: string) => {
        resultBase += chunk;
      });
      readerBase.on('end', () => {
        const readerOut = fileReader({ absolutePath: `${assetsPath}/downloaded.txt` });
        readerOut.on('data', (chunk: string) => {
          resultOut += chunk;
        });
        readerOut.on('end', resolve);
      });
    });

    expect(resultBase).toStrictEqual(resultOut);
  });
});
