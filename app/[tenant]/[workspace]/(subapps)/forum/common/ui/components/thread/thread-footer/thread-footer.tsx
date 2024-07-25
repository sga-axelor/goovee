'use client';

import {MdOutlineThumbUp} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {Input} from '@/ui/components';

// ---- LOCAL IMPORTS ---- //
import {COMMENT} from '@/subapps/forum/common/constants';
import {Comments} from '@/subapps/forum/common/ui/components';

export const ThreadFooter = ({
  showComments,
  toggleComments,
}: {
  showComments: boolean;
  toggleComments: () => void;
}) => {
  return (
    <div className="border-t">
      <div className="flex items-center gap-6 px-4 py-2">
        <MdOutlineThumbUp className="w-6 h-6 cursor-pointer" />
        <Input
          className="placeholder:text-sm placeholder:text-palette-mediumGray border"
          placeholder={i18n.get(COMMENT)}
        />
      </div>
      {showComments && <Comments toggleComments={toggleComments} />}
    </div>
  );
};

export default ThreadFooter;
