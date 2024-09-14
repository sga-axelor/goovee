'use client';

import React from 'react';

// ---- CORE IMPORTS ---- //
import {Avatar, AvatarImage} from '@/ui/components/avatar';
import {i18n} from '@/i18n';

// ---- LOCAL IMPORTS ---- //
import {
  SHARE_ON_SOCIAL_MEDIA,
  SOCIAL_ICONS,
} from '@/subapps/news/common/constants';

export const SocialMedia = () => {
  return (
    <div className="bg-white rounded-lg p-4 flex flex-col gap-4">
      <div className="text-xl font-semibold text-black">
        {i18n.get(SHARE_ON_SOCIAL_MEDIA)}
      </div>
      <div className="flex gap-6">
        {SOCIAL_ICONS.map(icon => (
          <Avatar
            key={icon.key}
            className={`w-8 h-8 bg-[${icon.color}] p-1 rounded`}>
            <AvatarImage src={`${icon.image}`} />
          </Avatar>
        ))}
      </div>
    </div>
  );
};

export default SocialMedia;
