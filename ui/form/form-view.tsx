'use client';

import React, {useCallback, useMemo} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';

// ---- CORE IMPORTS ---- //
import {
  Button,
  Checkbox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@/ui/components';
import {sortFields, mapFieldType, createFormSchema} from '@/ui/form';
import {i18n} from '@/locale';

export const FormView = ({
  fields: _fields,
  onSubmit,
  submitTitle,
  mode = 'onSubmit',
  submitButton,
}: {
  fields: any[];
  onSubmit: (values: any) => Promise<void>;
  submitTitle: string;
  mode?: 'onBlur' | 'onChange' | 'onSubmit' | 'onTouched' | 'all';
  submitButton?: any;
}) => {
  const fields = useMemo(() => sortFields(_fields), [_fields]);

  const formSchema = useMemo(() => createFormSchema(fields), [fields]);

  const defaultValues = useMemo(() => {
    return fields.reduce(
      (acc, field: any) => {
        if (field.defaultValue !== undefined) {
          acc[field.name] = field.defaultValue;
        }
        return acc;
      },
      {} as Record<string, any>,
    );
  }, [fields]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode,
  });

  const formState = form.watch();
  const {isValid, isSubmitting, isSubmitted} = form.formState;

  const visibleFields = useMemo(
    () => fields.filter(_f => !_f.hidden && !_f.hideIf?.(formState)),
    [fields, formState],
  );

  const renderItem = useCallback(
    (item: any, key: any) => {
      const renderFieldContent: any = ({field}: any) => {
        if (item.widget === 'custom') {
          return React.createElement(item.customComponent, {
            key: `custom.${key}`,
            formKey: key,
            form,
            field: item,
            renderItem: renderItem,
          });
        }

        if (item.type === 'boolean') {
          const value = form.watch(key);

          return (
            <FormItem className="flex items-center gap-6">
              <FormControl>
                <Checkbox
                  className={value ? '!bg-success !border-success' : ''}
                  checked={value}
                  disabled={item.readonly}
                  onCheckedChange={() => form.setValue(key, !value)}
                />
              </FormControl>
              <FormLabel className="text-sm font-normal cursor-pointer !mt-0">
                {i18n.t(item.title)}
              </FormLabel>
            </FormItem>
          );
        }

        if (item.type === 'string' || item.type === 'number') {
          return (
            <FormItem>
              <FormLabel className="text-base font-medium leading-6">
                {i18n.t(item.title)}
              </FormLabel>
              <FormControl>
                <Input
                  className="py-3 px-4 rounded-lg focus-visible:ring-offset-0 focus-visible:ring-0 text-main-black dark:text-white placeholder:text-sm placeholder:font-normal h-[2.875rem] border text-sm font-normal"
                  type={mapFieldType(item)}
                  placeholder={item.helper}
                  {...field}
                  disabled={item.readonly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }

        return null;
      };

      return (
        <FormField
          key={key}
          control={form.control}
          name={key}
          render={renderFieldContent}
        />
      );
    },
    [form],
  );

  return (
    <Form {...form}>
      <form className="space-y-6 w-full">
        {visibleFields.map(_i => renderItem(_i, _i.name))}
        {(submitButton && React.createElement(submitButton, {form})) || (
          <Button
            className="text-base font-medium leading-6 p-3 w-full bg-success hover:bg-success-dark"
            type="submit"
            onClick={e => {
              e.preventDefault();
              form.handleSubmit(onSubmit)();
            }}
            disabled={isSubmitting || (isSubmitted && !isValid)}>
            {i18n.t(submitTitle)}
          </Button>
        )}
      </form>
    </Form>
  );
};

export default FormView;
