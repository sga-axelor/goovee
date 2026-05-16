import {Maybe} from '@/types/util';

import {ASSIGNMENT} from '../constants';

export function isWithProvider(assignment: Maybe<number>): boolean {
  return assignment !== ASSIGNMENT.CUSTOMER;
}
