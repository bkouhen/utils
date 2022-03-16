import path from 'path';
import fs from 'fs-extra';
import { fileWriter } from '../helpers/file/streamHelper/streamHelper';
import { Readable } from 'stream';

const assetsPath = path.join(__dirname, '/assets');

beforeAll(() => {
  fs.ensureDirSync(assetsPath);
});

afterAll(async () => {
  await fs.remove(`${assetsPath}/write.txt`, (error) => {
    if (error) {
      console.log(error);
    }
  });
  await fs.remove(`${assetsPath}/write-pipe.txt`, (error) => {
    if (error) {
      console.log(error);
    }
  });
});

describe('Simple fileWriter Test', () => {
  test('if it does write a file to the system', async () => {
    await new Promise((resolve) => {
      const writer = fileWriter({ absolutePath: `${assetsPath}/write.txt` });
      writer.write('Hello World!');
      writer.close();
      writer.on('finish', resolve);
    });
    expect(fs.existsSync(`${assetsPath}/write.txt`)).toStrictEqual(true);

    let fileContent = '';
    await new Promise((resolve) => {
      const reader = fs.createReadStream(`${assetsPath}/write.txt`, 'utf-8');
      reader.on('data', (chunk: string) => {
        fileContent += chunk;
      });
      reader.on('end', resolve);
    });

    expect(fileContent).toStrictEqual('Hello World!');
  });

  test('if it handles correctly piping', async () => {
    const writer = fileWriter({ absolutePath: `${assetsPath}/write-pipe.txt` });
    const readable = new Readable();

    let fileContent = '';
    await new Promise((resolve) => {
      readable.pipe(writer);

      readable.push('Hello from Line1');
      readable.push('Hello from Line2');
      readable.push(null);

      writer.on('finish', () => {
        const reader = fs.createReadStream(`${assetsPath}/write-pipe.txt`, 'utf-8');
        reader.on('data', (chunk: string) => {
          fileContent += chunk;
        });
        reader.on('end', resolve);
      });
    });
    expect(fileContent).toStrictEqual('Hello from Line1Hello from Line2');
  });
});
