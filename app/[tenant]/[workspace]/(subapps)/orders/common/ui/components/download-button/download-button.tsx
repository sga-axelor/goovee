'use client';

import {MdOutlineFileDownload} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {Button} from '@/ui/components';

export function DownlaodButton({
  record,
  disabled,
  title,
  onDownload,
}: {
  record: any;
  disabled: boolean;
  title: string;
  onDownload: (record: any) => void;
}) {
  return (
    <Button
      variant="outline"
      className="w-full flex items-center gap-2 bg-white hover:bg-white text-success hover:text-success border-success font-medium text-base"
      disabled={disabled}
      onClick={() => onDownload(record)}>
      <MdOutlineFileDownload className="h-6 w-6" />
      {title}
    </Button>
  );
}

export default DownlaodButton;
