import type {Column} from './types';

export const sortColumns = (items: Column[]): Column[] => {
  return items
    .map((_c, idx) => ({
      ..._c,
      hidden: _c.hidden ?? false,
      order: _c.order ?? idx * 10,
    }))
    .filter(_c => !_c.hidden)
    .sort((a, b) => a.order - b.order);
};
