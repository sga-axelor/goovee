'use client';

import React from 'react';
import {useRouter} from 'next/navigation';
import {MdOutlineFileDownload} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {parseDate} from '@/utils/date';
import {i18n} from '@/i18n';
import {download, getFileTypeIcon, getIconColor} from '@/utils/files';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {cn} from '@/utils/css';

// ---- LOCAL IMPORTS ---- //
import {DynamicIcon} from '@/subapps/resources/common/ui/components/dynamic-icon';

export function ResourceList({resources}: any) {
  const router = useRouter();
  const {workspaceURI, tenant} = useWorkspace();

  const handleRedirection = (resource: any) => () => {
    router.push(`${workspaceURI}/resources/${resource.id}`);
  };

  const handleDownload = (record: any) => (event: React.MouseEvent) => {
    event.stopPropagation();
    download(record, tenant);
  };

  return (
    <div className="rounded-lg bg-white py-2">
      {resources?.length ? (
        resources?.map((resource: any, index: number) => {
          const author = resource.createdBy?.name || '--';
          const date = parseDate(resource?.createdOn) || '--';
          const size = resource?.metaFile?.sizeText || '--';

          const icon = getFileTypeIcon(resource.metaFile?.fileType);
          const iconColor = getIconColor(icon);
          const isLast = index === resources.length - 1;

          return (
            <div
              className={cn('py-2 px-4 space-y-2 cursor-pointer', {
                'border-b': !isLast,
              })}
              key={resource.id}
              onClick={handleRedirection(resource)}>
              <div className="leading-5 text-sm space-y-2">
                <div className="flex items-center">
                  <div className="flex items-center gap-2 grow">
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
                    <h3 className="font-semibold line-clamp-1">
                      {resource.fileName}
                    </h3>
                  </div>
                  <div className="flex gap-16 md:gap-12 lg:gap-16 shrink-0 justify-between">
                    <p className="hidden sm:inline-block whitespace-nowrap">
                      {author}
                    </p>
                    <p className="hidden sm:inline-block whitespace-nowrap">
                      {date}
                    </p>
                    <p className="hidden sm:inline-block whitespace-nowrap">
                      {size}
                    </p>
                    <MdOutlineFileDownload
                      className="shrink-0 h-6 w-6 bg-success-light text-success cursor-pointer"
                      onClick={handleDownload(resource)}
                    />
                  </div>
                </div>
                <div className="sm:hidden flex items-center justify-between">
                  <p className="line-clamp-1">{author}</p>
                  <p className="line-clamp-1">{date}</p>
                  <p className="line-clamp-1">{size}</p>
                </div>
              </div>
              {resource?.metaFile?.description && (
                <p className="leading-4 text-xs line-clamp-2">
                  {i18n.get('Description')}: {resource?.metaFile?.description}
                </p>
              )}
            </div>
          );
        })
      ) : (
        <p className="py-2 px-4">{i18n.get('No resources available.')}</p>
      )}
    </div>
  );
}

export default ResourceList;
