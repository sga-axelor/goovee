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
import {sortOptions} from '../../../constants';

export function Sort() {
  const {searchParams, update} = useSearchParams();

  const currentValue = searchParams.get('sort') || sortOptions[0].value;

  const handleSortChange = (value: string) => {
    update([
      {key: 'sort', value},
      {key: 'page', value: '1'},
    ]);
  };

  return (
    <Select
      defaultValue={currentValue}
      onValueChange={e => handleSortChange(e)}>
      <SelectTrigger className={cn('w-full text-xs text-foreground')}>
        <SelectValue placeholder={i18n.get('Select sort')} />
      </SelectTrigger>
      <SelectContent className="w-full">
        {sortOptions.map(option => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="text-xs">
            {i18n.get(option.label)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
