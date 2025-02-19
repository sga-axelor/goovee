'use server';

import {headers} from 'next/headers';

// ---- CORE IMPORTS ----//
import {getSession} from '@/auth';
import {
  CreateComment,
  CreateCommentPropsSchema,
  FetchComments,
  FetchCommentsPropsSchema,
  isCommentEnabled,
} from '@/comments';
import {addComment, findComments} from '@/comments/orm';
import {ModelMap, SUBAPP_CODES} from '@/constants';
import {t} from '@/locale/server';
import {TENANT_HEADER} from '@/middleware';
import {findSubappAccess, findWorkspace} from '@/orm/workspace';
import {ID, PaymentOption, PortalWorkspace, User} from '@/types';
import {ActionResponse} from '@/types/action';
import {clone} from '@/utils';
import {zodParseFormData} from '@/utils/formdata';
import {formatAmountForStripe} from '@/utils/stripe';

// ---- LOCAL IMPORTS ---- //
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
import {
  error,
  isEventPrivate,
  isEventPublic,
  isLoginNeededForRegistration,
} from '@/subapps/events/common/utils';
import {generateRegistrationMailAction} from '@/subapps/events/common/utils/mail';
import {getCalculatedTotalPrice} from '@/subapps/events/common/utils/payments';
import {
  canEmailBeRegistered,
  getParticipantsFromValues,
  getTotalRegisteredParticipants,
  hasEventEnded,
  isAlreadyRegistered,
} from '@/subapps/events/common/utils/registration';
import {validatePaymentMode} from '@/subapps/events/common/utils/validate';

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
}): ActionResponse<true> {
  const tenantId = headers().get(TENANT_HEADER);

  if (!eventId) return error(await t('Event ID is missing!'));
  if (!values) return error(await t('Values are missing!'));
  // TODO: Handle the form validation here
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

  const event = await findEventConfig({id: eventId, tenantId, workspaceURL});
  if (!event) return error(await t('Event not found'));

  if (!event.eventAllowRegistration) {
    return error(await t('Registration not started for this event'));
  }

  if (hasEventEnded(event)) {
    return error(await t('Event has already ended'));
  }

  if (isLoginNeededForRegistration(event) && !user) {
    return error(
      await t('Guest registration is not allowed for this event, Please login'),
    );
  }

  try {
    const {otherPeople = []} = values;

    if (!event.eventAllowMultipleRegistrations && otherPeople?.length) {
      return error(await t('Multiple registrations not allowed'));
    }

    const participants = getParticipantsFromValues(values);

    const totalRegisteredParticipants = getTotalRegisteredParticipants(event);
    const maxParticipantPerEvent = event.maxParticipantPerEvent || 0;
    if (totalRegisteredParticipants >= maxParticipantPerEvent) {
      return error(
        await t('Max participants reached. No more registrations allowed'),
      );
    }
    if (
      totalRegisteredParticipants + participants.length >
      maxParticipantPerEvent
    ) {
      const slotsLeft = maxParticipantPerEvent - totalRegisteredParticipants;
      return error(
        await t(
          slotsLeft === 1 ? 'Only {0} slot left' : 'Only ${0} slots left',
          String(slotsLeft),
        ),
      );
    }

    const maxParticipantPerRegistration =
      event.maxParticipantPerRegistration || 1;
    if (participants.length > maxParticipantPerRegistration) {
      return error(
        await t(
          'You can only register up to ${0} people',
          String(maxParticipantPerRegistration),
        ),
      );
    }

    if (!participants.every(participant => participant.emailAddress)) {
      return error(await t('Email is required'));
    }

    if (
      !isEventPublic(event) &&
      new Set(participants.map(p => p.emailAddress)).size !==
        participants.length
    ) {
      return error(await t('Individual email address must be unique'));
    }

    const canRegisterList = await Promise.all(
      participants.map(participant =>
        canEmailBeRegistered({
          event,
          email: participant.emailAddress,
          tenantId,
        }),
      ),
    );

    const canAllEmailBeRegistered = canRegisterList.every(Boolean);
    if (!canAllEmailBeRegistered) {
      if (
        !isEventPrivate(event) &&
        !isEventPublic(event) &&
        workspace.config?.nonPublicEmailNotFoundMessage?.trim()
      ) {
        return error(await t(workspace.config.nonPublicEmailNotFoundMessage));
      }
      return error(
        await t('one or more email can not be registered to this event'),
      );
    }

    const isAnyEmailAlreadyRegistered = participants.some(participant =>
      isAlreadyRegistered({event, email: participant.emailAddress}),
    );
    if (isAnyEmailAlreadyRegistered) {
      return error(await t('Some email is already registered to this event'));
    }

    return {
      success: true,
      data: true,
    };
  } catch (err) {
    console.error(err);
    return error(await t('Something went wrong during validation!'));
  }
}

