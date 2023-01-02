export interface JSONObject {
  [key: string]: string;
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
