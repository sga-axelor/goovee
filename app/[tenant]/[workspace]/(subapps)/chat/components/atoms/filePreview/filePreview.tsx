'use client';

import React, {useEffect, useState} from 'react';
import {getFilePreview} from '../../../api';
import {FileIcon, VideoIcon, FileTextIcon, EyeIcon} from 'lucide-react';
import {FullscreenImagePreview} from '..';
import {File} from '../../../types/types';

export const FilePreview = ({file, token}: {file: File; token: string}) => {
  const [urlFilePreview, setUrlFilePreview] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const isImage = file.mime_type.startsWith('image/');
  const isVideo = file.mime_type.startsWith('video/');
  const isPDF = file.mime_type === 'application/pdf';
  useEffect(() => {
    const fetchFilePreview = async () => {
      const url = await getFilePreview(file.id, token);
      setUrlFilePreview(url);
    };
    if (isImage) {
      fetchFilePreview();
    }
  }, [file.id, token, isImage]);

  const renderPreview = () => {
    if (isImage) {
      return (
        <img
          src={urlFilePreview || ''}
          alt={file.name}
          className="max-w-full h-auto rounded"
        />
      );
    } else if (isVideo) {
      return <VideoIcon size={48} className="text-blue-500" />;
    } else if (isPDF) {
      return <FileTextIcon size={48} className="text-red-500" />;
    } else {
      return <FileIcon size={48} className="text-gray-500" />;
    }
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <>
      <div
        className="m-1 flex flex-col items-center relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        <div className="mb-1 relative">
          {renderPreview()}
          {isHovered && isImage && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded cursor-pointer"
              onClick={() => setIsFullscreen(true)}>
              <EyeIcon size={24} className="text-white" />
            </div>
          )}
        </div>
        <p className="text-xs text-center truncate max-w-full">{file.name}</p>
      </div>
      <FullscreenImagePreview
        isFullscreen={isFullscreen}
        setIsFullscreen={setIsFullscreen}
        isZoomed={isZoomed}
        toggleZoom={toggleZoom}
        urlFilePreview={urlFilePreview}
        file={file}
      />
    </>
  );
};
