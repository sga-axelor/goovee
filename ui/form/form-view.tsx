'use client';

import React, {type ReactNode, useCallback, useMemo} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/locale';
import {Button, Form} from '@/ui/components';

import type {Panel, Field, DisplayPanel} from './types';
import {createFormSchema} from './validation.helpers';
import {getFormContent} from './content.helpers';
import {isField} from './display.helpers';
import {FieldComponent, PanelComponent} from './components';

export const FormView = ({
  style,
  className,
  fields,
  panels = [],
  defaultValue,
  onSubmit,
  submitTitle,
  mode = 'onSubmit',
  submitButton,
  isReadonly = false,
}: {
  style?: React.CSSProperties;
  className?: string;
  fields: Field[];
  panels?: Panel[];
  defaultValue?: any;
  onSubmit?: (values: any) => Promise<void>;
  submitTitle?: string;
  mode?: 'onBlur' | 'onChange' | 'onSubmit' | 'onTouched' | 'all';
  submitButton?: (form: any) => ReactNode;
  isReadonly?: boolean;
}) => {
  const formContent: (DisplayPanel | Field)[] = useMemo(
    () => getFormContent(fields, panels),
    [fields, panels],
  );

  const formSchema = useMemo(() => createFormSchema(fields), [fields]);

  const defaultValues = useMemo(() => {
    if (defaultValue != null) {
      return defaultValue;
    }

    return fields.reduce(
      (acc, field: any) => {
        if (field.defaultValue !== undefined) {
          acc[field.name] = field.defaultValue;
        }
        return acc;
      },
      {} as Record<string, any>,
    );
  }, [fields, defaultValue]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode,
  });

  const {isSubmitting} = form.formState;
  const isValid =
    form.formState.isValid && !Object.keys(form.formState.errors || {}).length;

  const renderItem = useCallback(
    (item: DisplayPanel | Field, name: string) => {
      if (isField(item)) {
        return (
          <FieldComponent
            key={name}
            item={item as Field}
            identifier={name}
            form={form}
            globalReadonly={isReadonly}
            renderItem={renderItem}
          />
        );
      }

      return (
        <PanelComponent
          key={name}
          item={item as DisplayPanel}
          renderItem={renderItem}
        />
      );
    },
    [form, isReadonly],
  );

  return (
    <div className={className} style={style}>
      <Form {...form}>
        <form className="space-y-6 w-full">
          {formContent.map(_i => renderItem(_i, _i.name))}
          {submitButton && submitButton({form})}
          {onSubmit != null && (
            <Button
              variant="success"
              className="text-base font-medium leading-6 p-3 w-full"
              onClick={e => {
                e.preventDefault();
                form.handleSubmit(onSubmit)();
              }}
              disabled={isSubmitting || !isValid}>
              {i18n.t(submitTitle ?? '')}
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};
