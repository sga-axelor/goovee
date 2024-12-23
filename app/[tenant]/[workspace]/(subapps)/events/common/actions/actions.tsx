'use server';

import {headers} from 'next/headers';

// ---- CORE IMPORTS ----//
import {clone, getPageInfo} from '@/utils';
import {t} from '@/locale/server';
import {SUBAPP_CODES} from '@/constants';
import {TENANT_HEADER} from '@/middleware';
import type {ID, Participant, PortalWorkspace, User} from '@/types';
import {getSession} from '@/auth';

// ---- LOCAL IMPORTS ---- //
import {
  findRegisteredEvents,
  findEventByID,
  findEvents,
} from '@/subapps/events/common/orm/event';
import {findContact} from '@/subapps/events/common/orm/partner';
import {
  findEventParticipant,
  registerParticipants,
} from '@/subapps/events/common/orm/registration';
import {error} from '@/subapps/events/common/utils';
import {
  validate,
  withSubapp,
  withWorkspace,
} from '@/subapps/events/common/actions/validation';
import {LIMIT} from '@/subapps/events/common/constants';

export async function getAllEvents({
  limit,
  page,
  categories,
  search,
  day,
  month,
  year,
  dates,
  workspace,
  tenantId,
  user,
  onlyRegisteredEvent = false,
  upComingEvents = false,
  pastEvents = false,
  onGoingEvents = false,
}: {
  limit?: number;
  page?: number;
  categories?: any[];
  filter?: string;
  search?: string;
  day?: string | number;
  month?: number;
  year?: number;
  dates?: [Date | undefined];
  workspace?: any;
  tenantId?: any;
  user?: User;
  onlyRegisteredEvent?: boolean;
  upComingEvents?: boolean;
  pastEvents?: boolean;
  onGoingEvents?: boolean;
}) {
  tenantId = headers().get(TENANT_HEADER) || tenantId;

  if (!(workspace && tenantId)) {
    return {events: [], pageInfo: null};
  }
  const workspaceURL = workspace.url;

  const result = await validate([
    withWorkspace(workspaceURL, tenantId, {checkAuth: false}),
    withSubapp(SUBAPP_CODES.events, workspaceURL, tenantId),
  ]);

  if (result.error) {
    return result;
  }

  try {
    if (onlyRegisteredEvent) {
      const {events, pageInfo} = await findRegisteredEvents({
        limit: limit,
        page: page,
        categoryids: categories,
        day: day,
        search: search,
        month: month,
        year: year,
        selectedDates: dates,
        workspace,
        tenantId,
        upComingEvents,
        pastEvents,
        onGoingEvents,
      }).then(clone);
      return {events, pageInfo};
    } else {
      const {events, pageInfo} = await findEvents({
        limit: limit,
        page: page,
        categoryids: categories,
        day: day,
        search: search,
        month: month,
        year: year,
        selectedDates: dates,
        workspace,
        tenantId,
        user,
      }).then(clone);
      return {events, pageInfo};
    }
  } catch (err) {
    console.log(err);
  }
}

export async function register({
  eventId,
  values,
  workspace,
}: {
  eventId: any;
  values: any;
  workspace: PortalWorkspace;
}) {
  const tenantId = headers().get(TENANT_HEADER);

  if (!eventId) return error(await t('Event ID is missing!'));

  if (!values) return error(await t('Values are missing!'));

  if (!tenantId) return error(await t('Tenant ID is missing!'));

  if (!workspace) return error(await t('Workspace is missing!'));

  const workspaceURL = workspace.url;
  const result = await validate([
    withWorkspace(workspaceURL, tenantId, {checkAuth: false}),
    withSubapp(SUBAPP_CODES.events, workspaceURL, tenantId),
  ]);

  if (result.error) {
    return result;
  }
  const session = await getSession();
  const user = session?.user;

  const event = await findEventByID({id: eventId, workspace, tenantId, user});
  if (!event) return error(await t('Event not found!'));

  try {
    const {otherPeople, ...rest} = values;

    if (otherPeople.length === 0) {
      rest.emailAddress = rest.emailAddress.toLowerCase();
      return await registerParticipants({
        eventId,
        workspaceURL,
        values: rest,
        tenantId,
      }).then(clone);
    }
    otherPeople.push(rest);
    otherPeople.forEach((element: Participant) => {
      if (element.emailAddress) {
        element.emailAddress = element.emailAddress.toLowerCase();
      }
    });
    return await registerParticipants({
      eventId,
      workspaceURL,
      values: otherPeople,
      tenantId,
    }).then(clone);
  } catch (err) {
    console.log(err);
    return error(await t('Something went wrong!'));
  }
}

