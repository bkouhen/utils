import { fnPipe } from '../interfaces/Env';

export const env: fnPipe =
  (...funcs: Function[]) =>
  (variableName: string) => {
    try {
      const envVariable = process.env[variableName];
      if (!funcs.length) return envVariable;
      if (funcs.length === 1) return funcs[0](envVariable);

      return funcs.reduce(
        (prev: Function, curr: Function) =>
          (...args: any[]) =>
            curr(prev(...args)),
      )(envVariable);
    } catch (e) {
      throw new Error(`Error while parsing variable ${variableName}: ${e.message}`);
    }
  };
