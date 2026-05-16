import type {Maybe} from '@/types/util';
import {defaultSortOption, sortOptions} from '../constants';
import {OrderByOptions} from '@goovee/orm';
import {AOSPartner} from '@/goovee/.generated/models';

export function getOrderBy(sort: Maybe<string>): OrderByOptions<AOSPartner> {
  return (sortOptions.find(o => o.value == sort) ?? defaultSortOption).orderBy;
}
