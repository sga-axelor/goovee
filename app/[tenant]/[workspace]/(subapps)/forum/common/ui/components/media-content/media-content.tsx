'use client';

import {useEffect, useState} from 'react';
import Image from 'next/image';

// ---- CORE IMPORTS ---- //
import {MetaFile} from '@/types';
import {getImageURL} from '@/utils/image';
import { DynamicIcon } from '@/ui/components';
import { getFileTypeIcon, getIconColor } from '@/utils/files';

// ---- LOCAL IMPORTS ---- //
import {findMedia} from '@/subapps/forum/common/action/action';

export const MediaContent = ({groupId = ''}: {groupId: string}) => {
  const [media, setMedia] = useState([]);
  const [attachmentList, setAttachmentList] = useState<{metaFile: MetaFile}[]>(
    [],
  );

  useEffect(() => {
    findMedia(groupId).then(setMedia);
  }, []);

  useEffect(() => {
    media.forEach(
      (item: {
        attachmentList: {
          metaFile: MetaFile;
        }[];
      }) => {
        setAttachmentList(prev => [...prev, ...item.attachmentList]);
      },
    );
  }, [media]);

  return (
    <div className="w-full bg-white rounded-lg p-4 grid grid-cols-3 gap-3 mt-6">
      {attachmentList.map((item, i) => {
        const icon = getFileTypeIcon(item?.metaFile?.fileType || '');
        const iconColor = getIconColor(icon);
        return (
          <div key={i} className="w-full h-[9.375rem] relative">
            {item.metaFile.fileType?.startsWith('image') ? (
              <Image
                fill
                src={getImageURL(item.metaFile.id)}
                alt={item.metaFile.fileName}
              />
            ) : (
              <div className="absolute top-0 left-0 w-full h-full bg-muted flex items-end">
                <div className="px-2 border h-10 xl:h-12 flex items-center font-xl  rounded-md gap-2 w-full bg-background">
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
                  {item.metaFile?.fileName}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MediaContent;
