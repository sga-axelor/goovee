import {Maybe} from '@/types/util';

import {ASSIGNMENT} from '../constants';

export function getProfilePic(
  id: Maybe<string>,
  tenantId: Tenant['id'],
): string {
  if (!id) {
    return '/images/user.png';
  }

  return getImageURL(id, tenantId!);
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

export function isWithProvider(assignment: Maybe<number>): boolean {
  return assignment !== ASSIGNMENT.CUSTOMER;
}
