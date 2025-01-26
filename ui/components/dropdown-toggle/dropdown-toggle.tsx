'use client';

import {memo, useState} from 'react';
import {MdOutlineExpandMore} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {cn} from '@/utils/css';
import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/ui/components';
import {i18n} from '@/locale';
interface Option {
  key: string;
  label: string;
}

interface DropdownToggleProps {
  value: string;
  options: Option[];
  title: string;
  labelClassName?: string;
  selectClassName?: string;
  valueClassName?: string;
  optionClassName?: string;
  onSelect?: (value: string) => void;
}

export const DropdownToggle = memo(
  ({
    value,
    options,
    onSelect,
    title,
    labelClassName = '',
    selectClassName = '',
    valueClassName = '',
    optionClassName = '',
  }: DropdownToggleProps) => {
    const handleSelect = (value: any) => {
      onSelect?.(value);
    };

    return (
      <div className="flex items-center gap-2 text-base flex-shrink-0 pr-2">
        <Label className={cn('!shrink-0', labelClassName)}>{title}:</Label>

        <Select defaultValue={value} onValueChange={handleSelect}>
          <SelectTrigger className={cn(selectClassName)}>
            <SelectValue
              className={cn(valueClassName)}
              placeholder="Select..."
            />
          </SelectTrigger>
          <SelectContent>
            {options.map(option => (
              <SelectItem
                key={option.key}
                className={cn(optionClassName)}
                value={option.key}>
                {i18n.t(option.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  },
);

DropdownToggle.displayName = 'DropdownToggle';

export default DropdownToggle;
