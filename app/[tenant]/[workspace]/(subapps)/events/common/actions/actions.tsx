'use server';

import {headers} from 'next/headers';

// ---- CORE IMPORTS ----//
import {getSession} from '@/auth';
import {ModelMap, SUBAPP_CODES} from '@/constants';
import {t} from '@/locale/server';
import {TENANT_HEADER} from '@/middleware';
import type {ID, Participant, PortalWorkspace, User} from '@/types';
import {clone} from '@/utils';

// ---- LOCAL IMPORTS ---- //
import {
  CreateComment,
  CreateCommentPropsSchema,
  FetchComments,
  FetchCommentsPropsSchema,
  isCommentEnabled,
} from '@/comments';
import {addComment, findComments} from '@/comments/orm';
import {findSubappAccess, findWorkspace} from '@/orm/workspace';
import {
  validate,
  withSubapp,
  withWorkspace,
} from '@/subapps/events/common/actions/validation';
import {
  findEvent,
  findEventConfig,
  findEvents,
} from '@/subapps/events/common/orm/event';
import {findContacts} from '@/subapps/events/common/orm/partner';
import {registerParticipants} from '@/subapps/events/common/orm/registration';
import {error} from '@/subapps/events/common/utils';
import {
  canEmailBeRegistered,
  isAlreadyRegistered,
} from '@/subapps/events/common/utils/registration';
import {ActionResponse} from '@/types/action';
import {zodParseFormData} from '@/utils/formdata';

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
    const {events, pageInfo} = await findEvents({
      limit,
      page,
      categoryids: categories,
      day,
      search,
      month,
      year,
      selectedDates: dates,
      workspace,
      tenantId,
      user,
      onlyRegisteredEvent,
    }).then(clone);
    return {events, pageInfo};
  } catch (err) {
    console.log(err);
  }
}

export async function validateRegistration({
  eventId,
  values,
  workspaceURL,
}: {
  eventId: any;
  values: any;
  workspaceURL: string;
}) {
  const tenantId = headers().get(TENANT_HEADER);

  if (!eventId) return error(await t('Event ID is missing!'));
  if (!values) return error(await t('Values are missing!'));
  if (!tenantId) return error(await t('Tenant ID is missing!'));
  if (!workspaceURL) return error(await t('Workspace is missing!'));

  const session = await getSession();
  const user = session?.user;

  const workspace = await findWorkspace({user, url: workspaceURL, tenantId});
  if (!workspace) return error(await t('Invalid workspace'));

  const result = await validate([
    withSubapp(SUBAPP_CODES.events, workspaceURL, tenantId),
  ]);
  if (result.error) return result;

  if (!workspace.config?.allowGuestEventRegistration && !user) {
    return error(
      await t(
        'Guest registration is not allowed for this workspace, Please login',
      ),
    );
  }

  const event = await findEventConfig({id: eventId, tenantId});
  if (!event) return error(await t('Event not found'));
  if (!event.eventAllowRegistration) {
    return error(await t('Registration not started for this event'));
  }

  if (event.isPrivate || (!event.isPublic && !event.isLoginNotNeeded)) {
    if (!user) {
      return error(await t('Guest registration is not allowed for this event'));
    }
  }

  try {
    const {otherPeople, ...rest} = values;
    otherPeople.push(rest);

    otherPeople.forEach((participant: Participant) => {
      if (participant.emailAddress) {
        participant.emailAddress = participant.emailAddress.toLowerCase();
      }
    });

    if (
      !otherPeople.every((participant: Participant) => participant.emailAddress)
    ) {
      return error(await t('Email is required'));
    }

    const canRegisterList = await Promise.all(
      otherPeople.map((participant: Participant) =>
        canEmailBeRegistered({
          event,
          email: participant.emailAddress,
          tenantId,
        }),
      ),
    );

    const canAllEmailBeRegistered = canRegisterList.every(Boolean);
    if (!canAllEmailBeRegistered) {
      return error(await t('Not all email can be registered to this event'));
    }

    const isAnyEmailAlreadyRegistered = otherPeople.some(
      (participant: Participant) =>
        isAlreadyRegistered({event, email: participant.emailAddress}),
    );
    if (isAnyEmailAlreadyRegistered) {
      return error(await t('Some email is already registered to this event'));
    }

    return {
      success: true,
      validatedParticipants: clone(otherPeople),
      event: clone(event),
      workspaceURL,
      tenantId,
    };
  } catch (err) {
    console.error(err);
    return error(await t('Something went wrong during validation!'));
  }
}

export async function registerParticipantsAction({
  eventId,
  validatedParticipants,
  workspaceURL,
  tenantId,
}: {
  validatedParticipants: Participant[];
  eventId: any;
  workspaceURL: string;
  tenantId: string;
}) {
  try {
    const registration = await registerParticipants({
      eventId,
      workspaceURL,
      participants: validatedParticipants,
      tenantId,
    });

    // const partnerPromises = partnerParticipantList
    //   .filter(({partner}) => !partner)
    //   .map(({participant}) => {
    //     return createPartner();
    //   });
    // await Promise.all(partnerPromises);

    return {
      success: true,
      data: clone(registration),
    };
  } catch (err) {
    console.error(err);
    return error(await t('Something went wrong during registration!'));
  }
}

