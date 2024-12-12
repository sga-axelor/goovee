'use client';

// ---- CORE IMPORTS ---- //
import {
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from '@/ui/components';
import {cn} from '@/utils/css';

type CountriesProps = {
  options: any[];
  label: string;
  placeholder?: string;
  selectedValue?: string;
  labelClassName?: string;
  rootClassName?: string;
  isRequired?: boolean;
  onValueChange: (selectedOption: {id: string; name: string}) => void;
};

export function Countries({
  options = [],
  label,
  placeholder = 'Select an option',
  selectedValue,
  labelClassName,
  rootClassName,
  isRequired,
  onValueChange,
}: CountriesProps) {
  return (
    <div className={rootClassName}>
      <Label className={cn('font-medium mb-1', labelClassName)}>
        {label}
        {isRequired && <span className="text-destructive">*</span>}
      </Label>
      <Select
        value={selectedValue}
        onValueChange={(value: string) => {
          const selectedOption = options.find(option => option.id === value);
          onValueChange(selectedOption);
        }}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {options.map(option => (
              <SelectItem key={option.id} value={option.id}>
                {option.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
export default Countries;
