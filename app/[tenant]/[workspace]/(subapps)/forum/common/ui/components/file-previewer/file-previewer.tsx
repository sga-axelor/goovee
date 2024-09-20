'use client';
import Image from 'next/image';
import React from 'react';

// ---- LOCAL IMPORTS ---- //
import {PdfViewer} from '@/subapps/forum/common/ui/components';

export const FilePreviewer = React.memo(({file}: {file: any}) => {
  return (
    <div className="w-full">
      {file?.type === 'application/pdf' ? (
        <>
          <PdfViewer file={file} />
        </>
      ) : (
        <div className="px-2 border h-10 xl:h-12 flex items-center font-xl mb-2 rounded-md gap-2">
          <div className="w-6 h-6 rounded-lg relative">
            <Image
              fill
              src={
                ['text/plain', 'application/msword'].includes(file?.type)
                  ? '/images/doc.jpeg'
                  : '/images/xlsx.jpeg'
              }
              alt={file?.type || 'file type'}
              objectFit="cover"
            />
          </div>
          {file?.name}
        </div>
      )}
    </div>
  );
});
FilePreviewer.displayName = 'FilePreviewer';
export default FilePreviewer;
