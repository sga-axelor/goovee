import type {Column as TableColumn} from '@/ui/components/table-list/types';

export interface Column extends TableColumn {
  hidden?: boolean;
  order?: number;
}
