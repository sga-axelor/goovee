import {ORDER_BY} from '@/constants';
import {AOSProjectTask} from '@/goovee/.generated/models';
import {Maybe} from '@/types/util';
import {Entity, ID, IdFilter, WhereArg, WhereOptions} from '@goovee/orm';
import {set} from 'lodash';
import {COMPANY} from '../constants';
import {EncodedFilterSchema} from '../schema';

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

type Where<T extends Entity> = {
  -readonly [K in keyof T]?: K extends 'id' ? IdFilter : WhereArg<T[K]>;
} & {
  OR?: WhereOptions<T>[];
  AND?: WhereOptions<T>[];
  NOT?: WhereOptions<T>[];
};

export function getWhere(
  filter: unknown,
  userId: ID,
): WhereOptions<AOSProjectTask> | null {
  if (!filter) return null;
  const {success, data} = EncodedFilterSchema.safeParse(filter);
  if (!success || !data) return null;
  const {
    createdBy,
    status,
    priority,
    managedBy,
    updatedOn,
    myTickets,
    assignment,
  } = data;

  const where: Where<AOSProjectTask> = {
    ...(status && {status: {id: {in: status}}}),
    ...(priority && {priority: {id: {in: priority}}}),
    ...(updatedOn && {updatedOn: {between: updatedOn}}),
    ...(assignment && {assignment}),
  };

  if (myTickets) {
    const OR = [
      {assignedToContact: {id: userId}},
      {requestedByContact: {id: userId}},
    ];
    if (where.OR) where.OR.push(...OR);
    else where.OR = OR;
    return where;
  }

  if (createdBy) {
    if (createdBy.includes(COMPANY)) {
      const filteredCreatedBy = createdBy.filter(id => id !== COMPANY);
      if (filteredCreatedBy.length) {
        const OR = [
          {requestedByContact: {id: {in: filteredCreatedBy}}},
          {requestedByContact: {id: null}},
        ];

        if (where.OR) where.OR.push(...OR);
        else where.OR = OR;
      } else {
        where.requestedByContact = {id: null};
      }
    } else {
      where.requestedByContact = {id: {in: createdBy}};
    }
  }

  if (managedBy) {
    where.assignedToContact = {id: {in: managedBy}};
  }

  return where;
}

export const getSkip = (
  limit: string | number,
  page: string | number,
): number => {
  page = +page || 1;
  return (page - 1) * +limit;
};

const SEPARATOR = ' ';

export function decodeSortValue(
  sort: Maybe<string>,
): [string | null, 'ASC' | 'DESC'] {
  if (!sort) return [null, ORDER_BY.ASC];
  const [key, _direction] = sort.split(SEPARATOR, 2);
  const direction = _direction === ORDER_BY.DESC ? ORDER_BY.DESC : ORDER_BY.ASC; // take ascending as defualt direction
  return [key, direction];
}

export function encodeSortValue(
  key: string,
  direction: 'ASC' | 'DESC' = 'ASC',
): string {
  return [key, direction].join(SEPARATOR);
}
