import { generateDockerFile, generateDockerComposeFile, builDockerImage } from '../../utils/docker';
import path from 'path';
import util from 'util';
import fs from 'fs-extra';

const pRemove = util.promisify(fs.remove);
const assetsPath = path.join(__dirname, '/../assets');

beforeAll(() => {
  fs.ensureDirSync(assetsPath);
});

afterAll(async () => {
  await pRemove(`${assetsPath}/Dockerfile.gen`);
  await pRemove(`${assetsPath}/docker-compose.yml.gen`);
});

describe('Dockerfile tests', () => {
  test('if Dockerfile is correctly generated', async () => {
    const generatedFilePath = `${assetsPath}/Dockerfile.gen`;
    const baseFilePath = `${assetsPath}/Dockerfile`;

    await generateDockerFile(generatedFilePath);
    expect(fs.readFileSync(generatedFilePath).toString()).toStrictEqual(fs.readFileSync(baseFilePath).toString());
  });
});

describe('Docker Compose file tests', () => {
  test('if Docker Compose file is correctly generated', async () => {
    const generatedFilePath = `${assetsPath}/docker-compose.yml.gen`;
    const baseFilePath = `${assetsPath}/docker-compose.yml`;

    await generateDockerComposeFile(generatedFilePath);
    expect(fs.readFileSync(generatedFilePath).toString()).toStrictEqual(fs.readFileSync(baseFilePath).toString());
  });
});

describe('Docker Image Build tests', () => {
  test('if Docker Image Build throws when wrong parameters', async () => {
    await expect(
      builDockerImage({ registry: 'test', scriptName: 'testScript', version: '1.0.0' }),
    ).rejects.toThrowError();
    await expect(Promise.reject(new Error('octopus'))).rejects.toThrow('octopus');
  });
});
