export interface ScriptConfiguration {
  absolutePath: string;
  scriptName: string;
  createDockerFiles?: boolean;
  installDependencies?: boolean;
  runNpmStart?: boolean;
}
