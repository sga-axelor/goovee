'use client';

import {MdOutlineFileDownload} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {Button} from '@/ui/components';
import {cn} from '@/utils/css';

export function DownloadButton({
  downloadURL,
  title,
  showTitle,
  className,
}: {
  title: string;
  downloadURL: string;
  showTitle?: boolean;
  className?: string;
}) {
  return (
    <Button
      asChild
      variant="outline"
      className={cn(
        'w-full flex items-center gap-2 bg-white hover:bg-white text-success hover:text-success border-success font-medium text-base',
        className,
      )}>
      <a href={downloadURL}>
        <MdOutlineFileDownload className="h-6 w-6" />
        {showTitle && title}
      </a>
    </Button>
  );
}

export default DownloadButton;
