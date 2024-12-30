import type {Maybe} from '@/types/util';
import {defaultSortOption, sortOptions} from '../constants';
import type {Tenant} from '@/lib/core/tenant';
import {getImageURL} from '@/utils/files';

export function getOrderBy(sort: Maybe<string>): Record<string, any> {
  return (sortOptions.find(o => o.value == sort) ?? defaultSortOption).orderBy;
}

export function getProfilePic(
  id: string | undefined,
  tenantId: Tenant['id'],
): string {
  return getImageURL(id, tenantId, {
    noimage: true,
    noimageSrc: '/images/user.png',
  });
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

export const getSkip = (
  limit: string | number,
  page: string | number,
): number => {
  page = +page || 1;
  return (page - 1) * +limit;
};
