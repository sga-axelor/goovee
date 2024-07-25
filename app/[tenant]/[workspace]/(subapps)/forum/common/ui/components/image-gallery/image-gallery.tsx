'use client';

import {useState} from 'react';

// ---- LOCAL IMPORTS ---- //
import {ThreadPopup} from '@/subapps/forum/common/ui/components';

const PLACEHOLDER_IMAGES = [
  'https://via.placeholder.com/300',
  'https://via.placeholder.com/300',
  'https://via.placeholder.com/300',
  'https://via.placeholder.com/300',
  'https://via.placeholder.com/300',
  'https://via.placeholder.com/300',
];
const showOverlay = PLACEHOLDER_IMAGES.length > 3;

export const ImageGallery = () => {
  const [openPopUp, setOpenPopUp] = useState(false);

  const openThreadPopup = () => {
    setOpenPopUp(true);
  };

  const closeThreadPopup = () => {
    setOpenPopUp(false);
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-6" onClick={openThreadPopup}>
        {PLACEHOLDER_IMAGES.slice(0, 3).map((imageUrl, index) => (
          <div key={index} className="relative">
            <div
              className="w-full h-[205px] bg-no-repeat bg-center bg-cover cursor-pointer"
              style={{backgroundImage: `url(${imageUrl})`}}></div>
            {index === 2 && showOverlay && (
              <div className="absolute inset-0 flex items-center cursor-pointer justify-center bg-black bg-opacity-50 text-white text-5xl font-semibold">
                +{PLACEHOLDER_IMAGES.length - 3}
              </div>
            )}
          </div>
        ))}
      </div>
      <ThreadPopup
        images={PLACEHOLDER_IMAGES}
        open={openPopUp}
        onClose={closeThreadPopup}
      />
    </>
  );
};

export default ImageGallery;
