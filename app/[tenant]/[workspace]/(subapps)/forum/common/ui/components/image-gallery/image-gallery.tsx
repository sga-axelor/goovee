'use client';

import {useState} from 'react';

// ---- CORE IMPORTS ---- //
import {getImageURL} from '@/utils/image';

// ---- LOCAL IMPORTS ---- //
import {ThreadPopup} from '@/subapps/forum/common/ui/components';

export const ImageGallery = ({images}: {images: any}) => {
  const showOverlay = images.length > 3;

  const [openPopUp, setOpenPopUp] = useState(false);

  const openThreadPopup = () => {
    setOpenPopUp(true);
  };

  const closeThreadPopup = () => {
    setOpenPopUp(false);
  };

  return (
    <>
      <div
        className={`grid grid-cols-${images.length >= 3 ? '3' : images.length} gap-6`}
        onClick={openThreadPopup}>
        {images.slice(0, 3).map((image: any) => (
          <div key={image.id} className="relative">
            <div
              className="w-full h-[205px] bg-no-repeat bg-center bg-cover cursor-pointer"
              style={{
                backgroundImage: `url(${getImageURL(image?.metaFile?.id)})`,
              }}></div>
            {showOverlay && (
              <div className="absolute inset-0 flex items-center cursor-pointer justify-center bg-black bg-opacity-50 text-white text-5xl font-semibold">
                +{images.length - 3}
              </div>
            )}
          </div>
        ))}
      </div>
      <ThreadPopup
        images={images}
        open={openPopUp}
        onClose={closeThreadPopup}
      />
    </>
  );
};

export default ImageGallery;
