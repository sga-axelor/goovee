import {ORDER_BY} from '@/constants';
import {Maybe} from '@/types/util';
import {set} from 'lodash';

export type Operator =
  | 'eq'
  | 'ne'
  | 'gt'
  | 'lt'
  | 'le'
  | 'li'
  | 'notLike'
  | 'between'
  | 'notBetween'
  | 'in'
  | 'notIn';

const OPERATORS: Operator[] = [
  'eq',
  'ne',
  'gt',
  'lt',
  'le',
  'li',
  'notLike',
  'between',
  'notBetween',
  'in',
  'notIn',
];

const SEPARATOR = {
  OPERATOR: ' ',
  VALUE: ',',
};

export function getOrderBy(
  sort: Maybe<string>,
  sortMap: Record<string, string>,
) {
  if (!sort) return null;
  const [key, direction] = decodeSortValue(sort);
  if (!key) return null;
  const path = sortMap[key];
  if (!path) return null;
  const query = set({}, path, direction);
  return query;
}

export function getWhere(
  filterParams: Record<string, string | undefined>,
  filterMap: Record<string, string>,
) {
  const where = Object.entries(filterParams).reduce<Maybe<Record<any, any>>>(
    (acc, [key, value]) => {
      if (!value) return acc;
      const path = filterMap[key];
      if (!path) return acc;
      const [operator, query] = decodeFilterValue(value);
      if (!operator || !query) return acc;
      const clause = set(acc ?? {}, path, {[operator]: query});
      return clause;
    },
    null,
  );
  return where;
}

export const getSkip = (
  limit: string | number,
  page: string | number,
): number => {
  page = +page || 1;
  return (page - 1) * +limit;
};

export function decodeSortValue(
  sort: Maybe<string>,
): [string | null, 'ASC' | 'DESC'] {
  if (!sort) return [null, ORDER_BY.ASC];
  const [key, _direction] = sort.split(SEPARATOR.OPERATOR, 2);
  const direction = _direction === ORDER_BY.DESC ? ORDER_BY.DESC : ORDER_BY.ASC; // take ascending as defualt direction
  return [key, direction];
}

export function encodeSortValue(
  key: string,
  direction: 'ASC' | 'DESC' = 'ASC',
): string {
  return [key, direction].join(SEPARATOR.OPERATOR);
}

export function decodeFilterParams<
  T extends Record<string, string | undefined>,
>(filterParams: T): Record<keyof T, any> {
  return Object.entries(filterParams).reduce<Record<keyof T, any>>(
    (acc, [key, value]: [keyof T, string | undefined]) => {
      const [op, decodedValue] = decodeFilterValue(value);
      if (decodedValue) {
        acc[key] = decodedValue;
      }
      return acc;
    },
    {} as T,
  );
}

export function decodeFilterValue(
  valueString: Maybe<string>,
): [string | null, Maybe<string | string[]>] {
  if (!valueString) return [null, null];
  const [operator, value] = valueString.split(SEPARATOR.OPERATOR);
  if (!operator) return [null, null];
  if (!(OPERATORS as string[]).includes(operator) || value == null) {
    return [null, null];
  }

  if (['between', 'notBetween'].includes(operator)) {
    const [from, to] = value.split(SEPARATOR.VALUE, 2);
    return [operator, makeBetweenQuery(from, to)];
  }
  if (['in', 'notIn'].includes(operator)) {
    const values = value.split(SEPARATOR.VALUE);
    return [operator, values.filter(v => v != null)];
  }
  return [operator, value];
}

function makeBetweenQuery(
  first: Maybe<string>,
  second: Maybe<string>,
): Maybe<[string, string]> {
  if (first == null || second == null) return;

  if (isNumber(first) && isNumber(second)) {
    const query: [string, string] = [first, second];
    if (Number(first) > Number(second)) query.reverse();
    return query;
  }

  if (isDate(first) && isDate(second)) {
    const query: [string, string] = [first, second];
    const firstTime = new Date(first).getTime();
    const secondTime = new Date(second).getTime();
    if (firstTime > secondTime) query.reverse();
    return query;
  }

  function isNumber(value: Maybe<string | number>): boolean {
    if (value == null) return false;
    value = Number(value);
    return !isNaN(value);
  }

  function isDate(value: Maybe<Date | string>): boolean {
    if (value == null) return false;
    value = new Date(value);
    return !isNaN(value.getTime());
  }
}

export function encodeFilterValue<T extends Operator>(
  operator: T,
  value: T extends 'between' | 'notBetween' | 'in' | 'notIn'
    ? Maybe<string | number>[]
    : Maybe<string | number>,
): string {
  if (value == null || !OPERATORS.includes(operator)) return '';
  if (['between', 'notBetween'].includes(operator)) {
    if (!Array.isArray(value)) return '';
    if (value.length < 2) return '';
    const valueString = [value[0], value[1]].join(SEPARATOR.VALUE);
    return operator.concat(SEPARATOR.OPERATOR).concat(valueString);
  }
  if (['in', 'notIn'].includes(operator)) {
    if (!Array.isArray(value)) return '';
    const valueString = value.join(SEPARATOR.VALUE);
    return operator.concat(SEPARATOR.OPERATOR).concat(valueString);
  }
  return operator.concat(SEPARATOR.OPERATOR).concat(value.toString());
}

export function encodeFilterQuery<T extends Operator>(
  key: string,
  operator: T,
  value: T extends 'between' | 'notBetween' | 'in' | 'notIn'
    ? Maybe<string | number>[]
    : Maybe<string | number>,
) {
  const params = new URLSearchParams();
  const encodedValue = encodeFilterValue(operator, value);
  if (encodedValue) {
    params.set(key, encodedValue);
  }
  return params.toString();
}
