import type {Column as TableColumn} from '@/ui/components/table-list/types';

export interface SelectionItem {
  value: string;
  title: string;
  order: number;
  color?: string;
}

export interface Column extends TableColumn {
  hidden?: boolean;
  order?: number;
  targetName?: string;
  selectionList?: SelectionItem[];
}
