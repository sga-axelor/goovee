'use client';

import {MdOutlineFileDownload} from 'react-icons/md';

// ---- LOCAL IMPORTS ---- //
import {download} from '@/subapps/resources/common/utils';

export default function DownloadIcon({record}: any) {
  const handleDownload = () => {
    download(record);
  };

  return (
    <>
      <MdOutlineFileDownload
        className="h-10 w-10 bg-success-light text-success cursor-pointer"
        onClick={handleDownload}
      />
    </>
  );
}
