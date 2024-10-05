'use client';

import React from 'react';
import {HOST} from '../../../constants';
import {FILES_API_ENDPOINT} from '../../../api/path-helpers';

interface FileProps {
  file: {
    id: string;
    name: string;
    extension: string;
    mime_type: string;
  };
}

export const FilePreview = ({file}) => {
  const isImage = file.mime_type.startsWith('image/');
  const isVideo = file.mime_type.startsWith('video/');
  const isPDF = file.mime_type === 'application/pdf';

  const renderPreview = () => {
    if (isImage) {
      return (
        <img
          src={`${HOST}${FILES_API_ENDPOINT}/${file.id}/preview`}
          alt={file.name}
          className="max-w-full h-auto rounded"
        />
      );
    } else if (isVideo) {
      return (
        <video
          src={`${HOST}${FILES_API_ENDPOINT}/${file.id}/preview`}
          className="max-w-full h-auto rounded"
          controls
        />
      );
    } else if (isPDF) {
      return (
        <embed
          src={`${HOST}${FILES_API_ENDPOINT}/${file.id}/preview`}
          type="application/pdf"
          className="w-full h-24 rounded"
        />
      );
    } else {
      return (
        <div className="bg-gray-200 flex items-center justify-center rounded p-4">
          <span className="text-gray-600">{file.extension.toUpperCase()}</span>
        </div>
      );
    }
  };

  return (
    <div className="m-1 flex flex-col items-center">
      <div className="mb-1">{renderPreview()}</div>
      <p className="text-xs text-center truncate max-w-full">{file.name}</p>
    </div>
  );
};
