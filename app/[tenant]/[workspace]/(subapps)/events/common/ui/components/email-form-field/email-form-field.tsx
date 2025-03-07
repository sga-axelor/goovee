'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {UseFormReturn} from 'react-hook-form';

// ---- CORE IMPORTS ---- //
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@/ui/components';
import {i18n} from '@/locale';

export function EmailFormField({
  title,
  placeholder,
  disabled = false,
  formKey,
  form,
  onValidation,
}: {
  title: string;
  placeholder: string;
  disabled?: boolean;
  formKey: string;
  form: UseFormReturn<any>;
  onValidation: any;
}) {
  const {setValue, watch, setError, clearErrors} = form;
  const [validating, setValidating] = useState(false);
  const emailValue = watch(formKey);
  const hasValidated = useRef(false);

  const handleValidation = useCallback(
    async (email: string) => {
      if (!email.trim()) return;

      setValidating(true);

      try {
        const response: any = await onValidation(email);
        if (response?.success) {
          setValue(formKey, email, {shouldValidate: true});
          clearErrors(formKey);
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
    },
    [clearErrors, formKey, onValidation, setError, setValue],
  );

  useEffect(() => {
    if (emailValue && !hasValidated.current) {
      hasValidated.current = true;
      handleValidation(emailValue);
    }
  }, [emailValue, handleValidation]);

  return (
    <FormField
      control={form.control}
      name={formKey}
      render={({field}: any) => (
        <FormItem>
          <FormLabel className="text-base font-medium leading-6">
            {title}
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              className="py-3 px-4 rounded-lg focus-visible:ring-offset-0 focus-visible:ring-0 text-main-black dark:text-white placeholder:text-sm placeholder:font-normal h-[2.875rem] border text-sm font-normal"
              placeholder={placeholder}
              disabled={disabled}
              onBlur={e => {
                field.onBlur(e);
                clearErrors(formKey);
                handleValidation(e.target.value);
              }}
            />
          </FormControl>
          {validating && (
            <p className="text-sm text-gray-500">{i18n.t('Validating...')}</p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default EmailFormField;
