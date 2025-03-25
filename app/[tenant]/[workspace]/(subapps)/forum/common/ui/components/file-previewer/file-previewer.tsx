'use client';
import React, {useMemo} from 'react';

// ---- CORE IMPORTS ---- //
import {DynamicIcon, DocViewer} from '@/ui/components';
import {getFileTypeIcon, getIconColor} from '@/utils/files';

export const FilePreviewer = React.memo(({file}: {file: any}) => {
  const icon = getFileTypeIcon(file?.type);
  const iconColor = getIconColor(icon);
  const url = useMemo(
    () =>
      file instanceof Blob || file instanceof File
        ? URL.createObjectURL(file)
        : file.url,
    [file],
  );

  if (!file.id) {
    return;
  }
  return (
    <div className="w-full">
      {file?.type === 'application/pdf' ? (
        <DocViewer documents={[{uri: url}]} className="overflow-x-hidden" />
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

          <a
            href={file.url}
            download
            className="text-blue-600 underline cursor-pointer marker:text-black">
            {file?.name}
          </a>
        </div>
      )}
    </div>
  );
});
FilePreviewer.displayName = 'FilePreviewer';
export default FilePreviewer;
