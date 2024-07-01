'use client';

import React from 'react';

// ---- CORE IMPORTS ---- //
import {Avatar, AvatarImage} from '@/ui/components/avatar';

// ---- LOCAL IMPORTS ---- //
import {
  SHARE_ON_SOCIAL_MEDIA,
  SOCIAL_ICONS,
} from '@/subapps/news/common/constants';
import {i18n} from '@/subapps/news/common/utils';

export const SocialMedia = () => {
  return (
    <div className="bg-white rounded-lg p-4 flex flex-col gap-4">
      <div className="text-xl font-semibold text-palette-gray-400">
        {i18n.get(SHARE_ON_SOCIAL_MEDIA)}
      </div>
      <div className="flex gap-6">
        {SOCIAL_ICONS.map(icon => (
          <Avatar className={`w-8 h-8 bg-[${icon.color}] p-1 rounded`}>
            <AvatarImage src={`${icon.image}`} />
          </Avatar>
        ))}
      </div>
    </div>
  );
};

export default SocialMedia;
