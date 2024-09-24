import {ORDER_BY} from '@/constants';
import {AOSProjectTask} from '@/goovee/.generated/models';
import {Maybe} from '@/types/util';
import {Entity, ID, IdFilter, WhereArg, WhereOptions} from '@goovee/orm';
import {set} from 'lodash';
import {ASSIGNMENT} from '../constants';
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
    requestedBy,
    status,
    priority,
    assignedTo,
    updatedOn,
    myTickets,
    assignment,
  } = data;

  const where: Where<AOSProjectTask> = {
    ...(status && {status: {id: {in: status}}}),
    ...(priority && {priority: {id: {in: priority}}}),
    ...(updatedOn && {updatedOn: {between: updatedOn}}),
  };

  if (myTickets) {
    where.OR = [
      {assignedToContact: {id: userId}, assignment: ASSIGNMENT.CUSTOMER},
      {requestedByContact: {id: userId}},
    ];
    return where;
  }

  if (requestedBy) {
    where.requestedByContact = {id: {in: requestedBy}};
  }

  if (assignment && assignedTo) {
    where.OR = [{assignedToContact: {id: {in: assignedTo}}}, {assignment}];
    return where;
  }

  if (assignment) {
    where.assignment = assignment;
  }
  if (assignedTo) {
    where.assignedToContact = {id: {in: assignedTo}};
    where.assignment = ASSIGNMENT.CUSTOMER;
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
