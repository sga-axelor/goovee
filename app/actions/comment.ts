'use server';

import {headers} from 'next/headers';

// ---- CORE IMPORTS ---- //
import {getTranslation} from '@/i18n/server';
import {addComment, findComments, upload} from '@/orm/comment';
import {TENANT_HEADER} from '@/middleware';
import {getSession} from '@/auth';
import {ModelType} from '@/types';
import {findWorkspace} from '@/orm/workspace';

export async function createComment(formData: any, valueString: string) {
  let attachments: string[] = [];

  const {
    values,
    workspaceURL,
    modelID,
    type,
    parentId,
    messageBody = null,
  } = JSON.parse(valueString) as {
    values?: any;
    workspaceURL: string;
    type: ModelType;
    modelID: string | number;
    parentId?: any;
    messageBody?: any;
  };

  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return {
      error: true,
      message: await getTranslation('TenantId is required.'),
    };
  }

  if (values?.attachments?.length) {
    try {
      const response: any = await upload(formData, workspaceURL, tenantId);
      if (!response) {
        return {
          error: true,
          message: response.message || 'Error while uploading attachment.',
        };
      }
      attachments = response.data;
    } catch (error: any) {
      console.error('Submission error:', error);
      return {
        error: true,
        message: 'An unexpected error occurred.',
      };
    }
  }

  try {
    const response: any = await addComment({
      type,
      workspaceURL,
      model: {id: modelID},
      note: values?.text,
      attachments,
      parentId,
      messageBody,
      tenantId,
    });

    if (response.error) {
      return {
        error: true,
        message: response.message ?? 'Error creating comment.',
      };
    } else {
      return {
        success: true,
        message: 'Comment created successfully.',
        data: response,
      };
    }
  } catch (error) {
    console.error('Error submitting comment:', error);
    return {
      error: true,
      message: 'An unexpected error occurred while creating the comment.',
    };
  }
}

export async function fetchComments({
  model,
  sort,
  limit,
  page,
  type,
  workspaceURL,
}: any) {
  const session = await getSession();

  const user = session?.user;

  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return {
      error: true,
      message: await getTranslation('TenantId is required.'),
    };
  }

  const workspace = await findWorkspace({user, url: workspaceURL, tenantId});

  if (!workspace) {
    return {error: true, message: await getTranslation('Invalid workspace')};
  }

  try {
    const response = await findComments({
      model,
      sort,
      limit,
      page,
      type,
      workspaceURL,
      tenantId,
    });

    return response.error
      ? {error: true, message: 'Error while fetching comments.'}
      : response;
  } catch (error) {
    console.error('Error while fetching comments:', error);
    return {
      error: true,
      message: 'An unexpected error occurred while fetching the comments.',
    };
  }
}
