'use client';

import React from 'react';
import Link from 'next/link';

// ---- CORE IMPORTS ---- //
import {Avatar, AvatarImage} from '@/ui/components/avatar';
import {i18n} from '@/i18n';

// ---- LOCAL IMPORTS ---- //
import {
  SHARE_ON_SOCIAL_MEDIA,
  SOCIAL_ICONS,
} from '@/subapps/news/common/constants';

type SocialMediaProps = {
  availableSocials?: string;
};

export const SocialMedia = ({
  availableSocials: availableSocialsProps,
}: SocialMediaProps) => {
  const availableSocials = SOCIAL_ICONS.filter(icon =>
    availableSocialsProps?.includes(icon.name),
  );

  return (
    <div className="bg-white rounded-lg p-4 flex flex-col gap-4">
      <div className="text-xl font-semibold text-black">
        {i18n.get(SHARE_ON_SOCIAL_MEDIA)}
      </div>

      <div className="flex gap-6">
        {availableSocials.map(({key, redirectUrl = '', color, image}) => (
          <Link
            key={key}
            href={redirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer">
            <Avatar
              className={`w-8 h-8 bg-[${color}] p-1 rounded cursor-pointer`}>
              <AvatarImage src={image} alt={`Visit ${redirectUrl}`} />
            </Avatar>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SocialMedia;
