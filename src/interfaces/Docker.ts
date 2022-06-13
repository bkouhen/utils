export interface DockerBuildOptions {
  registry: string;
  scriptName: string;
  version: string;
  file?: string;
  context?: string;
}
