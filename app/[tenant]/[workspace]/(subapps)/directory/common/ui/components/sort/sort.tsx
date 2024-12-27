'use client';

import {useRouter, usePathname, useSearchParams} from 'next/navigation';
import {i18n} from '@/i18n';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/components';
import {cn} from '@/utils/css';

const options = [
  {value: 'a-z', label: i18n.get('A-Z')},
  {value: 'z-a', label: i18n.get('Z-A')},
  {value: 'newest', label: i18n.get('Newest')},
  {value: 'oldest', label: i18n.get('Oldest')},
];

export function Sort() {
  const router = useRouter();
  const pathname = usePathname();
  const currentSearchParams = useSearchParams();

  const currentValue = currentSearchParams.get('sort') || options[0].value;

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(
      Array.from(currentSearchParams.entries()),
    );
    params.set('sort', value);

    const search = params.toString();
    const query = search ? `?${search}` : '';

    router.push(`${pathname}${query}`);
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
