'use client';

import {useRef} from 'react';
import {useRouter} from 'next/navigation';
import {useDropzone} from 'react-dropzone';
import {useForm, useFieldArray} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {MdAttachment, MdDelete} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {Button, Input, Textarea} from '@/ui/components';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/ui/components/form';
import {useToast} from '@/ui/hooks';
import {i18n} from '@/lib/i18n';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {getFileSizeText} from '@/utils/files';
import {upload} from '@/orm/comment';

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
  text: z.string().min(1, {message: i18n.get('Comment text is required')}),
});

export function Comment({folder}: {folder: string}) {
  const {toast} = useToast();
  const router = useRouter();
  const {workspaceURL} = useWorkspace();

  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
      content: '',
      attachments: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    formData.append('text', values.text);
    formData.append('content', values.content);
    formData.append('folder', folder);

    values.attachments.forEach((value: any, index: number) => {
      formData.append(`attachements[${index}][title]`, value.title);
      formData.append(`attachements[${index}][description]`, value.description);
      formData.append(`attachements[${index}][file]`, value.file);
    });

    const result = await upload(formData, workspaceURL);

    if (result.success) {
      toast({
        title: i18n.get('Comment created successfully.'),
      });
      router.refresh();
    } else {
      toast({
        variant: 'destructive',
        title: i18n.get('Error creating comment'),
      });
    }
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
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6">
        <FormField
          control={form.control}
          name="text"
          render={({field}) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="Enter text here*" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {fields?.length ? (
          <div className="flex flex-col gap-2">
            <h4 className="text-lg font-semibold">{i18n.get('Attachments')}</h4>
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
        <div className="flex items-center gap-2">
          <div {...getRootProps({className: 'dropzone'})}>
            <Button
              type="button"
              variant="success"
              className="border border-success bg-white text-success hover:bg-success hover:text-white transition-all ease-in-out">
              <input {...getInputProps()} />
              <MdAttachment className="size-6" />
            </Button>
          </div>
          <Button type="submit" variant="success">
            {i18n.get('Submit')}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default Comment;
