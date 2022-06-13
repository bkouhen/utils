import path from 'path';
import fs from 'fs-extra';
import { csvParser } from '../../../helpers/stream/streamHelper';

const assetsPath = path.join(__dirname, '/../../assets');

beforeAll(() => {
  fs.ensureDirSync(assetsPath);
});

describe('Csv Parser Test', () => {
  test('if parsing is correct', async () => {
    const csv = csvParser({ delimiter: ',', headers: true });
    const readable = fs.createReadStream(`${assetsPath}/sample.csv`);

    const fileContent: string[] = [];
    await new Promise((resolve) => {
      readable
        .pipe(csv)
        .on('data', (chunk: string) => {
          fileContent.push(chunk);
        })
        .on('end', resolve);
    });

    const expected0 = {
      name: 'rob',
      age: '30',
      city: 'Paris',
    };

    const expected1 = {
      name: 'mike',
      age: '20',
      city: 'New York',
    };

    expect(fileContent.length).toStrictEqual(2);
    expect(fileContent[0]).toStrictEqual(expected0);
    expect(fileContent[1]).toStrictEqual(expected1);
  });

  test('if parsing is correct with maxRows', async () => {
    const csv = csvParser({ delimiter: ',', headers: true, maxRows: 1 });
    const readable = fs.createReadStream(`${assetsPath}/sample.csv`);

    const fileContent: string[] = [];
    await new Promise((resolve) => {
      readable
        .pipe(csv)
        .on('data', (chunk: string) => {
          fileContent.push(chunk);
        })
        .on('end', resolve);
    });

    const expected0 = {
      name: 'rob',
      age: '30',
      city: 'Paris',
    };

    expect(fileContent.length).toStrictEqual(1);
    expect(fileContent[0]).toStrictEqual(expected0);
  });

  test('if parsing is correct with no headers', async () => {
    const csv = csvParser({ delimiter: ',', headers: false });
    const readable = fs.createReadStream(`${assetsPath}/sample.csv`);

    const fileContent: string[] = [];
    await new Promise((resolve) => {
      readable
        .pipe(csv)
        .on('data', (chunk: string) => {
          fileContent.push(chunk);
        })
        .on('end', resolve);
    });

    const expected0 = ['name', 'age', 'city'];

    const expected1 = ['rob', '30', 'Paris'];

    const expected2 = ['mike', '20', 'New York'];

    expect(fileContent.length).toStrictEqual(3);
    expect(fileContent[0]).toStrictEqual(expected0);
    expect(fileContent[1]).toStrictEqual(expected1);
    expect(fileContent[2]).toStrictEqual(expected2);
  });
});
