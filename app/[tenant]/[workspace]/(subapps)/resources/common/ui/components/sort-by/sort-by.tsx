'use client';

// ---- CORE IMPORTS ---- //
import {Label} from '@/ui/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/components/select';
import {cn} from '@/utils/css';
import {i18n} from '@/locale';

export function SortBy({className}: {className?: string}) {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Label htmlFor="terms" className="shrink-0">
        {i18n.t('Sort By')}:{' '}
      </Label>
      <Select>
        <SelectTrigger className="grow sm:grow-0 sm:w-[180px]">
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="new">{i18n.t('New')}</SelectItem>
          <SelectItem value="popular">{i18n.t('Popular')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default SortBy;
