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
import type {Field} from '@/ui/form';

interface CompanyAddressFieldProps {
  form: {
    control: Control<any>;
  };
  formKey: string;
  title: string;
  placeholder?: string;
  isSecondary?: boolean;
  field: Field;
}

export function CompanyAddressField({
  form,
  formKey,
  title,
  placeholder = '',
  isSecondary = false,
  field,
}: CompanyAddressFieldProps) {
  const InputComponent = isSecondary ? Input : Textarea;

  const isRequired = field.required;
  return (
    <FormField
      control={form.control}
      name={formKey}
      render={({field}) => (
        <FormItem>
          <FormLabel className="text-base font-medium leading-6">
            {title}
            {isRequired && <span className="text-destructive ms-1">*</span>}
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
