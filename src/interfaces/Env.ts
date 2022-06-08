export type Fn<A, R> = (val: A) => R;

export type InitialFn<R> = (val?: string) => R;

export interface fnPipe {
  //(): Fn<string, string | undefined>;
  <R>(...fns: Function[]): Fn<string, R>;
}
