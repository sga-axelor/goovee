'use client';

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
  return (
    <div className="grid grid-cols-3 gap-6">
      {PLACEHOLDER_IMAGES.slice(0, 3).map((imageUrl, index) => (
        <div key={index} className="relative">
          <div
            className="w-full h-[205px] bg-sky-100 cursor-pointer"
            style={{backgroundImage: `url(${imageUrl})`}}></div>
          {index === 2 && showOverlay && (
            <div className="absolute inset-0 flex items-center cursor-pointer justify-center bg-black bg-opacity-50 text-white text-5xl font-semibold">
              +{PLACEHOLDER_IMAGES.length - 3}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
