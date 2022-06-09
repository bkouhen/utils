import { EnvParser } from '../interfaces/Env';

export const env: EnvParser =
  (...functions: Function[]) =>
  (varName: string) => {
    try {
      const pEnv = process.env[varName];
      if (!functions.length) return pEnv;
      if (functions.length === 1) return functions[0](pEnv);

      return functions.reduce((prev: Function, curr: Function) => {
        return (...args: any[]) => {
          return prev(curr(...args));
        };
      })(pEnv);
    } catch (e) {
      throw new Error(`Error while parsing variable ${varName}: ${e.message}`);
    }
  };
