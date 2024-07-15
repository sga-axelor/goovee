'use client';

import React, {useCallback, useMemo} from 'react';
import {MdAdd, MdOutlineDelete} from 'react-icons/md';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';

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
} from '../components';
import {Field} from './types';
import {createDefaultValues, sortFields, mapFieldType} from './display.helpers';
import {createFormSchema} from './validation.helpers';

const FormView = ({
  fields: _fields,
  onSubmit,
  submitTitle,
}: {
  fields: Field[];
  onSubmit: (values: any) => Promise<void>;
  submitTitle: string;
}) => {
  const fields = useMemo(() => sortFields(_fields), [_fields]);

  const formSchema = useMemo(() => createFormSchema(fields), [fields]);

  const defaultValues = useMemo(() => createDefaultValues(fields), [fields]);

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
    (item: Field, key: string) => {
      const renderFieldContent = ({field}) => {
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
            <FormItem className="flex items-center gap-x-6">
              <FormControl>
                <Checkbox
                  className="rounded-[0.313rem] size-5 border-[0.078rem]"
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
                  className="rounded-lg focus-visible:ring-offset-0 focus-visible:ring-0 text-main-black dark:text-white placeholder:text-sm placeholder:font-normal  h-[2.875rem] py-[0.625rem] px-[0.875rem] border text-sm font-normal"
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
          className="text-base font-medium leading-6 p-3 w-full"
          type="submit">
          {submitTitle}
        </Button>
      </form>
    </Form>
  );
};

export default FormView;
