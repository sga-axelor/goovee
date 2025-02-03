'use client';

import {useState} from 'react';
import {UseFormReturn} from 'react-hook-form';

// ---- CORE IMPORTS ---- //
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@/ui/components';
import {i18n} from '@/locale';

export async function validateEmailAPI(email: string) {
  return new Promise(resolve => {
    setTimeout(() => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidFormat = emailRegex.test(email);

      if (!isValidFormat) {
        resolve({success: false, message: i18n.t('Invalid email format.')});
      } else if (Math.random() > 0.3) {
        resolve({success: true});
      } else {
        resolve({
          success: false,
          message: i18n.t('Email is already registered.'),
        });
      }
    }, 1000);
  });
}

export function EmailFormField({
  title,
  placeholder,
  disabled,
  formKey,
  form,
}: {
  title: string;
  placeholder: string;
  disabled?: boolean;
  formKey: string;
  form: UseFormReturn<any>;
}) {
  const {setValue, watch, setError, clearErrors} = form;
  const [validating, setValidating] = useState(false);

  const handleValidation = async (email: string) => {
    if (!email.trim()) return;

    setValidating(true);
    clearErrors(formKey);

    try {
      const response: any = await validateEmailAPI(email);

      if (response?.success) {
        setValue(formKey, email, {shouldValidate: true});
      } else {
        setError(formKey, {
          type: 'manual',
          message: i18n.t(response?.message || 'Invalid email address.'),
        });
      }
    } catch (err) {
      setError(formKey, {
        type: 'manual',
        message: i18n.t('Error validating email.'),
      });
    }

    setValidating(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const email = event.target.value;
    setValue(formKey, email);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const email = event.target.value;
    handleValidation(email);
  };

  return (
    <FormItem>
      <FormLabel className="text-base font-medium leading-6">{title}</FormLabel>
      <FormControl>
        <Input
          className="py-3 px-4 rounded-lg focus-visible:ring-offset-0 focus-visible:ring-0 text-main-black dark:text-white placeholder:text-sm placeholder:font-normal h-[2.875rem] border text-sm font-normal"
          placeholder={placeholder}
          disabled={disabled}
          value={watch(formKey)}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </FormControl>
      {validating && (
        <p className="text-sm text-gray-500">{i18n.t('Validating...')}</p>
      )}

      <FormMessage name={formKey} />
    </FormItem>
  );
}

export default EmailFormField;
