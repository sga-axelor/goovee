import React from 'react';

export function MetaFieldPicture({image, index}: {image: any; index?: any}) {
  return (
    <div key={index} className="w-64">
      <img
        src={`${process.env.NEXT_PUBLIC_AOS_URL}/ws/rest/com.axelor.meta.db.MetaFile/${image.id}/content/download`}
        alt={image.fileName || `Image ${index + 1}`}
        className="w-64 h-32 object-contain rounded"
      />
    </div>
  );
}
