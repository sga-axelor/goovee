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

export const FormView = ({
  fields: _fields,
  onSubmit,
  submitTitle,
}: {
  fields: any[];
  onSubmit: (values: any) => Promise<void>;
  submitTitle: string;
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
  });

  const formState = form.watch();

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
            form: form,
            field: item,
            renderItem: renderItem,
          });
        }

        if (item.type === 'boolean') {
          return (
            <FormItem className="flex items-center gap-6">
              <FormControl>
                <Checkbox
                  checked={form.watch(item.name)}
                  onCheckedChange={() =>
                    form.setValue(item.name, !form.watch(item.name))
                  }
                />
              </FormControl>
              <FormLabel
                className="text-sm font-normal cursor-pointer"
                style={{margin: 0}}>
                {item.title}
              </FormLabel>
            </FormItem>
          );
        }

        if (item.type === 'string' || item.type === 'number') {
          return (
            <FormItem>
              <FormLabel className="text-base font-medium leading-6">
                {item.title}
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
        {visibleFields.map(_i => renderItem(_i, _i.name))}
        <Button
          className="text-base font-medium leading-6 p-3 w-full bg-success hover:bg-success-dark"
          type="submit">
          {submitTitle}
        </Button>
      </form>
    </Form>
  );
};

export default FormView;
