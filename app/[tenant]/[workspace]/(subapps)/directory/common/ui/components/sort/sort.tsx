'use client';
import {i18n} from '@/i18n';
import {cn} from '@/utils/css';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/ui/components';
import {useState} from 'react';

const options = [
  {value: '1', label: i18n.get('A-Z')},
  {value: '2', label: i18n.get('Z-A')},
  {value: '3', label: i18n.get('Newest')},
  {value: '4', label: i18n.get('Oldest')},
];

export function Sort() {
  const [sort, setSort] = useState(options[0].value);
  return (
    <Select value={sort} onValueChange={setSort}>
      <SelectTrigger className={cn('w-full text-xs text-foreground')}>
        <SelectValue placeholder={i18n.get('Select sort')} />
      </SelectTrigger>
      <SelectContent className="w-full">
        {options.map(option => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="text-xs">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
