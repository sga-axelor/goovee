import moment from 'moment';

// ---- CORE IMPORTS ---- //
import {formatDateToISOString} from '@/utils/date';
import {DATE_FORMATS, ORDER_BY} from '@/constants';
import {getPageInfo} from '@/utils';
import {type Tenant, manager} from '@/tenant';
import type {ID, PortalWorkspace, User} from '@/types';
import {filterPrivate} from '@/orm/filter';
import {getSession} from '@/auth';

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

export async function findRegisteredEvents({
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
  upComingEvents,
  pastEvents,
  onGoingEvents,
  onlyCount = false,
  skip,
}: {
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
  upComingEvents?: boolean;
  pastEvents?: boolean;
  onGoingEvents?: boolean;
  onlyCount?: boolean;
  skip?: number;
}) {
  if (!tenantId) {
    return {events: [], pageInfo: {}, count: 0};
  }
  const session = await getSession();
  const user = session?.user;
  const client = await manager.getClient(tenantId);

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
  const currentDateTime = new Date().toISOString();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayStartTime = todayStart.toISOString();

  const orderBy: any = {eventStartDateTime: ORDER_BY.ASC};

  const whereClause = {
    registration: {
      event: {
        eventAllowRegistration: true,
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

        ...(upComingEvents
          ? {
              eventStartDateTime: {
                gt: currentDateTime,
              },
            }
          : {}),
        ...(pastEvents
          ? {
              AND: [
                {
                  OR: [
                    {
                      AND: [
                        {
                          eventStartDateTime: {
                            lt: currentDateTime,
                          },
                        },
                        {
                          eventEndDateTime: {
                            lt: currentDateTime,
                          },
                        },
                      ],
                    },
                    {
                      AND: [
                        {
                          eventAllDay: {
                            eq: true,
                          },
                        },
                        {
                          eventStartDateTime: {
                            lt: currentDateTime,
                          },
                        },
                        {
                          eventStartDateTime: {
                            notBetween: [todayStartTime, currentDateTime],
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            }
          : {}),
        ...(onGoingEvents
          ? {
              AND: [
                {
                  OR: [
                    {
                      AND: [
                        {
                          eventStartDateTime: {
                            le: currentDateTime,
                          },
                        },
                        {
                          eventEndDateTime: {
                            ge: currentDateTime,
                          },
                        },
                      ],
                    },
                    {
                      AND: [
                        {
                          eventStartDateTime: {
                            between: [todayStartTime, currentDateTime],
                          },
                        },
                        {
                          eventAllDay: {
                            eq: true,
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            }
          : {}),
      },
    },
    emailAddress: user?.email,
  };
  if (!onlyCount) {
    const registerEvents = await client.aOSPortalParticipant.find({
      where: whereClause,
      orderBy: {
        registration: {
          event: orderBy,
        },
      },
      take: limit,
      ...(skip ? {skip} : {}),
      select: {
        registration: {
          event: {
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
            eventProduct: {
              id: true,
              name: true,
              salePrice: true,
            },
          },
        },
      },
    });

    const events = registerEvents?.map(
      (item: any) => item?.registration?.event,
    );

    const pageInfo = getPageInfo({
      count: events?.[0]?._count,
      page,
      limit,
    });
    return {events, pageInfo, count: 0};
  } else {
    const eventCount = await client.aOSPortalParticipant.count({
      where: whereClause,
    });
    return {
      events: [],
      pageInfo: null,
      count: eventCount,
    };
  }
}
