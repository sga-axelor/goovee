import React, {useState} from 'react';
import {emojis, HOST} from '../constants';
import EmojiPopup from './emojiPopup';
import {SmilePlus, Reply} from 'lucide-react';

const MenuReaction = ({
  onEmojiClick,
  onReplyClick,
  isReply,
}: {
  onEmojiClick: (name: string) => void;
  onReplyClick: () => void;
  isReply: boolean;
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const firstThreeEmojis = Object.entries(emojis).slice(0, 3);

  return (
    <div className="absolute right-0 top-0 mt-[-20px] mr-2">
      <div className="bg-white shadow-md rounded-full p-1 flex space-x-1">
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
        />
      )}
    </div>
  );
};

export default MenuReaction;
