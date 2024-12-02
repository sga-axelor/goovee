'use client';

import React, {useEffect, useState} from 'react';
import Link from 'next/link';

// ---- CORE IMPORTS ---- //
import {Avatar, AvatarImage} from '@/ui/components/avatar';
import {i18n} from '@/i18n';

// ---- LOCAL IMPORTS ---- //
import {
  SHARE_ON_SOCIAL_MEDIA,
  SOCIAL_ICONS,
} from '@/subapps/news/common/constants';

type SocialMediaPrpos = {
  socialMediaSelect?: string;
};
type IconType = {
  key: number;
  name: string;
  color: string;
  image: string;
  redirectUrl: string;
};

export const SocialMedia = ({socialMediaSelect}: SocialMediaPrpos) => {
  const [filteredIcons, setFilteredIcons] = useState<IconType[]>([]);
  useEffect(() => {
    if (socialMediaSelect) {
      const selectedNames = new Set(socialMediaSelect.split(','));
      const matchedIcons = SOCIAL_ICONS.filter(icon =>
        selectedNames.has(icon.name),
      );
      setFilteredIcons(matchedIcons);
    } else {
      setFilteredIcons([]);
    }
  }, [socialMediaSelect]);

  return (
    <div className="bg-white rounded-lg p-4 flex flex-col gap-4">
      <div className="text-xl font-semibold text-black">
        {i18n.get(SHARE_ON_SOCIAL_MEDIA)}
      </div>
      <div className="flex gap-6">
        {filteredIcons.map(icon => (
          <Link
            key={icon.key}
            href={icon.redirectUrl}
            target="_blank"
            rel="noopener noreferrer">
            <Avatar
              key={icon.key}
              className={`w-8 h-8 bg-[${icon.color}] p-1 rounded cursor-pointer`}>
              <AvatarImage src={`${icon.image}`} />
            </Avatar>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SocialMedia;
