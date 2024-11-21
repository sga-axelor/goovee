import type {Category} from '@/types';

export const getcategoryids = (category: Category) => {
  if (!category) return [];

  let ids: Category['id'][] = [category.id];

  if (category?.items?.length) {
    ids = [...ids, ...category.items.map(getcategoryids).flat()];
  }

  return ids.flat();
};
