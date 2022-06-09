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
  scripts?: JSONObject;
  devDependencies?: JSONObject;
  dependencies?: JSONObject;
}
