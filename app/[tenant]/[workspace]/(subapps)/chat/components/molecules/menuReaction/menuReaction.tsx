'use client';

import React, {useState, useRef} from 'react';
import {HOST} from '../../../constants';
import {EmojiPopup} from '../../atoms';
import {SmilePlus, Reply} from 'lucide-react';
import {focusInputMessage} from '../../../utils/focusOnInput';
import {firtThreeEmojis} from '../../../constants/emojis';

export const MenuReaction = ({
  onEmojiClick,
  onReplyClick,
  isReply,
}: {
  onEmojiClick: (name: string) => void;
  onReplyClick: () => void;
  isReply: boolean;
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const firstThreeEmojis = Object.entries(firtThreeEmojis).slice(0, 3);
  const triggerRef = useRef(null);

  return (
    <div className="absolute right-0 top-0 mt-[-20px] mr-2">
      <div
        className="bg-white shadow-md rounded-full p-1 flex space-x-1"
        onClick={focusInputMessage}>
        {firstThreeEmojis.map(([emojiName, filename]) => (
          <button
            key={emojiName}
            className="hover:bg-gray-200 rounded-full p-1"
            onClick={() => onEmojiClick(emojiName)}>
            <img
              src={`${HOST}/static/emoji/${filename}`}
              alt={emojiName}
              className="w-6 h-6"
            />
          </button>
        ))}
        <button
          ref={triggerRef}
          className="hover:bg-gray-200 rounded-full p-1 text-gray-600"
          onClick={() => setShowPopup(!showPopup)}>
          <SmilePlus />
        </button>
        {!isReply && (
          <button
            className="hover:bg-gray-200 rounded-full p-1 text-gray-600"
            onClick={onReplyClick}>
            <Reply size={24} />
          </button>
        )}
      </div>
      {showPopup && (
        <EmojiPopup
          onEmojiClick={onEmojiClick}
          onClose={() => setShowPopup(false)}
          triggerRef={triggerRef}
        />
      )}
    </div>
  );
};
