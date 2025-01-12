/* eslint-disable @next/next/no-img-element */
import React from 'react';
import {getImageURL} from '@/utils/files';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

export function MetaFieldPicture({image, index}: {image: any; index?: any}) {
  const {tenant} = useWorkspace();

  return (
    <div key={index} className="w-64">
      <img
        src={getImageURL(image?.id, tenant)}
        alt={image.fileName || `Image ${index + 1}`}
        className="w-64 h-32 object-contain rounded"
      />
    </div>
  );
}
