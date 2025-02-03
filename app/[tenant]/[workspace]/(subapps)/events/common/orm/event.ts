// ---- CORE IMPORTS ---- //
import {formatDateToISOString, formatToTwoDigits} from '@/utils/date';
import {
  DATE_FORMATS,
  ORDER_BY,
  DEFAULT_PAGE,
  DAY,
  MONTH,
  YEAR,
  SUBAPP_CODES,
  DEFAULT_CURRENCY_SYMBOL,
  DEFAULT_CURRENCY_SCALE,
} from '@/constants';
import {getPageInfo} from '@/utils';
import {type Tenant, manager} from '@/tenant';
import type {ID, PortalWorkspace, User} from '@/types';
import {filterPrivate} from '@/orm/filter';
import {dayjs} from '@/locale';
import {formatNumber} from '@/locale/server/formatters';

// ---- LOCAL IMPORTS ---- //
import {
  validate,
  withSubapp,
  withWorkspace,
} from '@/subapps/events/common/actions/validation';
import {EVENT_TYPE} from '@/subapps/events/common/constants';
import {findProductsFromWS} from '@/subapps/events/common/orm/product';

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

export async function findEvent({
  id,
  slug,
  workspace,
  tenantId,
  user,
}: {
  id?: ID;
  slug?: string;
  workspace: PortalWorkspace;
  tenantId: Tenant['id'];
  user?: User;
}) {
  if (!((slug || id) && workspace && tenantId)) return null;

  const c = await manager.getClient(tenantId);

  const event = await c.aOSPortalEvent
    .findOne({
      where: {
        ...(id ? {id} : {}),
        ...(slug ? {slug} : {}),
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
        slug: true,
        defaultPrice: true,
        facilityList: true,
        isPublic: true,
        isHidden: true,
        isLoginNotNeeded: true,
      },
    })
    .then(event => {
      if (!event) return null;
      const isRegistered = user?.email
        ? Boolean(
            event?.registrationList?.find(
              (r: any) => r.participantList.length > 0,
            ),
          )
        : false;
      return {...event, isRegistered};
    });

  if (!event) return null;
  const {eventProduct, defaultPrice}: any = event;
  const {saleCurrency, id: productId} = eventProduct || {};
  console.log('eventProduct >>>', eventProduct);

  // const productsFromWS = await findProductsFromWS({
  //   productList: [{productId}],
  //   workspace,
  //   user,
  //   tenantId,
  // });
  // console.log('productsFromWS >>>', JSON.stringify(productsFromWS));

  const currencySymbol = saleCurrency?.symbol || DEFAULT_CURRENCY_SYMBOL;
  const scale = saleCurrency?.numberOfDecimals || DEFAULT_CURRENCY_SCALE;

  const displayAtiPrice = '';

  return {
    ...event,
    defaultPrice,
    formattedDefaultPrice: await formatNumber(defaultPrice, {
      currency: currencySymbol,
      scale,
    }),
    displayAtiPrice,
    facilityList: event?.facilityList
      ? await Promise.all(
          event.facilityList.map(async facility => {
            return {
              ...facility,
              formattedPrice: await formatNumber(facility.price, {
                currency: currencySymbol,
                scale,
              }),
            };
          }),
        )
      : [],
  };
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
    date = dayjs(
      `${formatToTwoDigits(day)}-${formatToTwoDigits(month)}-${year}`,
      DATE_FORMATS.DD_MM_YYYY,
    );
  } else if (month && year) {
    predicate = MONTH;
    date = dayjs(`${formatToTwoDigits(month)}-${year}`, DATE_FORMATS.MM_YYYY);
  } else if (year) {
    predicate = YEAR;
    date = dayjs(year, DATE_FORMATS.YYYY);
  }

  let startDate, endDate;
  if (year) {
    startDate = formatDateToISOString(date?.startOf(predicate));
    endDate = formatDateToISOString(date?.endOf(predicate));
  }

  const eventStartDateTimeCriteria = selectedDates?.map((date: any) => ({
    eventStartDateTime: {
      between: [
        dayjs(date).startOf(DAY).format(DATE_FORMATS.timestamp_with_seconds),
        dayjs(date).endOf(DAY).format(DATE_FORMATS.timestamp_with_seconds),
      ],
    },
  }));
  const currentDateTime = dayjs().toISOString();
  const todayStartTime = dayjs().startOf(DAY).toISOString();
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
      : {OR: [{isHidden: false}, {isHidden: null}]}),
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
        slug: true,
      },
    } as any)
    .then(events =>
      events.map(event => ({
        ...event,
        isRegistered: user?.email
          ? Boolean(
              event.registrationList.find(
                (r: any) => r.participantList.length > 0,
              ),
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
