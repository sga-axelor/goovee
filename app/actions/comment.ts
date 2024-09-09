'use client';

// ---- CORE IMPORTS ---- //
import {ModelType} from '@/types';
import {addComment, upload} from '@/orm/comment';

export async function createComment({
  formData,
  values,
  workspaceURL,
  modelID,
  type,
}: {
  formData: any;
  values: any;
  workspaceURL: string;
  type: ModelType;
  modelID: string | number;
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
      subject: values.text,
      attachments: attachmentIDs,
    });
    if (!response) {
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
