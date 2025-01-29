'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {forwardRef, ReactNode, useRef, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import {useFieldArray, useForm} from 'react-hook-form';
import {MdAttachFile, MdDelete} from 'react-icons/md';
import {z} from 'zod';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/locale';
import {AutosizeTextarea, Button, Input} from '@/ui/components';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/ui/components/form';
import type {
  AutosizeTextAreaProps,
  AutosizeTextAreaRef,
} from '@/ui/components/textarea-auto-size';
import {cn} from '@/utils/css';
import {getFileSizeText} from '@/utils/files';

type CommentProps = {
  disabled?: boolean;
  placeholderText?: string;
  showAttachmentIcon?: boolean;
  className?: string;
  onSubmit: any;
  autoFocus?: boolean;
};

const MAX_FILE_SIZE = 20000000; // 20 MB

const formSchema = z
  .object({
    attachments: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        file: z
          .any()
          .refine(file => file, i18n.t('File is required.'))
          .refine(
            file => file.size <= MAX_FILE_SIZE,
            i18n.t(`Max file size is 20MB.`),
          ),
      }),
    ),
    content: z.string(),
    text: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const hasFile = data.attachments.length > 0 ? true : false;

    if (!hasFile && (!data.text || data.text.trim().length === 0)) {
      ctx.addIssue({
        path: ['text'],
        message: i18n.t('Comment is required'),
        code: 'custom',
      });
    }
  });

export function CommentInput({
  disabled = false,
  className = '',
  placeholderText = i18n.t('Enter text here') + '*',
  showAttachmentIcon = true,
  onSubmit,
  autoFocus = false,
}: CommentProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
      content: '',
      attachments: [],
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('text', values.text || ' ');
    formData.append('content', values.content);

    if (values.attachments && values.attachments.length > 0) {
      values.attachments.forEach((attachment, index) => {
        if (attachment.title) {
          formData.append(`attachments[${index}][title]`, attachment.title);
        }
        if (attachment.description) {
          formData.append(
            `attachments[${index}][description]`,
            attachment.description,
          );
        }
        if (attachment.file) {
          formData.append(`attachments[${index}][file]`, attachment.file);
        }
      });
    }

    await onSubmit({formData, values});
    setIsSubmitting(false);

    form.reset();
  };

  const {fields, append, remove} = useFieldArray({
    control: form.control,
    name: 'attachments',
  });

  const onDrop = (acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      append({title: '', description: '', file});
    });
  };

  const {getRootProps, getInputProps} = useDropzone({
    maxSize: MAX_FILE_SIZE,
    onDrop,
  });

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 w-full">
        <div className={cn(disabled && 'pointer-events-none')}>
          <FormField
            control={form.control}
            name="text"
            render={({field}) => (
              <FormItem>
                <FormControl>
                  <TextArea
                    className={className}
                    autoFocus={autoFocus}
                    minHeight={32}
                    maxHeight={300}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        form.handleSubmit(handleSubmit)();
                      }
                    }}
                    placeholder={i18n.t(placeholderText)}
                    dummyValue={form.watch('text') || ''}
                    endAdornment={
                      <div className="flex items-start gap-4 pb-1">
                        {showAttachmentIcon && (
                          <div
                            {...getRootProps({
                              className:
                                'dropzone self-stretch flex items-center',
                            })}>
                            <input {...getInputProps()} />
                            <MdAttachFile
                              className={cn(
                                'size-6 text-black cursor-pointer',
                                disabled && 'text-gray-dark cursor-none',
                              )}
                            />
                          </div>
                        )}
                        <Button
                          type="submit"
                          className="px-6 py-1.5 h-9 text-base font-medium"
                          variant="success"
                          disabled={isSubmitting || disabled}>
                          {i18n.t('Send')}
                        </Button>
                      </div>
                    }
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormMessage className="px-2 py-1">
            {form.formState.errors.text?.message}
          </FormMessage>
        </div>
        {!!fields?.length && (
          <div className="flex flex-col gap-2">
            <h4 className="text-base font-semibold">{i18n.t('Attachments')}</h4>
            {fields.map((field, index) => (
              <div
                key={`${field.file?.name}-${index}`}
                className="p-2 border rounded-lg grid grid-cols-[20%_1fr_2fr_auto] items-center gap-2">
                <p className="font-semibold line-clamp-1">
                  {index + 1} {field.file?.name} -{' '}
                  {getFileSizeText(field.file?.size)}
                </p>
                <FormField
                  control={form.control}
                  name={`attachments.${index}.title`}
                  render={({field}) => (
                    <FormItem className="inline-block">
                      <FormControl>
                        <Input
                          placeholder={`${i18n.t('Enter attachment title')}`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`attachments.${index}.description`}
                  render={({field}) => (
                    <FormItem className="inline-block">
                      <FormControl>
                        <Input
                          placeholder={i18n.t('Enter attachment description')}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <MdDelete
                  className="h-6 w-6 text-destructive cursor-pointer shrink-0"
                  onClick={() => remove(index)}
                />
              </div>
            ))}
          </div>
        )}
      </form>
    </Form>
  );
}

export default CommentInput;

const TextArea = forwardRef<
  AutosizeTextAreaRef,
  AutosizeTextAreaProps & {endAdornment: ReactNode; dummyValue: string}
>((props, ref) => {
  const {endAdornment, className, dummyValue, ...rest} = props;
  return (
    <div
      className={cn(
        'flex items-end flex-wrap rounded-md border border-input bg-white pr-1 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
      )}>
      <div className="flex flex-col grow">
        <AutosizeTextarea
          ref={ref}
          className={cn(
            'placeholder:text-sm placeholder:text-gray-dark border-none focus-visible:outline-none focus-visible:!ring-0 focus-visible:ring-none resize-none',
            className,
          )}
          {...rest}
        />
        <span className="px-3 invisible h-0 !m-0 whitespace-pre-wrap">
          {dummyValue}
        </span>
      </div>
      <div className="ml-auto">{endAdornment}</div>
    </div>
  );
});

TextArea.displayName = 'TextArea';
