import fs from 'fs-extra';
import path from 'path';
import { WinstonLogger } from '../Logger/interfaces';
import { generateNPMConfigFile } from './Config';

jest.setTimeout(20000);
const assetsPath = path.join(__dirname, 'assets');
const logger = { debug: jest.fn(), error: jest.fn(), warn: jest.fn(), info: jest.fn() } as unknown as WinstonLogger;

beforeAll(async () => {
  await fs.ensureDir(assetsPath);
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Generating files unit tests', () => {
  test('if package.json is correctly generated', async () => {
    const mockFilePath = path.join(assetsPath, 'package.json');
    const resultFilePath = path.join(assetsPath, 'package.json.gen');

    await generateNPMConfigFile(mockFilePath, resultFilePath);
  });
});
