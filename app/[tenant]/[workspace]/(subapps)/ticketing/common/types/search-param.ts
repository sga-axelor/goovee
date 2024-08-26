import {Expand} from '@/types/util';

export type SortParams = {
  sort?: string | undefined;
};

export type PageParams = {
  page?: string | undefined;
  limit?: string | undefined;
};

export type FilterParams<T extends string> = Partial<Record<T, string>>;

export type SearchParams<T extends string = string> = Expand<
  SortParams & PageParams & FilterParams<T>
>;
