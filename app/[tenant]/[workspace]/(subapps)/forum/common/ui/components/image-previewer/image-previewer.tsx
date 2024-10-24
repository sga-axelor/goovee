'use client';

import React, {useEffect, useState} from 'react';

// ---- LOCAL IMPORTS ---- //
import { MAX_IMAGES_BEFORE_OVERLAY } from '@/subapps/forum/common/constants';

interface ImageItem {
  file: File;
  altText: string;
}
interface ImagePreviewerProps {
  images: ImageItem[];
}

export const ImagePreviewer: React.FC<ImagePreviewerProps> = ({images}) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    const urls = images.map((image: any) => {
      if (image.file instanceof File) {
        const url = URL.createObjectURL(image.file);
        return url;
      }
      return '';
    });

    setImageUrls(urls);

    return () => {
      urls.forEach(url => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [images]);


  const showOverlay = images.length > MAX_IMAGES_BEFORE_OVERLAY;

  return (
    <div
      className={`w-full grid grid-cols-${images.length >= 3 ? '3' : images.length} gap-6`}>
      {imageUrls.slice(0, 3).map((url: any, index) => (
        <div key={index} className="relative">
          <div
            className="w-full h-[12.813rem] bg-no-repeat bg-center bg-cover"
            style={{backgroundImage: url ? `url(${url})` : 'none'}}></div>
          {index === 2 && showOverlay && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-5xl font-semibold">
              +{images.length - 3}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
