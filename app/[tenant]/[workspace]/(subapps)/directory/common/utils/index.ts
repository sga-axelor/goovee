import type {Maybe} from '@/types/util';
import {defaultSortOption, sortOptions} from '../constants';

export function getOrderBy(sort: Maybe<string>): Record<string, any> {
  return (sortOptions.find(o => o.value == sort) ?? defaultSortOption).orderBy;
}
