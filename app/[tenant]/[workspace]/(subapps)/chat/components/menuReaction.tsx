import React, {useState} from 'react';
import {emojis, HOST} from '../constants';
import EmojiPopup from './emojiPopup';

const MenuReaction = ({
  onEmojiClick,
}: {
  onEmojiClick: (name: string) => void;
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
              className="w-6 h-6" // Ajustez la taille selon vos besoins
            />
          </button>
        ))}
        <button
          className="hover:bg-gray-200 rounded-full p-1 text-gray-600"
          onClick={() => setShowPopup(!showPopup)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>
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
