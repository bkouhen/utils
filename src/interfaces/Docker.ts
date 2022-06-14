export interface DockerBuildOptions {
  registry: string;
  scriptName: string;
  version: string;
  file?: string;
  context?: string;
}

export interface DockerPushOptions {
  registry: string;
  scriptName: string;
  version: string;
}
