'use client';

import {MdOutlineFileDownload} from 'react-icons/md';
import {download} from '@/subapps/resources/common/utils';

export default function DownloadIcon({record}: any) {
  const handleDownload = () => {
    download(record);
  };

  return (
    <>
      <MdOutlineFileDownload
        className="h-10 w-10 bg-muted text-muted-foreground cursor-pointer"
        onClick={handleDownload}
      />
    </>
  );
}
