'use client';

import {MdOutlineThumbUp} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {Input} from '@/ui/components';

// ---- LOCAL IMPORTS ---- //
import {COMMENT} from '@/subapps/forum/common/constants';

export const ThreadFooter = () => {
  return (
    <div className="border-t px-4 py-2 flex flex-col gap-4">
      <div className="flex items-center gap-6">
        <MdOutlineThumbUp className="w-6 h-6 cursor-pointer" />
        <Input
          className="placeholder:text-sm placeholder:text-palette-mediumGray border"
          placeholder={i18n.get(COMMENT)}
        />
      </div>
      {/* All comments */}
      {false && <div></div>}
    </div>
  );
};

export default ThreadFooter;