export async function fetchContacts({
  search,
  workspaceURL,
}: {
  search: string;
  workspaceURL: string;
}) {
  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return error(await t('Bad Request'));
  }

  const result = await validate([
    withWorkspace(workspaceURL, tenantId, {checkAuth: false}),
    withSubapp(SUBAPP_CODES.events, workspaceURL, tenantId),
  ]);

  if (result.error) {
    return result;
  }

  try {
    const result = await findContact({search, workspaceURL, tenantId}).then(
      clone,
    );
    return result;
  } catch (err) {
    console.log(err);
    return error(await t('Something went wrong!'));
  }
}

export async function fetchEventParticipants({
  id,
  workspace,
  user,
}: {
  id: ID;
  workspace: PortalWorkspace;
  user?: User;
}) {
  const tenantId = headers().get(TENANT_HEADER);

  if (!user?.email) {
    return {
      isRegistered: false,
    };
  }
  if (!id) {
    return error(await t('Invalid Event.'));
  }

  if (!tenantId) {
    return error(await t('Bad Request'));
  }

  if (!workspace) {
    return {error: true, message: await t('Invalid workspace')};
  }

  const workspaceURL = workspace?.url;

  const result = await validate([
    withWorkspace(workspaceURL, tenantId, {checkAuth: false}),
    withSubapp(SUBAPP_CODES.events, workspaceURL, tenantId),
  ]);

  if (result.error) {
    return result;
  }
  try {
    const result: any = await findEventParticipant({
      id,
      workspace,
      tenantId,
    }).then(clone);

    const emailAddress = result?.emailAddress;
    return {
      isRegistered: emailAddress === user.email,
    };
  } catch (err) {
    console.log(err);
    return {
      error: true,
      message: await t('Something went wrong!'),
    };
  }
}

export async function getAllRegisteredEvents({
  limit = LIMIT,
  page = 1,
  categories,
  search,
  day,
  month,
  year,
  dates,
  workspace,
  tenantId,
  showPastEvents,
}: {
  limit?: number;
  page?: number;
  categories?: any[];
  filter?: string;
  search?: string;
  day?: string | number;
  month?: number;
  year?: number;
  dates?: [Date | undefined];
  workspace?: any;
  tenantId?: any;
  showPastEvents: boolean;
}) {
  tenantId = headers().get(TENANT_HEADER) || tenantId;
  const events = {
    ongoing: [],
    upcoming: [],
    past: [],
  };

  if (!(workspace && tenantId)) {
    return {events, pageInfo: null};
  }
  const workspaceURL = workspace.url;
  const result = await validate([
    withWorkspace(workspaceURL, tenantId, {checkAuth: false}),
    withSubapp(SUBAPP_CODES.events, workspaceURL, tenantId),
  ]);

  if (result.error) {
    return {
      events,
      pageInfo: null,
      result,
    };
  }

  try {
    const arg = {
      limit: limit,
      page: page,
      categoryids: categories,
      day: day,
      search: search,
      month: month,
      year: year,
      selectedDates: dates,
      workspace,
      tenantId,
    };
    const onGoingEventsCount = await findRegisteredEvents({
      ...arg,
      onGoingEvents: true,
      onlyCount: true,
    });
    const upcomingEventsCount = await findRegisteredEvents({
      ...arg,
      upComingEvents: true,
      onlyCount: true,
    });
    const pastEventsCount = showPastEvents
      ? await findRegisteredEvents({...arg, pastEvents: true, onlyCount: true})
      : {count: 0};
    let upcomgingLimit = 0;
    let pastlimit = 0;
    let upcomingSkip = 0;
    let upcomingEvent;
    let pastevent;
    let pastSkip = 0;

    const skip = Number(limit) * Math.max(Number(page) - 1, 0);

    let ongoingEvent = await findRegisteredEvents({
      ...arg,
      onGoingEvents: true,
      skip,
      limit,
    });

    upcomgingLimit = limit! - ongoingEvent?.events?.length! || 0;

    if (upcomgingLimit > 0) {
      upcomingSkip =
        ongoingEvent.events?.length === 0
          ? skip - Number(onGoingEventsCount.count)
          : 0;
      upcomingEvent = await findRegisteredEvents({
        ...arg,
        upComingEvents: true,
        skip: upcomingSkip,
        limit: upcomgingLimit,
      });
      pastlimit = upcomgingLimit - Number(upcomingEvent.events?.length);
    }
    if (showPastEvents && pastlimit > 0) {
      pastSkip =
        upcomingEvent?.events?.length == 0
          ? upcomingSkip - Number(upcomingEventsCount.count)
          : 0;
      pastevent = await findRegisteredEvents({
        ...arg,
        pastEvents: true,
        skip: pastSkip,
        limit: pastlimit,
      });
    }

    const pageInfo = getPageInfo({
      count:
        Number(onGoingEventsCount.count) +
        Number(upcomingEventsCount.count) +
        Number(pastEventsCount.count),
      page,
      limit,
    });

    return {
      data: clone({
        events: {
          ongoing: ongoingEvent.events || [],
          upcoming: upcomingEvent?.events || [],
          past: pastevent?.events || [],
        },
        pageInfo,
      }),
    };
  } catch (err) {
    console.log(err);
  }
}
