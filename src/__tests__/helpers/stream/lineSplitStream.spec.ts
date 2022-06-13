import path from 'path';
import fs from 'fs-extra';
import { lineSplitStream } from '../../../helpers/stream/streamHelper';

const assetsPath = path.join(__dirname, '/../../assets');

beforeAll(() => {
  fs.ensureDirSync(assetsPath);
});

describe('Simple Line Splitter Test', () => {
  test('if parsing is correct', async () => {
    const lineSplitter = lineSplitStream();
    const readable = fs.createReadStream(`${assetsPath}/sample.txt`);

    const fileContent: string[] = [];
    await new Promise((resolve) => {
      readable
        .pipe(lineSplitter)
        .on('data', (chunk: string) => {
          fileContent.push(chunk);
        })
        .on('end', resolve);
    });

    expect(fileContent.length).toStrictEqual(3);
    expect(fileContent[0]).toStrictEqual('This is Line 1');
    expect(fileContent[1]).toStrictEqual('This is Line 2');
    expect(fileContent[2]).toStrictEqual('This is Line 3');
  });
});

describe('Ndjson Line Splitter Test', () => {
  test('if parsing is correct', async () => {
    const lineSplitter = lineSplitStream({ ndjson: true });
    const readable = fs.createReadStream(`${assetsPath}/sample.ndjson`);

    const fileContent: object[] = [];
    await new Promise((resolve) => {
      readable
        .pipe(lineSplitter)
        .on('data', (chunk: object) => {
          fileContent.push(chunk);
        })
        .on('end', resolve);
    });

    const expected0 = {
      name: 'rob',
      age: 30,
      hobbies: ['sports', 'arts'],
    };
    const expected1 = {
      name: 'mike',
      age: 22,
      hobbies: ['soccer', 'arts'],
    };
    const expected2 = {
      name: 'john',
      age: 18,
      hobbies: ['sports', 'trips'],
      list: {
        enable: true,
        disable: 'no',
      },
    };

    expect(fileContent.length).toStrictEqual(3);
    expect(fileContent[0]).toStrictEqual(expected0);
    expect(fileContent[1]).toStrictEqual(expected1);
    expect(fileContent[2]).toStrictEqual(expected2);
  });
});

describe('Regex Line Splitter Test', () => {
  test('if parsing is correct', async () => {
    const lineSplitter = lineSplitStream({ regex: /\r?\n/ });
    const readable = fs.createReadStream(`${assetsPath}/sample.txt`);

    const fileContent: string[] = [];
    await new Promise((resolve) => {
      readable
        .pipe(lineSplitter)
        .on('data', (chunk: string) => {
          fileContent.push(chunk);
        })
        .on('end', resolve);
    });

    expect(fileContent.length).toStrictEqual(3);
    expect(fileContent[0]).toStrictEqual('This is Line 1');
    expect(fileContent[1]).toStrictEqual('This is Line 2');
    expect(fileContent[2]).toStrictEqual('This is Line 3');
  });
});
