import {ORDER_BY} from '@/constants';
import {Maybe} from '@/types/util';
import {ID, WhereOptions} from '@goovee/orm';
import {set} from 'lodash';
import {AOSProjectTask} from '@/goovee/.generated/models';
import {z} from 'zod';
import {i18n} from '@/lib/i18n';

export const FilterSchema = z.object({
  requestedBy: z.array(z.string()).optional(),
  priority: z.array(z.string()).optional(),
  status: z.array(z.string()).optional(),
  updatedOn: z
    .tuple([z.string().optional(), z.string().optional()])
    .superRefine((data, ctx) => {
      const [start, end] = data;
      if (!start && !end) return;
      if (!start) {
        return ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: i18n.get('Start date is required.'),
          path: [0],
        });
      }
      if (!end) {
        return ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: i18n.get('End date is required.'),
          path: [1],
        });
      }
      const [startDate, endDate] = [start, end].map(d => new Date(d).getTime());
      if (startDate >= endDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: i18n.get('Start date must be earlier than End date.'),
        });
      }
    })
    .optional(),
  statusCompleted: z.boolean().optional(),
  myTickets: z.boolean().optional(),
  assignedTo: z.array(z.string()).optional(),
});

export const EncodedFilterSchema = FilterSchema.partial().transform(arg => {
  const filter = Object.fromEntries(
    Object.entries(arg).filter(([_, value]) => {
      if (Array.isArray(value)) {
        return value.length && value.every(v => v != undefined && v != ''); // remove empty arrays and arrays with empty values
      }
      if (typeof value === 'boolean') {
        return value; // remove false
      }
      if (value == null) return false; // remove null and undefined
      return true;
    }),
  ) as Partial<z.infer<typeof FilterSchema>>;
  if (!Object.keys(filter).length) return null; // remove empty object
  return filter;
});

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
    statusCompleted,
    myTickets,
  } = data;

  const where: WhereOptions<AOSProjectTask> = {
    ...((status || statusCompleted != null) && {
      status: {
        ...(status && {
          id: {
            in: status,
          },
        }),
        ...(statusCompleted != null && {
          isCompleted: statusCompleted,
        }),
      },
    }),
    ...(priority && {
      priority: {
        id: {
          in: priority,
        },
      },
    }),
    ...(updatedOn && {
      updatedOn: {
        between: updatedOn,
      },
    }),
    ...(myTickets
      ? {
          OR: [
            {
              assignedToContact: {
                id: userId,
              },
            },
            {
              requestedByContact: {
                id: userId,
              },
            },
          ],
        }
      : {
          ...(assignedTo && {
            assignedToContact: {
              id: {
                in: assignedTo,
              },
            },
          }),

          ...(requestedBy && {
            requestedByContact: {
              id: {
                in: requestedBy,
              },
            },
          }),
        }),
  };
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
