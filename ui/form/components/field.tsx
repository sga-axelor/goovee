import React, {useCallback, useMemo} from 'react';
import {ControllerRenderProps, UseFormReturn} from 'react-hook-form';

import {i18n} from '@/locale';
import {
  Checkbox,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  RichTextEditor,
} from '@/ui/components';

import type {Field as FieldType} from '../types';
import {getColspan, mapFieldType} from '../display.helpers';
import FormGridComponent from './grid';

export const FieldComponent = ({
  item,
  form,
  identifier = '',
  globalReadonly = false,
  renderItem,
}: {
  item: FieldType;
  form: UseFormReturn<Record<string, any>, any, undefined>;
  identifier: string;
  globalReadonly?: boolean;
  renderItem: (item: any, name: string) => React.JSX.Element;
}) => {
  const formState = form.watch();

  const isHidden = useMemo(() => {
    return item.hidden || item.hideIf?.(formState);
  }, [item, formState]);

  const isRequired = useMemo(() => {
    return item.required;
  }, [item]);

  const isReadonly = useMemo(() => {
    return globalReadonly || item.readonly;
  }, [globalReadonly, item]);

  const widthStyle = useMemo(
    () => ({width: `${getColspan(item.colSpan)}%`}),
    [item.colSpan],
  );

  const Wrapper = useCallback(
    ({children, className = ''}: {children: any; className?: string}) => {
      return (
        <FormItem
          className={`min-w-[70px] flex-grow ${className}`}
          style={widthStyle}>
          {children}
        </FormItem>
      );
    },
    [widthStyle],
  );

  const renderComponent = useCallback(
    ({field}: {field: ControllerRenderProps<any, any>}): React.ReactElement => {
      if (item.widget === 'custom') {
        return React.createElement(item.customComponent as any, {
          style: widthStyle,
          form,
          field: item,
          formKey: identifier,
          readonly: isReadonly,
          renderItem,
        });
      }

      if (item.type === 'array') {
        return (
          <Wrapper>
            <FormGridComponent
              form={form}
              item={item}
              readonly={isReadonly}
              {...item.options}
            />
          </Wrapper>
        );
      }

      if (item.type === 'boolean') {
        return (
          <Wrapper className="my-2 flex items-center gap-3">
            <FormControl>
              <Checkbox
                checked={form.watch(identifier)}
                onCheckedChange={() =>
                  form.setValue(identifier, !form.watch(identifier))
                }
                required={isRequired}
                disabled={isReadonly}
              />
            </FormControl>
            <FormLabel
              className="text-md font-normal cursor-pointer"
              style={{margin: 0}}>
              {i18n.t(item.title ?? '')}
            </FormLabel>
          </Wrapper>
        );
      }

      if (item.type === 'string' && item.widget === 'html') {
        return (
          <Wrapper>
            <FormLabel className="text-base font-medium leading-6">
              {i18n.t(item.title ?? '')}
            </FormLabel>
            <FormControl>
              <RichTextEditor
                onChange={field.onChange}
                content={form.watch(identifier)}
                classNames={{
                  wrapperClassName: 'overflow-visible bg-card',
                  toolbarClassName: 'mt-0',
                  editorClassName: 'px-4',
                }}
              />
            </FormControl>
            <FormMessage />
          </Wrapper>
        );
      }

      if (item.type === 'string' || item.type === 'number') {
        return (
          <Wrapper>
            <FormLabel className="text-base font-medium leading-6">
              {i18n.t(item.title ?? '')}
            </FormLabel>
            <FormControl>
              <Input
                className="py-3 px-4 rounded-lg focus-visible:ring-offset-0 focus-visible:ring-0 text-main-black dark:text-white placeholder:text-sm placeholder:font-normal h-[2.875rem] border text-sm font-normal"
                type={mapFieldType(item)}
                placeholder={item.helper}
                {...field}
                required={isRequired}
                disabled={isReadonly}
              />
            </FormControl>
            <FormMessage />
          </Wrapper>
        );
      }

      return null as any;
    },
    [
      Wrapper,
      form,
      identifier,
      isReadonly,
      isRequired,
      item,
      renderItem,
      widthStyle,
    ],
  );

  if (isHidden) {
    return null;
  }

  return (
    <FormField
      key={identifier}
      control={form.control}
      name={identifier}
      render={renderComponent}
    />
  );
};
