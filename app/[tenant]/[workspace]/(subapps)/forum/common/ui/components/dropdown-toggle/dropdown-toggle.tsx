'use client';

import {useEffect, useState} from 'react';
import {MdOutlineExpandMore} from 'react-icons/md';

interface Option {
  key: string;
  label: string;
}

interface DropdownToggleProps {
  options: Option[];
  handleDropdown?: (value: string) => void;
}

export const DropdownToggle = ({
  options,
  handleDropdown,
}: DropdownToggleProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleClick = (index: number) => {
    const newIndex = (index + 1) % options.length;
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    handleDropdown && handleDropdown(options[currentIndex].key);
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
