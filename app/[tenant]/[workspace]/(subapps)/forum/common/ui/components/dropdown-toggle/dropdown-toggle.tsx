'use client';

import {memo, useState} from 'react';
import {MdOutlineExpandMore} from 'react-icons/md';

interface Option {
  key: string;
  label: string;
}

interface DropdownToggleProps {
  options: Option[];
  handleDropdown?: (value: string) => void;
}

export const DropdownToggle = memo(
  ({options, handleDropdown}: DropdownToggleProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleClick = () => {
      const newIndex = (currentIndex + 1) % options.length;
      setCurrentIndex(newIndex);
      handleDropdown?.(options[newIndex].key);
    };

    return (
      <div className="flex flex-col gap-3">
        {options.length > 0 && (
          <div
            key={options[currentIndex].key}
            className="flex gap-2 cursor-pointer"
            onClick={handleClick}>
            <div className="font-semibold">{options[currentIndex].label}</div>
            <MdOutlineExpandMore className="w-6 h-6" />
          </div>
        )}
      </div>
    );
  },
);

DropdownToggle.displayName = 'DropdownToggle';

export default DropdownToggle;
