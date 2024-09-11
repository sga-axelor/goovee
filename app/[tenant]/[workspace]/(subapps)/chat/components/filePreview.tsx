import React from 'react';
import {API_URL} from '../api/api';

interface FileProps {
  file: {
    id: string;
    name: string;
    extension: string;
    mime_type: string;
  };
}

const FilePreview: React.FC<FileProps> = ({file}) => {
  const isImage = file.mime_type.startsWith('image/');
  const isVideo = file.mime_type.startsWith('video/');
  const isPDF = file.mime_type === 'application/pdf';

  const renderPreview = () => {
    if (isImage) {
      return (
        <img
          src={`${API_URL}/files/${file.id}/preview`}
          alt={file.name}
          className="max-w-full h-auto rounded"
        />
      );
    } else if (isVideo) {
      return (
        <video
          src={`${API_URL}/files/${file.id}/preview`}
          className="max-w-full h-auto rounded"
          controls
        />
      );
    } else if (isPDF) {
      return (
        <embed
          src={`${API_URL}/files/${file.id}/preview`}
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

export default FilePreview;
