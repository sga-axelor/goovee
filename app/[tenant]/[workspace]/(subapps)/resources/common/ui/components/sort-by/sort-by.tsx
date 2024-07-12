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

export function SortBy({className}: {className?: string}) {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Label htmlFor="terms" className="shrink-0">
        Sort By:{' '}
      </Label>
      <Select>
        <SelectTrigger className="grow sm:grow-0 sm:w-[180px]">
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="popular">Popular</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default SortBy;
