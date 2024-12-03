import type {SortType} from '@/ui/hooks/use-sort-by';
import type {ReactNode} from 'react';

export type Getter = (record: any) => ReactNode;

export type Column = {
  key: string;
  content: (record: any) => ReactNode;
  label?: ReactNode;
  mobile?: boolean;
  getter?: Getter;
  type?: SortType;
  sortable?: boolean;
};

export type SortState = {
  key: string | null;
  direction: 'ASC' | 'DESC';
};
