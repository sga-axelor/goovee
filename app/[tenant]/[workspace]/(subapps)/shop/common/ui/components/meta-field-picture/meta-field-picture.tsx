/* eslint-disable @next/next/no-img-element */
import React from 'react';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import type {ID} from '@/types';
import {SUBAPP_CODES} from '@/constants';

export function MetaFieldPicture({
  image,
  index,
  productId,
}: {
  image: any;
  index?: any;
  productId: ID;
}) {
  const {workspaceURI} = useWorkspace();

  return (
    <div key={index} className="w-64">
      <img
        src={`${workspaceURI}/${SUBAPP_CODES.shop}/api/product/${productId}/meta-field/file/${image?.id}`}
        alt={image.fileName || `Image ${index + 1}`}
        className="w-64 h-32 object-contain rounded"
      />
    </div>
  );
}
