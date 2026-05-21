import {dayjs} from '@/locale';

// ---- CORE IMPORTS ---- //
import type {Category} from '@/types';

type OrmNewsCategory = {
  id: string | number;
  name: string;
  slug: string;
  parentCategory?: {id: string | number} | null;
  url?: string;
  items?: OrmNewsCategory[];
};

export function getFormatString({
  dateString,
  includeTime = true,
}: {
  dateString: string;
  includeTime: boolean | undefined;
}) {
  const date = dayjs(dateString);
  const currentYear = dayjs().year();
  const dateYear = date.year();

  let formatString = 'MMMM DD';

  if (dateYear !== currentYear) {
    formatString += ', YYYY';
  }
  if (includeTime) formatString += ', h:mm A';

  return formatString;
}

export function transformCategories(categories: OrmNewsCategory[]): Category[] {
  const groupedCategories: OrmNewsCategory[] = [];

  const categoryMap = new Map<string | number, OrmNewsCategory>();

  categories.forEach(category => {
    category.items = [];
    category.url = category.slug;
    categoryMap.set(category.id, category);
  });

  categoryMap.forEach(category => {
    const parentCategory = category.parentCategory;
    if (parentCategory) {
      const parent = categoryMap.get(parentCategory.id);
      if (parent) {
        category.url = `${parent.url}/${category.slug}`;
        if (!parent.items) {
          parent.items = [];
        }
        parent.items.push(category);
      }
    } else {
      groupedCategories.push(category);
    }
  });

  return groupedCategories as Category[];
}
export const getArchivedFilter = ({archived}: {archived: boolean}) => {
  return archived
    ? {archived: true}
    : {OR: [{archived: false}, {archived: null}]};
};
