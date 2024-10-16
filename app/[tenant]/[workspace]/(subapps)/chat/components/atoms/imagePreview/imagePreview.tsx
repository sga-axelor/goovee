'use client';

import React, {useState, useEffect} from 'react';
import {getFilePreview} from '../../../api';
import {File} from '../../../types/types';
import {EyeIcon} from 'lucide-react';
import {FullscreenImagePreview} from '../fullScreenImagePreview/fullScreenImagePreview';

export const ImagePreview = ({file, token}: {file: File; token: string}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [urlFilePreview, setUrlFilePreview] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const fetchFilePreview = async () => {
      const url = await getFilePreview(file.id, token);
      setUrlFilePreview(url);
    };
    fetchFilePreview();
  }, [file.id, token]);

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const renderPreview = () => {
    return (
      <img
        src={urlFilePreview || ''}
        alt={file.name}
        className="max-w-[400px] max-h-[400px] w-auto h-auto object-contain rounded"
      />
    );
  };
  return (
    <div>
      <div
        className="mb-1 relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        {renderPreview()}
        {isHovered && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded cursor-pointer"
            onClick={() => setIsFullscreen(true)}>
            <EyeIcon size={24} className="text-white" />
          </div>
        )}
      </div>
      <FullscreenImagePreview
        isFullscreen={isFullscreen}
        setIsFullscreen={setIsFullscreen}
        isZoomed={isZoomed}
        toggleZoom={toggleZoom}
        urlFilePreview={urlFilePreview}
        file={file}
      />
    </div>
  );
};
