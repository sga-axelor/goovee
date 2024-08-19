type Column = {
  key: string;
  label: string;
  orderBy?: (dir: 'ASC' | 'DESC') => Record<string, any>;
};
