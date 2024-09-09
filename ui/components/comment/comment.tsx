'use client';

import {useRef} from 'react';
import {useDropzone} from 'react-dropzone';
import {useForm, useFieldArray} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {MdAttachFile, MdDelete} from 'react-icons/md';
import {useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {Button, Input} from '@/ui/components';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/ui/components/form';
import {i18n} from '@/lib/i18n';
import {getFileSizeText} from '@/utils/files';

type CommentProps = {
  placeholderText: string;
  showAttachmentIcon?: boolean;
  onSubmit: any;
};

const MAX_FILE_SIZE = 20000000; // 20 MB

const formSchema = z.object({
  attachments: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      file: z
        .any()
        .refine(file => file, i18n.get('File is required.'))
        .refine(
          file => file.size <= MAX_FILE_SIZE,
          i18n.get(`Max file size is 20MB.`),
        ),
    }),
  ),
  content: z.string(),
  text: z.string().min(1, {message: i18n.get('Comment is required')}),
});

export function Comment({
  placeholderText = 'Enter text here*',
  showAttachmentIcon = true,
 onSubmit
}: CommentProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
      content: '',
      attachments: [],
    },
  });

  const router = useRouter();

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    formData.append('text', values.text);
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
        className="space-y-6 w-full">
        <div className="flex items-center relative">
          <FormField
            control={form.control}
            name="text"
            render={({field}) => (
              <FormItem className=" w-full">
                <FormControl>
                  <Input
                    className="h-12 w-full placeholder:text-sm placeholder:text-slate-400"
                    placeholder={placeholderText}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-2 absolute right-3 top-1.5">
            {showAttachmentIcon && (
              <div {...getRootProps({className: 'dropzone'})}>
                <input {...getInputProps()} />
                <MdAttachFile className="size-6 text-black" />
              </div>
            )}
            <Button
              type="submit"
              className="px-6 py-1.5 h-9 text-base"
              variant="success">
              {i18n.get('Send')}
            </Button>
          </div>
        </div>
        {fields?.length ? (
          <div className="flex flex-col gap-2">
            <h4 className="text-base font-semibold">
              {i18n.get('Attachments')}
            </h4>
            {fields.map((field, index) => (
              <div
                key={`${field.file?.name}-${index}`}
                className="p-2 border rounded-lg grid grid-cols-[20%_1fr_2fr_auto] items-center gap-2">
                <p className="font-semibold line-clamp-1">
                  {index + 1} {field.file?.name}-
                  {getFileSizeText(field.file?.size)}
                </p>
                <FormField
                  control={form.control}
                  name={`attachments.${index}.title`}
                  render={({field}) => (
                    <FormItem className="inline-block">
                      <FormControl>
                        <Input
                          placeholder={`${i18n.get('Enter attachment title')}`}
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
                          placeholder={i18n.get('Enter attachment description')}
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
        ) : null}
      </form>
    </Form>
  );
}

export default Comment;
