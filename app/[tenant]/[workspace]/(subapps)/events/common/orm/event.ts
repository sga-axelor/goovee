import moment from 'moment';

// ---- CORE IMPORTS ---- //
import {getClient} from '@/goovee';
import type {ID, PortalWorkspace} from '@/types';
import {formatDateToISOString} from '@/utils/date';
import {DATE_FORMATS, ORDER_BY} from '@/constants';

export async function findEvent(id: ID) {
  if (!id) return null;

  const c = await getClient();

  const event = await c.aOSPortalEvent.findOne({
    where: {id, eventVisibility: true},
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
      eventCommentList: {
        select: {
          id: true,
          contentComment: true,
          publicationDateTime: true,
          parentComment: {
            id: true,
            contentComment: true,
          },
          childCommentList: {
            select: {
              id: true,
              contentComment: true,
              publicationDateTime: true,
              author: {
                id: true,
                name: true,
              },
              image: {
                id: true,
              },
            },
          },
          author: {
            id: true,
            name: true,
          },
          image: {
            id: true,
          },
        },
      },
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
}) {
  const c = await getClient();

  let date, predicate;
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
    },
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
    ...(categoryids?.length
      ? {
          eventCategorySet: {
            id: {
              in: categoryids,
            },
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

  const events = await c.aOSPortalEvent
    .find({
      where: whereClause,
      orderBy: {eventStartDateTime: ORDER_BY.DESC},
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
  return events;
}
