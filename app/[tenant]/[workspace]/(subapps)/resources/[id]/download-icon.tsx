'use client';

import {MdOutlineFileDownload} from 'react-icons/md';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {download} from '@/subapps/resources/common/utils';

export default function DownloadIcon({record}: any) {
  const {tenant} = useWorkspace();

  const handleDownload = () => {
    download(record, tenant);
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
