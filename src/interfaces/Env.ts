export interface EnvParser {
  (): EnvTypeTransformer<string, string | undefined>;
  <T>(f1: EnvTransformer<T>): EnvTypeTransformer<string, T>;
  <A, T>(f1: EnvTransformer<A>, f2: EnvTypeTransformer<A, T>): EnvTypeTransformer<string, T>;
  <A, B, T>(f1: EnvTransformer<A>, f2: EnvTypeTransformer<A, B>, f3: EnvTypeTransformer<B, T>): EnvTypeTransformer<
    string,
    T
  >;
  <A, B, C, T>(
    f1: EnvTransformer<A>,
    f2: EnvTypeTransformer<A, B>,
    f3: EnvTypeTransformer<B, C>,
    f4: EnvTypeTransformer<C, T>,
  ): EnvTypeTransformer<string, T>;
  <T>(...functions: Function[]): EnvTypeTransformer<string, T>;
}

export interface EnvTypeTransformer<T, R> {
  (val: T): R;
}

export interface EnvTransformer<T> {
  (val?: string): T | undefined;
}

export interface EnvFormatter<T> {
  (val?: T): T;
}
