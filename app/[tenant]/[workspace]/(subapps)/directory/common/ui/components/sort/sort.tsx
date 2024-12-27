'use client';

import {i18n} from '@/i18n';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/components';
import {useSearchParams} from '@/ui/hooks/use-search-params';
import {cn} from '@/utils/css';

const options = [
  {value: 'a-z', label: i18n.get('A-Z')},
  {value: 'z-a', label: i18n.get('Z-A')},
  {value: 'newest', label: i18n.get('Newest')},
  {value: 'oldest', label: i18n.get('Oldest')},
];

export function Sort() {
  const {searchParams, update} = useSearchParams();

  const currentValue = searchParams.get('sort') || options[0].value;

  const handleSortChange = (value: string) => {
    update([{key: 'sort', value}]);
  };

  return (
    <Select
      defaultValue={currentValue}
      onValueChange={e => handleSortChange(e)}>
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