export async function register({
  eventId,
  values,
  workspace: {url: workspaceURL},
}: {
  eventId: any;
  values: any;
  workspace: PortalWorkspace;
}) {
  const validationResult = await validateRegistration({
    eventId,
    values,
    workspaceURL,
  });

  if (!validationResult.success) {
    return validationResult;
  }

  return await registerParticipantsAction({
    eventId,
    validatedParticipants: validationResult.validatedParticipants,
    workspaceURL: validationResult.workspaceURL,
    tenantId: validationResult.tenantId,
  });
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
    const result = await findContacts({search, workspaceURL, tenantId}).then(
      clone,
    );
    return result;
  } catch (err) {
    console.log(err);
    return error(await t('Something went wrong!'));
  }
}

export async function isValidParticipant(props: {
  workspaceURL: string;
  eventId: ID;
  email: string;
}): ActionResponse<true> {
  const {workspaceURL, eventId, email} = props;
  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return error(await t('Bad Request'));
  }
  if (!email) {
    return error(await t('Email is required'));
  }

  const result = await validate([
    withWorkspace(workspaceURL, tenantId, {checkAuth: false}),
    withSubapp(SUBAPP_CODES.events, workspaceURL, tenantId),
  ]);

  if (result.error) {
    return result;
  }

  const event = await findEventConfig({
    id: eventId,
    tenantId,
  });

  if (!event) {
    return error(await t('Event not found!'));
  }

  if (!(await canEmailBeRegistered({event, email, tenantId}))) {
    return error(await t('This email can not be registered to this event'));
  }

  if (isAlreadyRegistered({event, email})) {
    return error(await t('This email is already registered to this event'));
  }

  return {
    success: true,
    data: true,
  };
}

export const createComment: CreateComment = async formData => {
  const session = await getSession();
  const user = session?.user;
  if (!user) {
    return {error: true, message: await t('Unauthorized')};
  }

  const tenantId = headers().get(TENANT_HEADER);
  if (!tenantId) {
    return {error: true, message: await t('TenantId is required.')};
  }

  const {workspaceURL, ...rest} = zodParseFormData(
    formData,
    CreateCommentPropsSchema,
  );

  const workspace = await findWorkspace({user, url: workspaceURL, tenantId});
  if (!workspace) {
    return {error: true, message: await t('Invalid workspace')};
  }

  const {workspaceUser} = workspace;
  if (!workspaceUser) {
    return {error: true, message: await t('Workspace user is missing')};
  }

  if (!isCommentEnabled({subapp: SUBAPP_CODES.events, workspace})) {
    return {error: true, message: await t('Comments are not enabled')};
  }

  const modelName = ModelMap[SUBAPP_CODES.events];
  if (!modelName) {
    return {error: true, message: await t('Invalid model type')};
  }

  const app = await findSubappAccess({
    code: SUBAPP_CODES.events,
    user,
    url: workspaceURL,
    tenantId,
  });
  if (!app?.installed) {
    return {error: true, message: await t('Unauthorized Access')};
  }

  const event = await findEvent({
    id: rest.recordId,
    workspace,
    tenantId,
    user,
  });
  if (!event) {
    return {error: true, message: await t('Record not found')};
  }

  try {
    const res = await addComment({
      modelName,
      userId: user.id,
      workspaceUserId: workspaceUser.id,
      tenantId,
      commentField: 'note',
      trackingField: 'publicBody',
      subject: `${user.simpleFullName || user.name} added a comment`,
      ...rest,
    });

    return {success: true, data: clone(res)};
  } catch (e) {
    return {
      error: true,
      message:
        e instanceof Error
          ? e.message
          : await t('An unexpected error occurred while fetching comments.'),
    };
  }
};

export const fetchComments: FetchComments = async props => {
  const {workspaceURL, ...rest} = FetchCommentsPropsSchema.parse(props);
  const session = await getSession();

  const user = session?.user;

  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return {
      error: true,
      message: await t('TenantId is required.'),
    };
  }

  const workspace = await findWorkspace({user, url: workspaceURL, tenantId});

  if (!workspace) {
    return {error: true, message: await t('Invalid workspace')};
  }

  if (!isCommentEnabled({subapp: SUBAPP_CODES.events, workspace})) {
    return {error: true, message: await t('Comments are not enabled')};
  }

  const modelName = ModelMap[SUBAPP_CODES.events];
  if (!modelName) {
    return {error: true, message: await t('Invalid model type')};
  }

  const app = await findSubappAccess({
    code: SUBAPP_CODES.events,
    user,
    url: workspaceURL,
    tenantId,
  });
  if (!app?.installed) {
    return {error: true, message: await t('Unauthorized Access')};
  }

  const event = await findEvent({
    id: rest.recordId,
    workspace,
    tenantId,
    user,
  });
  if (!event) {
    return {error: true, message: await t('Record not found')};
  }

  try {
    const data = await findComments({
      modelName,
      tenantId,
      commentField: 'note',
      trackingField: 'publicBody',
      ...rest,
    });
    return {success: true, data: clone(data)};
  } catch (e) {
    return {
      error: true,
      message:
        e instanceof Error
          ? e.message
          : await t('An unexpected error occurred while fetching comments.'),
    };
  }
};
