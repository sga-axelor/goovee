import {Expand} from './util';

export type SortParam = {
  sort?: string | undefined;
};
export type PaginationParam = {
  page?: string | undefined;
  limit?: string | undefined;
};

export type FilterParam<T extends string> = Partial<Record<T, string>>;

export type SearchParams<T extends string = string> = Expand<
  SortParam & PaginationParam & FilterParam<T>
>;
