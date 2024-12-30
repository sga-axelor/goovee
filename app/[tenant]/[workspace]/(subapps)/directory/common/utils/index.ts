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
