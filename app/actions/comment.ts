'use server';

import {headers} from 'next/headers';

// ---- CORE IMPORTS ---- //
import {t} from '@/locale/server';
import {
  addComment,
  findComments,
  FindCommentsData,
  ModelMap,
  upload,
} from '@/orm/comment';
import {TENANT_HEADER} from '@/middleware';
import {getSession} from '@/auth';
import {SORT_TYPE, SUBAPP_CODES} from '@/constants';
import {findWorkspace} from '@/orm/workspace';
import {isCommentEnabled} from '@/utils/comment';
import {clone} from '@/utils';
import {ID} from '@/types';
import {ActionResponse} from '@/types/action';
import {findByID} from '@/orm/record';
import {Cloned} from '@/types/util';
import type {Comment} from '@/orm/comment';

type Attachement = {
  id: ID;
  description?: string;
};

export async function createComment(
  formData: any,
  valueString: string,
): ActionResponse<Cloned<[Comment, Comment | undefined]>> {
  const session = await getSession();

  const user = session?.user;

  if (!user) {
    return {
      error: true,
      message: await t('Unauthorized'),
    };
  }

  let attachments: Attachement[] = [];

  const {
    values,
    workspaceURL,
    recordId,
    subapp,
    parentId,
    messageBody = null,
  } = JSON.parse(valueString) as {
    values?: any;
    workspaceURL: string;
    subapp: SUBAPP_CODES;
    recordId: ID;
    parentId?: any;
    messageBody?: any;
  };

  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return {
      error: true,
      message: await t('TenantId is required.'),
    };
  }

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
    tenantId,
  });

  if (!workspace) {
    return {
      error: true,
      message: await t('Invalid workspace'),
    };
  }

  const {workspaceUser} = workspace;

  if (!workspaceUser) {
    return {
      error: true,
      message: await t('Workspace user is missing'),
    };
  }

  if (!isCommentEnabled({subapp, workspace})) {
    return {
      error: true,
      message: await t('Comments are not enabled'),
    };
  }

  const modelName = ModelMap[subapp];

  if (!modelName) {
    return {
      error: true,
      message: await t('Invalid model type'),
    };
  }

  const {error, message} = await findByID({
    subapp,
    id: recordId,
    workspaceURL,
    workspace,
    tenantId,
  });

  if (error) {
    return {
      error: true,
      message: await t(message || 'Record not found.'),
    };
  }

  if (values?.attachments?.length) {
    try {
      attachments = await upload(formData, tenantId);
    } catch (e) {
      return {
        error: true,
        message: await t('An error occurred while processing the attachments.'),
      };
    }
  }

  try {
    const data = await addComment({
      modelName,
      userId: user.id,
      workspaceUserId: workspaceUser.id,
      subapp,
      recordId,
      note: values?.text,
      attachments,
      parentId,
      messageBody,
      tenantId,
      subject: `${user.simpleFullName || user.name} added a comment`,
    });

    return {
      success: true,
      data: clone(data),
    };
  } catch (e) {
    return {
      error: true,
      message:
        e instanceof Error
          ? e.message
          : 'An unexpected error occurred while creating the comment.',
    };
  }
}

export async function fetchComments({
  recordId,
  sort,
  limit,
  skip,
  subapp,
  workspaceURL,
  exclude,
}: {
  recordId: ID;
  sort?: SORT_TYPE;
  limit?: number;
  skip?: number;
  subapp: SUBAPP_CODES;
  workspaceURL: string;
  exclude?: ID[];
}): ActionResponse<Cloned<FindCommentsData>> {
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

  if (!isCommentEnabled({subapp, workspace})) {
    return {
      error: true,
      message: await t('Comments are not enabled'),
    };
  }

  const shouldUseAuth = (subapp: SUBAPP_CODES) =>
    ![
      SUBAPP_CODES.forum,
      SUBAPP_CODES.events,
      SUBAPP_CODES.news,
      SUBAPP_CODES.quotations,
    ].includes(subapp);

  const {error, message} = await findByID({
    subapp,
    id: recordId,
    workspaceURL,
    workspace,
    withAuth: shouldUseAuth(subapp),
    tenantId,
  });

  if (error) {
    return {
      error: true,
      message: await t(message || 'Record not found.'),
    };
  }

  const modelName = ModelMap[subapp];

  if (!modelName) {
    return {
      error: true,
      message: await t('Invalid model type'),
    };
  }

  try {
    const data = await findComments({
      recordId,
      modelName,
      sort,
      limit,
      skip,
      subapp,
      tenantId,
      exclude,
    });
    return {
      success: true,
      data: clone(data),
    };
  } catch (error) {
    console.error('Error while fetching comments:', error);
    return {
      error: true,
      message: 'An unexpected error occurred while fetching the comments.',
    };
  }
}
