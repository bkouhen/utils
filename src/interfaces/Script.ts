export interface ScriptConfiguration {
  absolutePath: string;
  scriptName: string;
  createDockerFiles?: boolean;
  installDependencies?: boolean;
  runNpmStart?: boolean;
}

export enum FileName {
  INDEX = 'index.ts',
  NPM = 'package.json',
  PRETTIER = '.prettierrc.js',
  EDITOR_CONFIG = '.editorconfig',
  JEST = 'jest.config.js',
  TYPESCRIPT = 'tsconfig.json',
  DOCKERFILE = 'Dockerfile',
  DOCKER_COMPOSE = 'docker-compose.yml',
}
