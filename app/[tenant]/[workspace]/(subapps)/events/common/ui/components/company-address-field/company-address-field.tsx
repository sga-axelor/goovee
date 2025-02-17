'use client';

import {Control} from 'react-hook-form';

// ---- CORE IMPORTS ---- //
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  Textarea,
} from '@/ui/components';

interface CompanyAddressFieldProps {
  form: {
    control: Control<any>;
  };
  formKey: string;
  title: string;
  placeholder?: string;
  isSecondary?: boolean;
}

export function CompanyAddressField({
  form,
  formKey,
  title,
  placeholder = '',
  isSecondary = false,
}: CompanyAddressFieldProps) {
  const InputComponent = isSecondary ? Input : Textarea;

  return (
    <FormField
      control={form.control}
      name={formKey}
      render={({field}) => (
        <FormItem>
          <FormLabel className="text-base font-medium leading-6">
            {title}
          </FormLabel>
          <FormControl>
            <InputComponent
              {...field}
              placeholder={placeholder}
              className="py-3 px-4 rounded-lg focus-visible:ring-offset-0 focus-visible:ring-0 text-main-black dark:text-white placeholder:text-sm placeholder:font-normal h-[2.875rem] border text-sm font-normal"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

export default CompanyAddressField;
