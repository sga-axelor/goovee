'use client';
import React from 'react';

// ---- LOCAL IMPORTS ---- //
import {DynamicIcon, PdfViewer} from '@/subapps/forum/common/ui/components';
import {getFileTypeIcon, getIconColor} from '@/subapps/forum/common/utils/file';

export const FilePreviewer = React.memo(({file}: {file: any}) => {
  const icon = getFileTypeIcon(file?.type);
  const iconColor = getIconColor(icon);

  return (
    <div className="w-full">
      {file?.type === 'application/pdf' ? (
        <>
          <PdfViewer file={file} />
        </>
      ) : (
        <div className="px-2 border h-10 xl:h-12 flex items-center font-xl mb-2 rounded-md gap-2">
          <div className="w-6 h-6 rounded-lg relative">
            <DynamicIcon
              icon={icon}
              className={'h-6 w-6 shrink-0'}
              {...(iconColor
                ? {
                    style: {
                      color: iconColor,
                    },
                  }
                : {})}
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
