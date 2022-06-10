import path from 'path';
import fs from 'fs-extra';
import { fileWriter, csvFormatter, csvParser, fileReader } from '../../../helpers/file/streamHelper/streamHelper';

const assetsPath = path.join(__dirname, '/../../assets');

beforeAll(() => {
  fs.ensureDirSync(assetsPath);
});

afterAll(async () => {
  fs.remove(`${assetsPath}/writecsv.csv`, (error) => {
    if (error) {
      console.log(error);
    }
  });
});

describe('Csv Formatter Test', () => {
  test('if parsing and formatting is correct', async () => {
    const reader = fileReader({ absolutePath: `${assetsPath}/sample.csv` });
    const writer = fileWriter({ absolutePath: `${assetsPath}/writecsv.csv` });
    const parser = csvParser({ delimiter: ',', headers: true });
    const formatter = csvFormatter({ delimiter: ';', headers: true });

    await new Promise((resolve) => {
      reader.pipe(parser).pipe(formatter).pipe(writer).on('finish', resolve);
    });

    const csv = csvParser({ delimiter: ';', headers: false });
    const readable = fs.createReadStream(`${assetsPath}/writecsv.csv`);

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
