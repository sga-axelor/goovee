'use client';
import {useEffect, useState} from 'react';
import Image from 'next/image';

export const ImageViewer = ({
  file,
  altText,
}: {
  file: File;
  altText?: string;
}) => {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  return (
    <Image
      fill
      className="object-cover mx-auto"
      src={imageUrl}
      alt={altText || file?.name}
    />
  );
};

export default ImageViewer;
