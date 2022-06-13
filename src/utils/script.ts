import fs from 'fs-extra';
import { generateJSONPackageFile } from './npm';
import { generateDockerComposeFile, generateDockerFile } from './docker';
import { ScriptConfiguration, FileName } from '../interfaces/Script';
import { spawnSync } from './process';
import { WinstonLogger } from '../interfaces/Logger';

export class Script {
  private config: ScriptConfiguration;
  private logger?: WinstonLogger;

  constructor(config: ScriptConfiguration, logger?: WinstonLogger) {
    this.config = {
      ...config,
      createDockerFiles: config.createDockerFiles ?? true,
      installDependencies: config.installDependencies ?? true,
      runNpmStart: config.runNpmStart ?? true,
    };
    this.logger = logger;
  }

  public async generateScript(): Promise<void> {
    if (!this.config) return;

    const scriptDir = `${this.config.absolutePath}/${this.config.scriptName}`;
    const srcDir = `${scriptDir}/src`;
    const testDir = `${srcDir}/__tests__`;

    const scriptDirExists = await fs.pathExists(scriptDir);

    if (scriptDirExists) {
      this.logger?.error('Script name already taken, please choose another one');
      throw new Error('Script name already taken, please choose another one');
    }

    await fs.ensureDir(scriptDir);
    await fs.ensureDir(srcDir);
    await fs.ensureDir(testDir);

    await generateJSONPackageFile(`${scriptDir}/package.json`, { name: this.config.scriptName });
    await generatePrettierFile(`${scriptDir}/.prettierrc.js`);
    await generateEditorConfigFile(`${scriptDir}/.editorconfig`);
    await generateIndexFile(`${srcDir}/index.ts`);
    await generateJestConfigFile(`${scriptDir}/jest.config.js`, this.config.scriptName);
    await generateTypescriptConfigFile(`${scriptDir}/tsconfig.json`);

    if (this.config.createDockerFiles) {
      await generateDockerFile(`${scriptDir}/Dockerfile`);
      await generateDockerComposeFile(`${scriptDir}/docker-compose.yml`);
    }

    if (this.config.installDependencies) {
      this.installDependencies(scriptDir);

      if (this.config.runNpmStart) {
        this.runNpmStart(scriptDir);
      }
    }
  }

  public installDependencies(scriptDir: string): { output: string; code: number } {
    try {
      const installDeps = spawnSync(`npm install --prefix ${scriptDir}`);
      const stdout = installDeps.stdout?.toString();
      const stderr = installDeps.stderr?.toString();
      const exitCode = installDeps.status;
      if (exitCode === 0) {
        this.logger?.info('npm packages successfully installed!');
        this.logger?.info(stdout);
      } else {
        this.logger?.error(`there was an issue while installing npm packages: ${stderr}`);
      }
      return exitCode === 0 ? { output: stdout, code: exitCode } : { output: stderr, code: exitCode || 1 };
    } catch (e) {
      this.logger?.error(`Process could not be spawned: ${e.message}`);
      return { output: e.message, code: 1 };
    }
  }

  public runNpmStart(scriptDir: string): { output: string; code: number } {
    try {
      const npmStart = spawnSync(`npm run start:dev --prefix ${scriptDir}`);
      const stdout = npmStart.stdout?.toString();
      const stderr = npmStart.stderr?.toString();
      const exitCode = npmStart.status;
      if (exitCode === 0) {
        this.logger?.info('npm start command succeeded');
        this.logger?.info(stdout);
      } else {
        this.logger?.error(`there was an issue while starting the application: ${stderr}`);
      }
      return exitCode === 0 ? { output: stdout, code: exitCode } : { output: stderr, code: exitCode || 1 };
    } catch (e) {
      this.logger?.error(`Process could not be spawned: ${e.message}`);
      return { output: e.message, code: 1 };
    }
  }
}

export const generateFile = (scriptDir:string, fileName: FileName) => {
  if (fileName === FileName.DOCKERFILE) {

  }
}

export const generatePrettierFile = async (filePath: string): Promise<void> => {
  const content = `module.exports = {
  semi: true,
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 120,
  tabWidth: 2,
};
`;
  await fs.writeFile(filePath, content);
};

export const generateEditorConfigFile = async (filePath: string): Promise<void> => {
  const content = `# EditorConfig is awesome: http://EditorConfig.org

# top-most EditorConfig file
root = true

# Unix-style newlines with a newline ending every file
[*]
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2
charset = utf-8
trim_trailing_whitespace = true

# Indentation override for all JS under lib directory
[**.{js,ts}]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true


[{package.json}]
indent_style = space
indent_size = 2

[*.md]
trim_trailing_whitespace = false
`;
  await fs.writeFile(filePath, content);
};

export const generateJestConfigFile = async (filePath: string, name: string): Promise<void> => {
  const content = `// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  displayName: '${name.toUpperCase()}',
  clearMocks: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageProvider: 'v8',
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  testPathIgnorePatterns: ['/node_modules/'],
};
`;
  await fs.writeFile(filePath, content);
};

export const generateIndexFile = async (filePath: string): Promise<void> => {
  const content = `const start = async () => {
  console.log('Starting script');
};

start().then(() => {
  console.log('Script has successfully ended');
});
`;
  await fs.writeFile(filePath, content);
};

export const generateTypescriptConfigFile = async (filePath: string): Promise<void> => {
  const tsConfig = {
    compilerOptions: {
      lib: ['es6'],
      noImplicitAny: true,
      strictNullChecks: true,
      baseUrl: '.',
      paths: {},
      moduleResolution: 'Node',
      esModuleInterop: true,
      module: 'commonjs',
      target: 'es6',
      sourceMap: true,
      alwaysStrict: true,
      rootDir: './src',
      typeRoots: ['node_modules/@types'],
      outDir: './dist',
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
      declaration: true,
      resolveJsonModule: true,
      skipLibCheck: true,
    },
    include: ['./src/**/*'],
    exclude: ['./node_modules/', './src/__tests__'],
  };
  await fs.writeJSON(filePath, tsConfig, { spaces: 2, replacer: null });
};
