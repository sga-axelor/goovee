/**
 * Tickets Utils
 */

import {Maybe} from '@/types/util';
import {getImageURL} from '@/utils/image';
import {ASSIGNMENT} from '../constants';

export const formatDate = (date: Maybe<Date | string>): string => {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
};

export function getProfilePic(id: Maybe<string>): string {
  if (!id) {
    return '/images/user.png';
  }
  return getImageURL(id);
}

export const getPages = (
  records: {_count?: string}[],
  limit: string | number,
): number => {
  const take = +limit;
  if (take === 0) return 1;
  const pages = Math.ceil(parseInt(records[0]?._count ?? '0') / take);
  return pages || 1;
};

const ELLIPSIS = '...' as const;
type Ellipsis = typeof ELLIPSIS;
export function getPaginationButtons({
  currentPage,
  totalPages,
  maxVisibleButtons = 5,
}: {
  currentPage: number;
  totalPages: number;
  maxVisibleButtons?: number;
}): (number | Ellipsis)[] {
  if (totalPages <= maxVisibleButtons) {
    return Array.from({length: totalPages}, (_, i) => i + 1);
  }

  const buttons: (number | Ellipsis)[] = [];
  // Check if the current page is near the beginning of the pagination
  if (currentPage <= Math.floor(maxVisibleButtons / 2) + 1) {
    // Display buttons for the beginning pages
    for (let i = 1; i <= maxVisibleButtons - 2; i++) {
      buttons.push(i);
    }
    // Add ellipsis and last page
    buttons.push(ELLIPSIS, totalPages);
  }
  // Check if the current page is near the end of the pagination
  else if (currentPage >= totalPages - Math.floor(maxVisibleButtons / 2)) {
    // Display the first page, and ellipsis
    buttons.push(1, ELLIPSIS);
    // Display buttons for the ending pages
    for (let i = totalPages - (maxVisibleButtons - 3); i <= totalPages; i++) {
      buttons.push(i);
    }
  }
  // If the current page is somewhere in the middle
  else {
    buttons.push(1, ELLIPSIS);
    // Display buttons for pages around the current page
    for (
      let i = currentPage - Math.floor(maxVisibleButtons / 2) + 2;
      i <= currentPage + Math.floor(maxVisibleButtons / 2) - 2;
      i++
    ) {
      buttons.push(i);
    }
    buttons.push(ELLIPSIS, totalPages);
  }
  return buttons;
}

export function isWithProvider(assignment: Maybe<number>): boolean {
  return assignment !== ASSIGNMENT.CUSTOMER;
}
