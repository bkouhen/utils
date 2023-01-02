import fs from 'fs-extra';
import path from 'path';
import util from 'util';
import { WinstonLogger } from '../../interfaces/Logger';
import { ScriptConfiguration } from '../../interfaces/Script';
import { Script } from '../../utils/script';

jest.setTimeout(20000);

const pRemove = util.promisify(fs.remove);
const assetsPath = path.join(__dirname, '/../assets');

beforeEach(() => {
  jest.clearAllMocks();
});

const logger = { debug: jest.fn(), error: jest.fn(), warn: jest.fn(), info: jest.fn() } as unknown as WinstonLogger;

beforeAll(() => {
  fs.ensureDirSync(assetsPath);
});

afterAll(async () => {
  await pRemove(`${assetsPath}/.prettierrc.js.gen`);
  await pRemove(`${assetsPath}/.editorconfig.gen`);
  await pRemove(`${assetsPath}/index.ts.gen`);
  await pRemove(`${assetsPath}/jest.config.js.gen`);
  await pRemove(`${assetsPath}/tsconfig.json.gen`);
  await pRemove(`${assetsPath}/new_script`);
  await pRemove(`${assetsPath}/new_script2`);
  await pRemove(`${assetsPath}/non_existant_dir`);
});

describe('Generating new script tests', () => {
  test('if Script is correctly generated', async () => {
    const config: ScriptConfiguration = {
      absolutePath: assetsPath,
      scriptName: 'new_script',
      createDockerFiles: true,
      installDependencies: false,
    };
    await new Script(config, logger).generateScript();
    await expect(fs.pathExists(`${assetsPath}/new_script`)).resolves.toStrictEqual(true);
    await expect(fs.pathExists(`${assetsPath}/new_script/src`)).resolves.toStrictEqual(true);
    await expect(fs.pathExists(`${assetsPath}/new_script/src/__tests__`)).resolves.toStrictEqual(true);
    await expect(fs.pathExists(`${assetsPath}/new_script/src/index.ts`)).resolves.toStrictEqual(true);
    await expect(fs.pathExists(`${assetsPath}/new_script/.prettierrc.js`)).resolves.toStrictEqual(true);
    await expect(fs.pathExists(`${assetsPath}/new_script/.editorconfig`)).resolves.toStrictEqual(true);
    await expect(fs.pathExists(`${assetsPath}/new_script/jest.config.js`)).resolves.toStrictEqual(true);
    await expect(fs.pathExists(`${assetsPath}/new_script/tsconfig.json`)).resolves.toStrictEqual(true);
    await expect(fs.pathExists(`${assetsPath}/new_script/package.json`)).resolves.toStrictEqual(true);
    await expect(fs.pathExists(`${assetsPath}/new_script/Dockerfile`)).resolves.toStrictEqual(true);
    await expect(fs.pathExists(`${assetsPath}/new_script/docker-compose.yml`)).resolves.toStrictEqual(true);
    await expect(new Script(config, logger).generateScript()).rejects.toThrowError(
      'Script name already taken, please choose another one',
    );
    expect(logger.error).toBeCalledTimes(1);
  });

  test('if Script is correctly generated when no input is given', async () => {
    const config: ScriptConfiguration = {
      absolutePath: assetsPath,
      scriptName: 'new_script2',
      installDependencies: false,
    };
    await new Script(config, logger).generateScript();
    await expect(fs.pathExists(`${assetsPath}/new_script2`)).resolves.toStrictEqual(true);
    await expect(fs.pathExists(`${assetsPath}/new_script2/src`)).resolves.toStrictEqual(true);
    await expect(fs.pathExists(`${assetsPath}/new_script2/src/__tests__`)).resolves.toStrictEqual(true);
    expect(logger.error).toBeCalledTimes(0);
  });

  test('if Script installDependencies returns an error when npm install fails', async () => {
    const config: ScriptConfiguration = {
      absolutePath: assetsPath,
      scriptName: 'new_script3',
      installDependencies: true,
    };
    const script = new Script(config, logger);
    const cmdResult = script.installDependencies(`${assetsPath}/non_existant_dir`);
    expect(cmdResult.code).not.toStrictEqual(0);
    expect(logger.error).toBeCalledTimes(1);
  });

  test('if Script installDependencies returns a correct exit code when npm install succeeds', async () => {
    const config: ScriptConfiguration = {
      absolutePath: assetsPath,
      scriptName: 'new_script2',
      installDependencies: true,
    };
    const script = new Script(config, logger);
    const cmdResult = script.installDependencies(`${assetsPath}/new_script2`);
    expect(cmdResult.code).toStrictEqual(0);
    expect(logger.info).toBeCalledTimes(2);
  });

  test('if Script runNpmStart returns an error when npm run start:dev fails', async () => {
    const config: ScriptConfiguration = {
      absolutePath: assetsPath,
      scriptName: 'new_script3',
      installDependencies: true,
    };
    const script = new Script(config, logger);
    const cmdResult = script.runNpmStart(`${assetsPath}/non_existant_dir`);
    expect(cmdResult.code).not.toStrictEqual(0);
    expect(logger.error).toBeCalledTimes(1);
  });

  test('if Script installDependencies returns a correct exit code when npm run start:dev succeeds', async () => {
    const config: ScriptConfiguration = {
      absolutePath: assetsPath,
      scriptName: 'new_script2',
      installDependencies: true,
    };
    const script = new Script(config, logger);
    const cmdResult = script.runNpmStart(`${assetsPath}/new_script2`);
    expect(cmdResult.code).toStrictEqual(0);
    expect(logger.info).toBeCalledTimes(2);
  });
});
