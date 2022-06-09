import fs from 'fs-extra';
import { generateJSONPackageFile } from './npm';
import { generateDockerComposeFile, generateDockerFile } from './docker';
import { ScriptConfiguration } from '../interfaces/Script';
import { pExec } from './process';
import { WinstonLogger } from 'src/interfaces';

export class Script {
  private config: ScriptConfiguration;
  private logger?: WinstonLogger;

  constructor(config: ScriptConfiguration, logger?: WinstonLogger) {
    this.config = {
      ...config,
      createDockerFiles: config.createDockerFiles ?? true,
      installDependencies: config.installDependencies ?? true,
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
      return;
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

    if (this.config.installDependencies) await pExec(`cd ${scriptDir}; npm i`);

    if (this.config.createDockerFiles) {
      await generateDockerFile(`${scriptDir}/Dockerfile`);
      await generateDockerComposeFile(`${scriptDir}/docker-compose.yml`);
    }
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
