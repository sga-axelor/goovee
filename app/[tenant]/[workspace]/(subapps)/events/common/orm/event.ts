import moment from 'moment';

// ---- CORE IMPORTS ---- //
import {formatDateToISOString} from '@/utils/date';
import {
  DATE_FORMATS,
  ORDER_BY,
  DEFAULT_PAGE,
  DAY,
  MONTH,
  YEAR,
  SUBAPP_CODES,
} from '@/constants';
import {getPageInfo} from '@/utils';
import {type Tenant, manager} from '@/tenant';
import type {ID, PortalWorkspace, User} from '@/types';
import {filterPrivate} from '@/orm/filter';

// ---- LOCAL IMPORTS ---- //
import {
  validate,
  withSubapp,
  withWorkspace,
} from '@/subapps/events/common/actions/validation';
import {EVENT_TYPE} from '@/subapps/events/common/constants';

const buildDateFilters = ({
  eventStartDateTimeCriteria,
  year,
  startDate,
  endDate,
}: any) => {
  if (eventStartDateTimeCriteria) {
    return {OR: eventStartDateTimeCriteria};
  }

  if (year) {
    return {
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
    };
  }

  return {};
};

const buildEventTypeFilters = ({
  eventType,
  todayStartTime,
  currentDateTime,
}: {
  eventType: string;
  todayStartTime: string;
  currentDateTime: string;
}) => {
  switch (eventType) {
    case EVENT_TYPE.UPCOMING:
      return {eventStartDateTime: {gt: currentDateTime}};
    case EVENT_TYPE.ONGOING:
      return {
        AND: [
          {
            OR: [
              {
                AND: [
                  {eventStartDateTime: {le: currentDateTime}},
                  {eventEndDateTime: {ge: currentDateTime}},
                ],
              },
              {
                AND: [
                  {
                    eventStartDateTime: {
                      between: [todayStartTime, currentDateTime],
                    },
                  },
                  {eventAllDay: {eq: true}},
                ],
              },
            ],
          },
        ],
      };
    case EVENT_TYPE.PAST:
      return {
        AND: [
          {
            OR: [
              {
                AND: [
                  {eventStartDateTime: {lt: currentDateTime}},
                  {eventEndDateTime: {lt: currentDateTime}},
                ],
              },
              {
                AND: [
                  {eventAllDay: {eq: true}},
                  {eventStartDateTime: {lt: currentDateTime}},
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
      };
    default:
      return {};
  }
};

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
  page = DEFAULT_PAGE,
  limit,
  day,
  month,
  year,
  selectedDates,
  workspace,
  tenantId,
  user,
  onlyRegisteredEvent,
  eventType,
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
  workspace: PortalWorkspace;
  tenantId: Tenant['id'];
  user?: User;
  onlyRegisteredEvent?: boolean;
  eventType?: string;
}) {
  if (!(workspace && tenantId)) {
    return {events: [], pageInfo: {}};
  }

  const workspaceURL = workspace.url;

  const result = await validate([
    withWorkspace(workspaceURL, tenantId, {checkAuth: false}),
    withSubapp(SUBAPP_CODES.events, workspaceURL, tenantId),
  ]);

  if (result.error) {
    return result;
  }

  if (onlyRegisteredEvent && !user) {
    return {events: [], pageInfo: {}};
  }

  const c = await manager.getClient(tenantId);

  if (!c) {
    return {events: [], pageInfo: {}};
  }

  let date, predicate: any;
  if (day && month && year) {
    predicate = DAY;
    date = moment(`${day}-${month}-${year}`, DATE_FORMATS.DD_MM_YYYY);
  } else if (month && year) {
    predicate = MONTH;
    date = moment(`${month}-${year}`, DATE_FORMATS.MM_YYYY);
  } else if (year) {
    predicate = YEAR;
    date = moment(year, DATE_FORMATS.YYYY);
  }

  let startDate, endDate;
  if (year) {
    startDate = formatDateToISOString(date?.startOf(predicate));
    endDate = formatDateToISOString(date?.endOf(predicate));
  }

  const eventStartDateTimeCriteria = selectedDates?.map((date: any) => ({
    eventStartDateTime: {
      between: [
        moment(date).startOf(DAY).format(DATE_FORMATS.timestamp_with_seconds),
        moment(date).endOf(DAY).format(DATE_FORMATS.timestamp_with_seconds),
      ],
    },
  }));

  const currentDateTime = new Date().toISOString();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayStartTime = todayStart.toISOString();
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
    ...buildDateFilters({eventStartDateTimeCriteria, year, startDate, endDate}),
    ...(eventType
      ? buildEventTypeFilters({
          eventType,
          todayStartTime,
          currentDateTime,
        })
      : {}),
    ...(onlyRegisteredEvent
      ? {
          registrationList: {
            participantList: {
              emailAddress: user?.email,
            },
          },
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
        registrationList: {
          select: {
            participantList: {
              where: {
                ...(user?.email ? {emailAddress: user?.email} : {}),
              },
              select: {
                emailAddress: true,
              },
            },
          },
        },
      },
    } as any)
    .then(events =>
      events.map(event => ({
        ...event,
        isRegistered: user?.email
          ? Boolean(
              event.registrationList.find((r: any) =>
                r.participantList.find(
                  (p: any) => p.emailAddress === user?.email,
                ),
              )?.participantList.length,
            )
          : false,
      })),
    )
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
