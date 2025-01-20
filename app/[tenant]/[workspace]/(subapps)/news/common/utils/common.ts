import {dayjs} from '@/locale';

export function getFormatString(dateString: any) {
  const date = dayjs(dateString);
  const currentYear = dayjs().year();
  const dateYear = date.year();

  let formatString = 'MMMM DD';

  if (dateYear !== currentYear) {
    formatString += ', YYYY';
  }

  formatString += ', h:mm A';

  return formatString;
}

export function transformCategories(categories: any[]): any[] {
  const groupedCategories: any[] = [];

  const categoryMap = new Map<string, any>();

  categories.forEach((category: any) => {
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

  return groupedCategories;
}
