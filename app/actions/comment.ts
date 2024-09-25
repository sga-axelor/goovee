'use client';

// ---- CORE IMPORTS ---- //
import {ModelType} from '@/types';
import {addComment, findComments, upload} from '@/orm/comment';

export async function createComment({
  formData,
  values,
  workspaceURL,
  modelID,
  type,
  parentId,
  messageBody = null,
  relatedModel = null,
}: {
  formData?: any;
  values?: any;
  workspaceURL: string;
  type: ModelType;
  modelID: string | number;
  parentId?: any;
  relatedModel?: any;
  messageBody?: any;
}) {
  let attachmentIDs: string[] = [];

  if (values?.attachments?.length) {
    try {
      const response: any = await upload(formData, workspaceURL);
      if (!response) {
        return {
          error: true,
          message: response.message || 'Error while uploading attachment.',
        };
      }
      attachmentIDs = response.data;
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
      attachments: attachmentIDs,
      parentId,
      relatedModel,
      messageBody,
    });

    if (response.error) {
      return {
        error: true,
        message: 'Error creating comment.',
      };
    } else {
      return {
        success: true,
        message: 'Comment created successfully.',
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
  try {
    const response = await findComments({
      model,
      sort,
      limit,
      page,
      type,
      workspaceURL,
    });
    if (response.error) {
      return {
        error: true,
        message: 'Error while fetching comments.',
      };
    } else {
      return response;
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      error: true,
      message: 'An unexpected error occurred while fetching the comments.',
    };
  }
}
