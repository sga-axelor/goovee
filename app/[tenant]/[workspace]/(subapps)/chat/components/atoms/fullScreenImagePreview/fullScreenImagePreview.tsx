import React from 'react';
import {XIcon, ZoomInIcon, ZoomOutIcon} from 'lucide-react';

export const FullscreenImagePreview = ({
  isFullscreen,
  setIsFullscreen,
  isZoomed,
  toggleZoom,
  urlFilePreview,
  file,
}: {
  isFullscreen: boolean;
  setIsFullscreen: (value: boolean) => void;
  isZoomed: boolean;
  toggleZoom: () => void;
  urlFilePreview: any;
  file: any;
}) => {
  if (!isFullscreen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 overflow-auto">
      <div className={`relative ${isZoomed ? '' : 'max-w-4xl max-h-full'}`}>
        <img
          src={urlFilePreview || ''}
          alt={file.name}
          className={`${
            isZoomed ? 'w-auto h-auto' : 'max-w-full max-h-full object-contain'
          }`}
        />
      </div>
      <div className="fixed top-4 right-4 flex space-x-4">
        <button className="text-white hover:text-gray-300" onClick={toggleZoom}>
          {isZoomed ? <ZoomOutIcon size={24} /> : <ZoomInIcon size={24} />}
        </button>
        <button
          className="text-white hover:text-gray-300"
          onClick={() => setIsFullscreen(false)}>
          <XIcon size={24} />
        </button>
      </div>
    </div>
  );
};
