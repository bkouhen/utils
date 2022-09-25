import path from 'path';
import fs from 'fs-extra';
import { fileReader } from '../../../helpers/stream/streamHelper';

const assetsPath = path.join(__dirname, '/../../assets');

beforeAll(() => {
  fs.ensureDirSync(assetsPath);
});

describe('Simple fileReader Test', () => {
  test('if it does read a file from the system', async () => {
    const reader = fileReader({ absolutePath: `${assetsPath}/sample.txt` });

    let fileContent = '';
    await new Promise((resolve) => {
      reader.on('data', (chunk: string) => {
        fileContent += chunk;
      });
      reader.on('end', resolve);
    });

    expect(fileContent).toStrictEqual('This is Line 1\nThis is Line 2\nThis is Line 3\n');
  });
});
