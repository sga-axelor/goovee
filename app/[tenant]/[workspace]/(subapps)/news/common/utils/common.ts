import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';
import moment from 'moment';

// ---- LOCAL IMPORTS ---- //
import type {Category} from '@/subapps/news/common/types';
import {TIME_UNITS} from '@/subapps/news/common/constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clone(obj: any) {
  return obj && JSON.parse(JSON.stringify(obj));
}

export function getPublishedLabel(dateString: any) {
  if (!dateString) {
    return null;
  }

  const dateMoment = moment(dateString);
  const now = moment();
  const timeDifference = now.diff(
    dateMoment,
    TIME_UNITS.MINUTES as moment.unitOfTime.DurationConstructor,
  );

  const units = [
    {unit: TIME_UNITS.MONTH, divisor: 24 * 60 * 30},
    {unit: TIME_UNITS.DAY, divisor: 24 * 60},
    {unit: TIME_UNITS.HOUR, divisor: 60},
    {unit: TIME_UNITS.MINUTE, divisor: 1},
  ];

  for (const {unit, divisor} of units) {
    if (timeDifference >= divisor) {
      const count = Math.floor(timeDifference / divisor);
      return `${count} ${unit}${count === 1 ? '' : 's'} ${TIME_UNITS.AGO}`;
    }
  }

  return TIME_UNITS.NOW;
}

export function getImageURL(id?: string | number) {
  if (!id) {
    return `/images/no-image.png`;
  }

  return `${process.env.NEXT_PUBLIC_URL}/api/image/${id}`;
}

export function getPageInfo({
  count = 0,
  limit,
  page,
}: {
  count?: number | string;
  limit?: number | string;
  page?: number | string;
}) {
  const pages = Math.ceil(Number(count) / Number(limit));

  return {
    count,
    limit,
    page,
    pages,
    hasNext: Number(page) < Number(pages),
    hasPrev: Number(page) > 1,
  };
}

export function getSkipInfo(limit?: string | number, page?: string | number) {
  return Number(limit) * Math.max(Number(page) - 1, 0);
}

export function parseDate(dateString: any) {
  const date = moment(dateString);
  const currentYear = moment().year();
  const dateYear = date.year();

  let formatString = 'MMMM Do';

  if (dateYear !== currentYear) {
    formatString += ', YYYY';
  }

  formatString += ', h:mm A';

  return date.format(formatString);
}

export function buildCategoryHierarchy(categories: any): Category[] {
  const categoryMap: {[id: number]: Category} = {};
  const rootCategories: Category[] = [];

  categories.forEach((category: Category) => {
    categoryMap[category.id] = {...category, childCategory: []};
  });

  categories.forEach((category: Category) => {
    if (category.parentCategory && category.parentCategory.id !== undefined) {
      const parent = categoryMap[category.parentCategory.id];
      if (parent) {
        parent.childCategory.push(categoryMap[category.id]);
      }
    } else {
      rootCategories.push(categoryMap[category.id]);
    }
  });

  return rootCategories;
}
