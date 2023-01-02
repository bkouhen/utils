import fs from 'fs-extra';
import _ from 'lodash';
import path from 'path';
import { FileName, NpmPackage } from './interfaces';

const assetsPath = path.join(__dirname, 'assets');

export const generateConfigFile = async (
  fileName: FileName,
  resultDir: string,
  override?: { [key: string]: unknown },
): Promise<void> => {
  const mockFilePath = path.join(assetsPath, fileName);
  const resultFilePath = path.join(resultDir, fileName);

  switch (fileName) {
    case FileName.NPM:
      await generateNPMConfigFile(mockFilePath, resultFilePath, override);
      break;
    case FileName.JEST:
      await generateJestConfigFile(mockFilePath, resultFilePath, override);
      break;
    case FileName.INDEX:
    case FileName.EDITOR_CONFIG:
    case FileName.PRETTIER:
    case FileName.TYPESCRIPT:
    case FileName.DOCKER_COMPOSE:
    case FileName.DOCKERFILE:
      await generateStringConfigFile(mockFilePath, resultFilePath);
      break;
  }
};

export const generateNPMConfigFile = async (
  mockFilePath: string,
  resultFilePath: string,
  override?: { [key: string]: unknown },
): Promise<void> => {
  const mockFile = (await fs.readJSON(mockFilePath)) as NpmPackage;
  const content = _.merge(mockFile, override);
  await fs.writeJSON(resultFilePath, content, { spaces: 2, EOL: '\n', replacer: null });
};

export const generateJestConfigFile = async (
  mockFilePath: string,
  resultFilePath: string,
  override?: { name?: string },
): Promise<void> => {
  const mockFile = (await fs.readFile(mockFilePath)).toString();
  let content = mockFile;
  if (override?.name) {
    content = mockFile.replace('{{DISPLAY_NAME}}', override.name);
  }
  await fs.writeFile(resultFilePath, content);
};

export const generateStringConfigFile = async (mockFilePath: string, resultFilePath: string): Promise<void> => {
  const mockFile = (await fs.readFile(mockFilePath)).toString();
  let content = mockFile;
  await fs.writeFile(resultFilePath, content);
};
