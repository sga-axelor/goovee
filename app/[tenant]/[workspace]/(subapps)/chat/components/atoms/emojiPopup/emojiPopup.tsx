'use client';

import React from 'react';
import {emojis, HOST} from '../../../constants';

export const EmojiPopup = ({
  onEmojiClick,
  onClose,
}: {
  onEmojiClick: (name: string) => void;
  onClose: () => void;
}) => {
  return (
    <div className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-lg p-2 z-10">
      <div className="w-48 max-h-48 overflow-auto">
        <div className="grid grid-cols-6 gap-1">
          {Object.entries(emojis)
            .slice(3)
            .map(([emojiName, filename]) => (
              <button
                key={emojiName}
                className="hover:bg-gray-200 rounded p-1 flex items-center justify-center"
                onClick={() => {
                  onEmojiClick(emojiName);
                  onClose();
                }}>
                <img
                  src={`${HOST}/static/emoji/${filename}`}
                  alt={emojiName}
                  className="w-6 h-6 object-contain"
                />
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};
