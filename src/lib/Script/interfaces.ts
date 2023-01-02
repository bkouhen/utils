export interface ScriptConfiguration {
  absolutePath: string;
  scriptName: string;
  override?: boolean;
  createDockerFiles?: boolean;
  installDependencies?: boolean;
  runNpmStart?: boolean;
}

export enum FileName {
  INDEX = 'index.ts',
  NPM = 'package.json',
  PRETTIER = '.prettierrc.js',
  EDITOR_CONFIG = '.editorconfig',
  JEST = 'jest.config.ts',
  TYPESCRIPT = 'tsconfig.json',
  DOCKERFILE = 'Dockerfile',
  DOCKER_COMPOSE = 'docker-compose.yml',
}

export interface NpmPackage {
  name: string;
  version?: string;
  description?: string;
  main?: string;
  author?: string;
  license?: string;
  private?: boolean;
  scripts?: Record<string, string>;
  devDependencies?: Record<string, string>;
  dependencies?: Record<string, string>;
}
