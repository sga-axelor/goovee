'use client';

import React from 'react';
import {MdOutlineFileDownload} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {Separator} from '@/ui/components';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {download} from '@/utils/files';

interface Attachment {
  id: string;
  metaFile?: {
    id: string | number;
    fileName?: string;
  };
}
export const AttachmentList = ({
  title,
  items,
  width,
}: {
  title: string;
  items: any[];
  width?: string;
}) => {
  const {tenant} = useWorkspace();

  const handleDownload = async (attachment: Attachment) => {
    const {metaFile} = attachment;
    download(metaFile, tenant, {isMeta: true});
  };

  return (
    <div
      className={`bg-white h-max p-4 rounded-lg ${
        width ? `lg-${width}` : 'lg:w-2/5'
      }`}>
      <div className="font-semibold text-xl mb-4">{title}</div>
      <Separator />
      <div className="mt-4">
        {items?.map((item, i) => (
          <div
            key={item.id}
            className="mb-4 grid grid-cols-[4fr_2fr_1fr] gap-2 shrink-0 items-center">
            <p className="text-[16px] font-medium">
              {item?.metaFile?.fileName}
            </p>
            <div className="text-end">{item?.metaFile?.sizeText}</div>
            <div
              className="flex justify-end"
              onClick={() => handleDownload(item)}>
              <MdOutlineFileDownload className="text-2xl font-semibold cursor-pointer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttachmentList;
