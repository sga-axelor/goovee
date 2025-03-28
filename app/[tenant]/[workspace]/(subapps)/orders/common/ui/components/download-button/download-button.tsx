'use client';

import {MdOutlineFileDownload} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {Button} from '@/ui/components';

export function DownloadButton({
  downloadURL,
  title,
}: {
  title: string;
  downloadURL: string;
}) {
  return (
    <Button
      asChild
      variant="outline"
      className="w-full flex items-center gap-2 bg-white hover:bg-white text-success hover:text-success border-success font-medium text-base">
      <a href={downloadURL}>
        <MdOutlineFileDownload className="h-6 w-6" />
        {title}
      </a>
    </Button>
  );
}

export default DownloadButton;
