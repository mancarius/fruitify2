export type QueryParams<T extends string = string> = {
  [K in T]?: string;
};