import { Nullable } from "./nullable.type";

export type QueryParams<T extends string = string> = {
  [K in T]?: Nullable<string>;
};