/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import {emojis} from '../../../constants/emojis';
import styles from './index.module.css';
import {getHOST} from '../../../utils';

export const EmojiItem = ({
  onEmojiClick,
  name,
  count,
  small = false,
}: {
  onEmojiClick: (name: string) => void;
  name: string;
  count?: number;
  small?: boolean;
}) => {
  const filename = emojis[name];
  const handleClick = () => {
    onEmojiClick(name);
  };

  if (filename) {
    const className = small
      ? styles.emojiPickerItemSmall
      : styles.emojiPickerItem;
    return (
      <div
        onClick={handleClick}
        className={`${className} inline-flex cursor-pointer items-center`}>
        <div className="bg-gray-200 rounded px-2 py-1 text-xs mr-1 mb-1 flex items-center">
          <img
            src={`${getHOST()}/static/emoji/${filename}`}
            alt={name}
            className="w-4 h-4 mr-1"
          />
          <span>{count}</span>
        </div>
      </div>
    );
  }

  return null;
};
