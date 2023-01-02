import fs from 'fs-extra';
import path from 'path';
import { generateJestConfigFile, generateNPMConfigFile } from '../Config';

const assetsPath = path.join(__dirname, '../assets');
const resourcesPath = path.join(__dirname, 'resources');

describe('Generating files unit tests', () => {
  test('if jest.config.ts is correctly generated', async () => {
    const mockFilePath = path.join(assetsPath, 'jest.config.ts');
    const resultFilePath = path.join(resourcesPath, 'jest.config.ts.gen');
    const cmpFile = path.join(resourcesPath, 'jest.config.ts');

    await generateJestConfigFile(mockFilePath, resultFilePath, { name: 'TEST' });
    expect(fs.readFileSync(resultFilePath).toString()).toStrictEqual(fs.readFileSync(cmpFile).toString());

    await fs.remove(resultFilePath);
  });

  test('if .prettierrc.js is correctly generated', async () => {
    const mockFilePath = path.join(assetsPath, '.prettierrc.js');
    const resultFilePath = path.join(resourcesPath, '.prettierrc.js.gen');
    const cmpFile = path.join(resourcesPath, '.prettierrc.js');

    await generateJestConfigFile(mockFilePath, resultFilePath);
    expect(fs.readFileSync(resultFilePath).toString()).toStrictEqual(fs.readFileSync(cmpFile).toString());

    await fs.remove(resultFilePath);
  });

  test('if .editorconfig is correctly generated', async () => {
    const mockFilePath = path.join(assetsPath, '.editorconfig');
    const resultFilePath = path.join(resourcesPath, '.editorconfig.gen');
    const cmpFile = path.join(resourcesPath, '.editorconfig');

    await generateJestConfigFile(mockFilePath, resultFilePath);
    expect(fs.readFileSync(resultFilePath).toString()).toStrictEqual(fs.readFileSync(cmpFile).toString());

    await fs.remove(resultFilePath);
  });

  test('if tsconfig.json is correctly generated', async () => {
    const mockFilePath = path.join(assetsPath, 'tsconfig.json');
    const resultFilePath = path.join(resourcesPath, 'tsconfig.json.gen');
    const cmpFile = path.join(resourcesPath, 'tsconfig.json');

    await generateJestConfigFile(mockFilePath, resultFilePath);
    expect(fs.readFileSync(resultFilePath).toString()).toStrictEqual(fs.readFileSync(cmpFile).toString());

    await fs.remove(resultFilePath);
  });

  test('if index.ts is correctly generated', async () => {
    const mockFilePath = path.join(assetsPath, 'index.ts');
    const resultFilePath = path.join(resourcesPath, 'index.ts.gen');
    const cmpFile = path.join(resourcesPath, 'index.ts');

    await generateJestConfigFile(mockFilePath, resultFilePath);
    expect(fs.readFileSync(resultFilePath).toString()).toStrictEqual(fs.readFileSync(cmpFile).toString());

    await fs.remove(resultFilePath);
  });

  test('if Dockerfile is correctly generated', async () => {
    const mockFilePath = path.join(assetsPath, 'Dockerfile');
    const resultFilePath = path.join(resourcesPath, 'Dockerfile.gen');
    const cmpFile = path.join(resourcesPath, 'Dockerfile');

    await generateJestConfigFile(mockFilePath, resultFilePath);
    expect(fs.readFileSync(resultFilePath).toString()).toStrictEqual(fs.readFileSync(cmpFile).toString());

    await fs.remove(resultFilePath);
  });

  test('if docker-compose.yml is correctly generated', async () => {
    const mockFilePath = path.join(assetsPath, 'docker-compose.yml');
    const resultFilePath = path.join(resourcesPath, 'docker-compose.yml.gen');
    const cmpFile = path.join(resourcesPath, 'docker-compose.yml');

    await generateJestConfigFile(mockFilePath, resultFilePath);
    expect(fs.readFileSync(resultFilePath).toString()).toStrictEqual(fs.readFileSync(cmpFile).toString());

    await fs.remove(resultFilePath);
  });

  test('if package.json is correctly generated', async () => {
    const mockFilePath = path.join(assetsPath, 'package.json');
    const resultFilePath = path.join(resourcesPath, 'package.json.gen');
    const cmpFile = path.join(resourcesPath, 'package.json');

    await generateNPMConfigFile(mockFilePath, resultFilePath, { name: 'TEST' });
    expect(fs.readFileSync(resultFilePath).toString()).toStrictEqual(fs.readFileSync(cmpFile).toString());

    await fs.remove(resultFilePath);
  });

  test('if package.json is correctly generated with full override', async () => {
    const mockFilePath = path.join(assetsPath, 'package.json');
    const resultFilePath = path.join(resourcesPath, 'package2.json.gen');
    const cmpFile = path.join(resourcesPath, 'package2.json');

    const override = {
      name: 'TEST2',
      version: '0.0.2',
      description: 'No description provided MODIFIED',
      author: 'MODIFIED',
      main: 'dist/index.js MODIFIED',
      private: false,
      license: 'ISC MODIFIED',
      scripts: {
        test: 'jest',
        'test:watch': 'jest --watchAll',
        'test:coverage': 'jest --coverage',
        'test:docker': 'docker-compose run --rm test',
        clean: 'rm -rf node_modules dist',
        build: 'tsc',
        watch: 'tsc -w',
        start: 'tsc && node ./dist/index.js',
        'start:dev': 'ts-node ./src/index.ts',
        'start:docker': 'docker-compose run --rm script',
      },
      devDependencies: {
        '@types/jest': '29.2.4',
        '@types/node': '18.11.18',
        jest: '29.3.1',
        'ts-jest': '29.0.3',
        'ts-node': '10.9.1',
        typescript: '4.9.4',
      },
      dependencies: {
        '@types/jest': '29.2.4',
        '@types/node': '18.11.18',
        jest: '29.3.1',
        'ts-jest': '29.0.3',
        'ts-node': '10.9.1',
        typescript: '4.9.4',
      },
    };

    await generateNPMConfigFile(mockFilePath, resultFilePath, override);
    expect(fs.readFileSync(resultFilePath).toString()).toStrictEqual(fs.readFileSync(cmpFile).toString());

    await fs.remove(resultFilePath);
  });
});
