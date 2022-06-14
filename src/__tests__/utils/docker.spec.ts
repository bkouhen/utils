import { generateDockerFile, generateDockerComposeFile, buildDockerImage, pushDockerImage } from '../../utils/docker';
import path from 'path';
import util from 'util';
import fs from 'fs-extra';

const pRemove = util.promisify(fs.remove);
const assetsPath = path.join(__dirname, '/../assets');

jest.setTimeout(20000);

beforeAll(() => {
  fs.ensureDirSync(assetsPath);
  jest.spyOn(console, 'log').mockImplementation(jest.fn());
  jest.spyOn(console, 'error').mockImplementation(jest.fn());
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
      buildDockerImage({ registry: 'test', scriptName: 'testScript', version: '1.0.0' }),
    ).rejects.toThrowError(/Spawned Build Process exited with code:/);
  });

  test('if Docker Image Build succeeds', async () => {
    await expect(
      buildDockerImage({
        registry: 'bkouhen',
        scriptName: 'testScript',
        version: '1.0.0',
        file: `${assetsPath}/Dockerfile.build`,
        context: `${assetsPath}`,
      }),
    ).resolves.toStrictEqual('Spawned Build Process exited with code: 0');
  });
});

describe('Docker Image Push tests', () => {
  test('if Docker Image Push throws when wrong parameters', async () => {
    await expect(
      pushDockerImage({ registry: 'bkouhen', scriptName: 'nonExistantImage', version: '1.0.0' }),
    ).rejects.toThrowError(/Spawned Push Process exited with code:/);
  });

  test('if Docker Image Push succeeds', async () => {
    await expect(
      pushDockerImage({ registry: 'bkouhen', scriptName: 'testScript', version: '1.0.0' }),
    ).resolves.toStrictEqual('Spawned Push Process exited with code: 0');
  });
});
