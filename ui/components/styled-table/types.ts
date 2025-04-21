export type TableProps = {
  columns: any[];
  children: React.ReactNode;
  className?: string;
  headStyle?: string;
};

export interface TableHeadProps {
  columns: Array<{
    key: string;
    label: string;
    align?: 'left' | 'center' | 'right';
  }>;
  className?: string;
}

export type TableBodyProps = {
  onClick?: () => void;
};
