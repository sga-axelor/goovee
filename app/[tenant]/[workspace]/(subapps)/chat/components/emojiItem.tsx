import React from 'react';
import styles from '../css/index.module.css';
import {emojis, HOST} from '../constants';

export const EmojiItem = ({
  onClick,
  name,
  count,
  small = false,
}: {
  onClick?: (name: string) => void;
  name: string;
  count?: number;
  small?: boolean;
}) => {
  const filename = emojis[name];
  const handleClick = () => {
    onClick && onClick(name);
  };

  if (filename) {
    let className = small
      ? styles.emojiPickerItemSmall
      : styles.emojiPickerItem;
    return (
      <div
        onClick={handleClick}
        className={`${className} inline-flex items-center`}>
        <div className="bg-gray-200 rounded px-2 py-1 text-xs mr-1 mb-1 flex items-center">
          <img
            src={`${HOST}/static/emoji/${filename}`}
            alt={name}
            className="w-4 h-4 mr-1" // Ajustez la taille selon vos besoins
          />
          <span>{count}</span>
        </div>
      </div>
    );
  }

  return null; // Retourne null si l'emoji n'est pas trouvé
};

export default EmojiItem;
