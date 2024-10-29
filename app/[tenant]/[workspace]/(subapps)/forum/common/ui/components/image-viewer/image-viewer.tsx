import {useEffect, useState} from 'react';
import Image from 'next/image';

export const ImageViewer = ({
  file,
  altText,
}: {
  file: File;
  altText?: string;
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!imageUrl) return null;

  return (
    <Image
      fill
      src={imageUrl}
      alt={altText || file?.name}
      className="object-cover mx-auto"
    />
  );
};

export default ImageViewer;
