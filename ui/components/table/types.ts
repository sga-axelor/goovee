export type TableProps = {
  columns: any[];
  children: React.ReactNode;
};

export type TableHeadProps = {
  columns: any[];
};

export type TableBodyProps = {
  onClick?: () => void;
};
