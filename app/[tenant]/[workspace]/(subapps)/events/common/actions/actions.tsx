'use server';

// ---- CORE IMPORTS ----//
import {clone} from '@/utils';
import {Comment, Participant} from '@/types';
import {i18n} from '@/lib/i18n';
import {getSession} from '@/orm/auth';
import {SUBAPP_CODES} from '@/constants';
import {findSubappAccess, findWorkspace} from '@/orm/workspace';

// ---- LOCAL IMPORTS ---- //
import {findEvent, findEvents} from '@/subapps/events/common/orm/event';
import {findContactByName} from '@/subapps/events/common/orm/partner';
import {
  createComment,
  findCommentsForEvent,
} from '@/subapps/events/common/orm/comment';
import {
  registerParticipant,
  registerParticipants,
} from '@/subapps/events/common/orm/registration';

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
}) {
  if (!workspace) {
    return {events: [], pageInfo: null};
  }

  try {
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
    }).then(clone);
    return {events, pageInfo};
  } catch (err) {
    console.log(err);
  }
}

export async function addComment(
  eventId: string,
  comment: Comment,
  workspaceURL: string,
) {
  const session = await getSession();
  if (!session?.user) {
    return {
      error: true,
      message: i18n.get('Unauthorized'),
    };
  }

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.events,
    user: session?.user,
    url: workspaceURL,
  });

  if (!subapp) {
    return {
      error: true,
      message: i18n.get('Unauthorized'),
    };
  }

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
  });

  if (!workspace) {
    return {
      error: true,
      message: i18n.get('Invalid workspace'),
    };
  }

  if (!eventId || !comment) return undefined;
  const event = await findEvent(eventId);
  if (!event) return undefined;

  try {
    return await createComment(eventId, workspaceURL, comment).then(clone);
  } catch (err) {
    console.log(err);
  }
}

export async function getCommentsByEvent(
  eventId: string,
  workspaceURL: string,
) {
  const session = await getSession();
  if (!session?.user) {
    return {
      error: true,
      message: i18n.get('Unauthorized'),
    };
  }

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.events,
    user: session?.user,
    url: workspaceURL,
  });

  if (!subapp) {
    return {
      error: true,
      message: i18n.get('Unauthorized'),
    };
  }

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
  });

  if (!workspace) {
    return {
      error: true,
      message: i18n.get('Invalid workspace'),
    };
  }

  if (!eventId) return undefined;
  const event = await findEvent(eventId);
  if (!event) return undefined;
  try {
    const comments = findCommentsForEvent(eventId).then(clone);
    return comments;
  } catch (err) {
    console.log(err);
  }
}

export async function eventRegistration(
  eventId: any,
  form: any,
  workspaceURL: string,
) {
  const session = await getSession();
  if (!session?.user) {
    return {
      error: true,
      message: i18n.get('Unauthorized'),
    };
  }

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.events,
    user: session?.user,
    url: workspaceURL,
  });

  if (!subapp) {
    return {
      error: true,
      message: i18n.get('Unauthorized'),
    };
  }

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
  });

  if (!workspace) {
    return {
      error: true,
      message: i18n.get('Invalid workspace'),
    };
  }

  if (!eventId || !form) return undefined;
  const event = await findEvent(eventId);

  if (!event) return undefined;
  try {
    const {otherPeople, ...rest} = form;

    if (otherPeople.length === 0) {
      rest.emailAddress = rest.emailAddress.toLowerCase();
      return await registerParticipant(eventId, workspaceURL, rest).then(clone);
    }
    otherPeople.push(rest);
    otherPeople.forEach((element: Participant) => {
      if (element.emailAddress) {
        element.emailAddress = element.emailAddress.toLowerCase();
      }
    });
    return await registerParticipants(eventId, workspaceURL, otherPeople).then(
      clone,
    );
  } catch (err) {
    console.log(err);
    return undefined;
  }
}

export async function searchContacts(input: string, workspaceURL: string) {
  const session = await getSession();
  if (!session?.user) {
    return {
      error: true,
      message: i18n.get('Unauthorized'),
    };
  }

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.events,
    user: session?.user,
    url: workspaceURL,
  });

  if (!subapp) {
    return {
      error: true,
      message: i18n.get('Unauthorized'),
    };
  }

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
  });

  if (!workspace) {
    return {
      error: true,
      message: i18n.get('Invalid workspace'),
    };
  }

  try {
    const result = await findContactByName(input, workspaceURL).then(clone);
    return result;
  } catch (err) {
    console.log(err);
  }
}
