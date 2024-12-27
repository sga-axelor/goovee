import type {Maybe} from '@/types/util';
import {orderByMap} from '../constants';

export function getOrderBy(sort: Maybe<string>): Record<string, any> {
  return orderByMap[sort ?? 'a-z'] || orderByMap['a-z'];
}
