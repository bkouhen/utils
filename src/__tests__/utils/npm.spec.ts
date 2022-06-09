import { generateJSONPackageFile } from '../../utils/npm';
import path from 'path';
import util from 'util';
import fs from 'fs-extra';
import { NpmPackage } from '../../interfaces/Npm';

const pRemove = util.promisify(fs.remove);
const assetsPath = path.join(__dirname, '/../assets');

beforeAll(() => {
  fs.ensureDirSync(assetsPath);
});

afterAll(async () => {
  await pRemove(`${assetsPath}/package.json.gen`);
});

describe('JSON Package tests', () => {
  test('if package.json is correctly generated', async () => {
    const generatedFilePath = `${assetsPath}/package.json.gen`;
    const baseFilePath = `${assetsPath}/package.json`;

    const npmPackage: NpmPackage = {
      name: 'script_name',
    };

    await generateJSONPackageFile(generatedFilePath, npmPackage);
    expect(JSON.parse(fs.readFileSync(generatedFilePath).toString())).toStrictEqual(
      JSON.parse(fs.readFileSync(baseFilePath).toString()),
    );
  });
});
