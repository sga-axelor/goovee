'use client';

import {useEffect, useState} from 'react';
import {MdOutlineExpandMore} from 'react-icons/md';

interface Option {
  key: string;
  label: string;
}

interface DropdownToggleProps {
  options: Option[];
}

export const DropdownToggle = ({options}: DropdownToggleProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentValue, setCurrentValue] = useState(options[0].label);

  const handleClick = (index: number) => {
    const newIndex = (index + 1) % options.length;
    setCurrentIndex(newIndex);
    setCurrentValue(options[newIndex].label);
  };

  useEffect(() => {
    setCurrentValue(options[currentIndex].label);
  }, [currentIndex, options]);

  return (
    <div className="flex flex-col gap-3">
      {options.map(
        (option, index) =>
          currentIndex === index && (
            <div
              key={option.key}
              className="flex gap-2 cursor-pointer"
              onClick={() => handleClick(index)}>
              <div className="font-semibold">{option.label}</div>
              <MdOutlineExpandMore className="w-6 h-6" />
            </div>
          ),
      )}
    </div>
  );
};

export default DropdownToggle;
