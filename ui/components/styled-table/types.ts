export type TableProps = {
  columns: any[];
  children: React.ReactNode;
  className?: string;
  headStyle?: string;
};

export type TableHeadProps = {
  columns: any[];
  className?: string;
};

export type TableBodyProps = {
  onClick?: () => void;
};
