import moment from 'moment';

// ---- CORE IMPORTS ---- //
import {formatDateToISOString} from '@/utils/date';
import {DATE_FORMATS, ORDER_BY} from '@/constants';
import {getPageInfo} from '@/utils';
import {type Tenant, manager} from '@/tenant';
import type {ID, PortalWorkspace, User} from '@/types';
import {filterPrivate} from '@/orm/filter';

export async function findEventByID({
  id,
  workspace,
  tenantId,
  user,
}: {
  id: ID;
  workspace: PortalWorkspace;
  tenantId: Tenant['id'];
  user?: User;
}) {
  if (!(id && workspace && tenantId)) return null;

  const c = await manager.getClient(tenantId);

  const event = await c.aOSPortalEvent.findOne({
    where: {
      id,
      eventVisibility: true,
      ...(await filterPrivate({user, tenantId})),
      eventCategorySet: {
        ...(await filterPrivate({user, tenantId})),
      },
    },
    select: {
      id: true,
      eventTitle: true,
      eventCategorySet: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
      eventImage: {
        id: true,
      },
      eventDescription: true,
      eventPlace: true,
      eventLink: true,
      eventStartDateTime: true,
      eventEndDateTime: true,
      eventAllDay: true,
      eventDegressiveNumberPartcipant: true,
      eventAllowRegistration: true,
      eventAllowMultipleRegistrations: true,
      eventVisibility: true,
      eventProduct: {
        name: true,
        code: true,
        salePrice: true,
        saleCurrency: {
          code: true,
          symbol: true,
          numberOfDecimals: true,
        },
      },
    },
  });

  return event;
}

export async function findEvents({
  ids,
  search,
  categoryids,
  page = 1,
  limit,
  day,
  month,
  year,
  selectedDates,
  workspace,
  tenantId,
  user,
}: {
  ids?: ID[];
  search?: string;
  categoryids?: ID[];
  page?: string | number;
  limit?: number;
  day?: string | number;
  month?: string | number;
  year?: string | number;
  selectedDates?: any[];
  workspace?: PortalWorkspace;
  tenantId: Tenant['id'];
  user?: User;
}) {
  if (!tenantId) {
    return {events: [], pageInfo: {}};
  }

  const c = await manager.getClient(tenantId);

  let date, predicate: any;
  if (day && month && year) {
    predicate = 'day';
    date = moment(`${day}-${month}-${year}`, 'DD-MM-YYYY');
  } else if (month && year) {
    predicate = 'month';
    date = moment(`${month}-${year}`, 'MM-YYYY');
  } else if (year) {
    predicate = 'year';
    date = moment(year, 'YYYY');
  }

  let startDate, endDate;
  if (year) {
    startDate = formatDateToISOString(date?.startOf(predicate));
    endDate = formatDateToISOString(date?.endOf(predicate));
  }

  const eventStartDateTimeCriteria = selectedDates?.map((date: any) => ({
    eventStartDateTime: {
      between: [
        moment(date).startOf('day').format(DATE_FORMATS.timestamp_with_seconds),
        moment(date).endOf('day').format(DATE_FORMATS.timestamp_with_seconds),
      ],
    },
  }));

  const whereClause = {
    eventCategorySet: {
      workspace: {
        id: workspace?.id,
      },
      ...(categoryids?.length
        ? {
            id: {
              in: categoryids,
            },
          }
        : {}),
      ...(await filterPrivate({user, tenantId})),
    },
    ...(await filterPrivate({user, tenantId})),
    ...(ids?.length
      ? {
          id: {
            in: ids,
          },
        }
      : {}),
    ...(search
      ? {
          eventTitle: {
            like: `%${search}%`,
          },
        }
      : {}),

    ...(eventStartDateTimeCriteria
      ? {OR: eventStartDateTimeCriteria}
      : year
        ? {
            OR: [
              {
                eventStartDateTime: {
                  between: [startDate, endDate],
                },
              },
              {
                eventEndDateTime: {
                  between: [startDate, endDate],
                },
              },
              {
                AND: [
                  {
                    eventStartDateTime: {
                      le: startDate,
                    },
                  },
                  {
                    eventEndDateTime: {
                      ge: endDate,
                    },
                  },
                ],
              },
            ],
          }
        : {}),
    eventVisibility: true,
  };

  const skip = Number(limit) * Math.max(Number(page) - 1, 0);

  const orderBy: any = {eventStartDateTime: ORDER_BY.DESC};
  const events = await c.aOSPortalEvent
    .find({
      where: whereClause,
      orderBy,
      take: limit,
      ...(skip ? {skip} : {}),
      select: {
        id: true,
        eventTitle: true,
        eventCategorySet: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        eventImage: {
          id: true,
          filePath: true,
        },
        eventDescription: true,
        eventStartDateTime: true,
        eventEndDateTime: true,
        eventAllDay: true,
        eventDegressiveNumberPartcipant: true,
        eventAllowRegistration: true,
        eventAllowMultipleRegistrations: true,
        eventVisibility: true,
        eventProduct: {
          id: true,
          name: true,
          salePrice: true,
        },
      },
    })
    .catch((err: any) => {
      console.log(err);
      return [];
    });

  const pageInfo = getPageInfo({
    count: events?.[0]?._count,
    page,
    limit,
  });
  return {events, pageInfo};
}
