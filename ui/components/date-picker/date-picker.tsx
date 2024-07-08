import React from 'react';
import {format} from 'date-fns';
import {DayPickerSingleProps} from 'react-day-picker';
import {CalendarIcon} from 'lucide-react';

import {cn} from '@/utils/css';
import {
  Button,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/ui/components';

interface DatePickerProps {
  value: any;
  onChange: DayPickerSingleProps['onSelect'] | any;
}

export const DatePicker = ({value, onChange}: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal md-4',
            !value && 'text-muted-foreground',
          )}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
