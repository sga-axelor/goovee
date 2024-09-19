'use client';

import {memo, useState} from 'react';
import {MdOutlineExpandMore} from 'react-icons/md';

interface Option {
  key: string;
  label: string;
}

interface DropdownToggleProps {
  value: string;
  options: Option[];
  handleDropdown?: (value: string) => void;
}

export const DropdownToggle = memo(
  ({value, options, handleDropdown}: DropdownToggleProps) => {
    const [currentIndex, setCurrentIndex] = useState(
      options.findIndex(option => option.key === value) || 0,
    );

    const handleClick = () => {
      const newIndex = (currentIndex + 1) % options.length;
      setCurrentIndex(newIndex);
      handleDropdown?.(options[newIndex].key);
    };

    const {label} = options[currentIndex];

    return (
      <div className="flex flex-col gap-3">
        {options.length > 0 && (
          <div className="flex gap-2 cursor-pointer" onClick={handleClick}>
            <div className="font-semibold">{label}</div>
            <MdOutlineExpandMore className="w-6 h-6" />
          </div>
        )}
      </div>
    );
  },
);

DropdownToggle.displayName = 'DropdownToggle';

export default DropdownToggle;
