export type Maybe<T> = T | null | undefined;

export type Expand<T> = T extends (...args: infer A) => infer R
  ? (...args: Expand<A>) => Expand<R>
  : T extends infer O
    ? {[K in keyof O]: O[K]}
    : never;

export type ExpandRecursively<T> = T extends (...args: infer A) => infer R
  ? (...args: ExpandRecursively<A>) => ExpandRecursively<R>
  : T extends object
    ? T extends infer O
      ? {[K in keyof O]: ExpandRecursively<O[K]>}
      : never
    : T;

export type Merge<A, B> = {
  [K in keyof A | keyof B]: K extends keyof A & keyof B
    ? A[K] | B[K]
    : K extends keyof B
      ? B[K]
      : K extends keyof A
        ? A[K]
        : never;
};

export type KeyOf<T extends Iterable<any>> =
  T extends Iterable<infer E> ? E : never;

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type JSONPrimitive = string | number | boolean | null | undefined;

export type JSONValue =
  | JSONPrimitive
  | JSONValue[]
  | {
      [key: string]: JSONValue;
    };

export type NotAssignableToJson = bigint | symbol | Function;

export type Cloned<T> = T extends JSONValue
  ? T
  : T extends Date
    ? string
    : T extends NotAssignableToJson
      ? never
      : T extends object
        ? {[K in keyof T]: Cloned<T[K]>}
        : never;
