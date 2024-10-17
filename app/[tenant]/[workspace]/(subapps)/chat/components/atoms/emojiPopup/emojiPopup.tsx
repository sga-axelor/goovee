'use client';

import React, {useState, useEffect, useRef} from 'react';
import {HOST} from '../../../constants';
import {
  SmilePlus,
  Leaf,
  Plane,
  Medal,
  Lightbulb,
  Heart,
  Flag,
} from 'lucide-react';
import {
  smileysAndEmotion,
  animalsAndNature,
  travelAndPlaces,
  activities,
  objects,
  symbols,
  flags,
} from '../../../constants/emojis';

const categories = [
  {name: 'Smileys & Emotion', icon: SmilePlus, emojis: smileysAndEmotion},
  {name: 'Animals & Nature', icon: Leaf, emojis: animalsAndNature},
  {name: 'Travel & Places', icon: Plane, emojis: travelAndPlaces},
  {name: 'Activities', icon: Medal, emojis: activities},
  {name: 'Objects', icon: Lightbulb, emojis: objects},
  {name: 'Symbols', icon: Heart, emojis: symbols},
  {name: 'Flags', icon: Flag, emojis: flags},
];

const EmojiButton = ({
  emojiName,
  filename,
  onClick,
}: {
  emojiName: string;
  filename: string;
  onClick: () => void;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setIsLoaded(true);
    img.src = `${HOST}/static/emoji/${filename}`;
  }, [filename]);

  return (
    <button
      className="hover:bg-gray-200 rounded p-1 flex items-center justify-center"
      onClick={onClick}>
      {isLoaded ? (
        <img
          src={`${HOST}/static/emoji/${filename}`}
          alt={emojiName}
          className="w-6 h-6 object-contain"
        />
      ) : (
        <div className="w-6 h-6 bg-gray-200 animate-pulse rounded"></div>
      )}
    </button>
  );
};

export const EmojiPopup = ({
  onEmojiClick,
  onClose,
  triggerRef,
  input = false,
}: {
  onEmojiClick: (name: string) => void;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement>;
  input?: boolean;
}) => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [position, setPosition] = useState({top: 0, bottom: 'auto'});
  const [isPositioned, setIsPositioned] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const focusInputMessage = () => {
    window.dispatchEvent(new Event('focus-input-message'));
  };

  useEffect(() => {
    const calculatePosition = () => {
      if (triggerRef) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const popupHeight = popupRef.current.offsetHeight;
        const windowHeight = window.innerHeight;

        const spaceAbove = triggerRect.top;
        const spaceBelow = windowHeight - triggerRect.bottom;
        if (!input) {
          if (triggerRef.current && popupRef.current) {
            if (spaceBelow >= popupHeight || spaceBelow > spaceAbove) {
              setPosition({top: triggerRect.bottom + 10, bottom: 'auto'});
            } else {
              setPosition({
                top: 'auto',
                bottom: windowHeight - triggerRect.top + 10,
              });
            }
            setIsPositioned(true);
          }
        } else {
          setPosition({
            top: 'auto',
            bottom: windowHeight - triggerRect.top + 20,
          });
          setIsPositioned(true);
        }
      }
    };
    calculatePosition();
    window.addEventListener('resize', calculatePosition);
    return () => window.removeEventListener('resize', calculatePosition);
  }, [triggerRef]);

  useEffect(() => {
    Object.values(categories[activeCategory].emojis).forEach(filename => {
      const img = new Image();
      img.src = `${HOST}/static/emoji/${filename}`;
    });
  }, [activeCategory]);

  return (
    <div
      ref={popupRef}
      className={`fixed right-0 bg-white shadow-lg rounded-lg p-2 z-10 transition-opacity duration-200 ${
        isPositioned ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        top: position.top,
        bottom: position.bottom,
        visibility: isPositioned ? 'visible' : 'hidden',
      }}>
      <div className="w-64 h-80 flex flex-col">
        <div className="flex justify-between border-b pb-2 mb-2">
          {categories.map((category, index) => (
            <button
              key={category.name}
              className={`p-2 ${activeCategory === index ? 'bg-gray-200' : ''}`}
              onClick={() => setActiveCategory(index)}>
              <category.icon size={20} />
            </button>
          ))}
        </div>
        <div className="flex-grow overflow-y-auto">
          <div className="grid grid-cols-8 gap-1">
            {Object.entries(categories[activeCategory].emojis).map(
              ([emojiName, filename]) => (
                <EmojiButton
                  key={emojiName}
                  emojiName={emojiName}
                  filename={filename}
                  onClick={() => {
                    onEmojiClick(emojiName);
                    focusInputMessage();
                    if (!input) {
                      console.log('input', input);
                      console.log('on ferme ');
                      onClose();
                    }
                  }}
                />
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