// TODO: How to know if the amount paid is for the appropriate event only
export async function register({
  eventId,
  values,
  workspace: {url: workspaceURL},
  payment,
}: {
  eventId: any;
  values: any;
  workspace: {url: PortalWorkspace['url']};
  payment?: {id: string; mode: PaymentOption};
}): ActionResponse<{id: ID; version: number}> {
  const tenantId = headers().get(TENANT_HEADER);
  if (!tenantId) return error(await t('Tenant ID is missing!'));
  const validationResult = await validateRegistration({
    eventId,
    values,
    workspaceURL,
  });

  if (!validationResult.success) {
    return validationResult;
  }

  const $event = await findEvent({
    id: eventId,
    workspace: {
      url: workspaceURL,
    },
    tenantId: tenantId,
  });
  if (!$event) return error(await t('Event not found!'));
  let {total: expectedAmount} = getCalculatedTotalPrice(values, $event) || {
    total: 0,
  };

  if (expectedAmount > 0) {
    if (!payment) {
      return error(await t('Payment is required for this event.'));
    }
    let isValid = false;
    let paidAmount = 0;

    try {
      ({isValid, paidAmount} = await validatePaymentMode(
        payment.id,
        payment.mode,
      ));
    } catch (err) {
      console.error('Payment validation error:', err);
      return error(await t('Payment validation failed.'));
    }

    if (!isValid) {
      return error(
        await t(
          `Payment validation failed for {0}.`,
          payment.mode.toUpperCase(),
        ),
      );
    }

    if (payment.mode === PaymentOption.stripe) {
      expectedAmount = formatAmountForStripe(
        Number(expectedAmount || 0),
        $event.currency.code,
      );
    }

    if (paidAmount < expectedAmount) {
      return error(
        await t(
          `Paid amount ({0}) is less than expected ({1}).`,
          String(paidAmount),
          String(expectedAmount),
        ),
      );
    }
  }

  const participants = getParticipantsFromValues(values);
  const registration = await registerParticipants({
    eventId,
    participants,
    workspaceURL,
    tenantId,
  });

  await generateRegistrationMailAction({
    eventId,
    participants,
    workspaceURL,
    tenantId,
  });

  return {success: true, data: clone(registration)};
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

  const session = await getSession();
  const user = session?.user;

  const workspace = await findWorkspace({user, url: workspaceURL, tenantId});
  if (!workspace) return error(await t('Invalid workspace'));

  const result = await validate([
    withSubapp(SUBAPP_CODES.events, workspaceURL, tenantId),
  ]);

  if (result.error) {
    return result;
  }

  const event = await findEventConfig({
    id: eventId,
    tenantId,
    workspaceURL,
  });

  if (!event) {
    return error(await t('Event not found!'));
  }

  if (!(await canEmailBeRegistered({event, email, tenantId}))) {
    if (
      !isEventPrivate(event) &&
      !isEventPublic(event) &&
      workspace.config?.nonPublicEmailNotFoundMessage?.trim()
    ) {
      return error(await t(workspace.config.nonPublicEmailNotFoundMessage));
    }
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
