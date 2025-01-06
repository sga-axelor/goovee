'use client';

import {useRef} from 'react';
import {notFound, useRouter} from 'next/navigation';
import {useDropzone} from 'react-dropzone';
import {useForm, useFieldArray} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {MdDelete} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {Button} from '@/ui/components/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/ui/components/form';
import {Input} from '@/ui/components/input';
import {Textarea} from '@/ui/components/textarea';
import {useToast} from '@/ui/hooks/use-toast';
import {i18n} from '@/locale';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {getFileSizeText} from '@/utils/files';

// ---- LOCAL IMPORTS ---- //
import {upload} from './action';

const MAX_FILE_SIZE = 20000000;

const formSchema = z.object({
  values: z
    .array(
      z.object({
        title: z.string().min(2, {message: i18n.t('Title is required')}),
        description: z.string(),
        file: z
          .any()
          .refine(file => file, i18n.t('File is required.'))
          .refine(
            file => file.size <= MAX_FILE_SIZE,
            i18n.t(`Max file size is 20MB.`),
          ),
      }),
    )
    .min(1, {message: i18n.t('Single file is required to create resource')}),
});

export default function ResourceForm({parent}: any) {
  const {toast} = useToast();
  const router = useRouter();
  const {workspaceURI, workspaceURL} = useWorkspace();

  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      values: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    formData.append('parent', parent?.id);

    values.values.forEach((value: any, index: number) => {
      formData.append(`values[${index}][title]`, value.title);
      formData.append(`values[${index}][description]`, value.description);
      formData.append(`values[${index}][file]`, value.file);
    });

    const result = await upload(formData, workspaceURL);

    if (result.success) {
      toast({
        title: i18n.t('Resource created successfully.'),
      });
      router.refresh();
      router.push(`${workspaceURI}/resources/categories?id=${parent?.id}`);
    } else {
      toast({
        variant: 'destructive',
        title: i18n.t('Error creating resource'),
      });
    }
  };

  const {fields, append, remove} = useFieldArray({
    control: form.control,
    name: 'values',
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

  if (!parent?.id) {
    return notFound();
  }

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8">
        <FormItem>
          <FormLabel>{i18n.t('Parent')}</FormLabel>
          <FormControl>
            <Input
              className="shadow-none h-11 text-black placeholder:text-muted-foreground"
              readOnly
              value={parent?.fileName}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
        <div
          {...getRootProps({className: 'dropzone'})}
          className="flex justify-center items-center cursor-pointer rounded bg-muted h-36">
          <input {...getInputProps()} />
          <p>
            {i18n.t('Drag and drop some files here, or click to select files')}
          </p>
        </div>
        {fields?.length ? (
          <div className="flex flex-col gap-2">
            <h4 className="text-lg font-semibold">
              {i18n.t('Uploaded Files')}
            </h4>
            {fields.map((field, index) => (
              <div
                key={`${field.file?.name}-${index}`}
                className="p-2 border rounded-lg flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold line-clamp-1">
                    {index + 1} {field.file?.name}-
                    {getFileSizeText(field.file?.size)}
                  </p>
                  <MdDelete
                    className="h-6 w-6 text-destructive cursor-pointer shrink-0"
                    onClick={() => remove(index)}
                  />
                </div>
                <FormField
                  control={form.control}
                  name={`values.${index}.title`}
                  render={({field}) => (
                    <FormItem className="inline-block">
                      <FormControl>
                        <Input
                          placeholder={`${i18n.t('Enter resource title')}*`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`values.${index}.description`}
                  render={({field}) => (
                    <FormItem className="inline-block">
                      <FormControl>
                        <Textarea
                          placeholder={i18n.t('Enter resource description')}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
        ) : null}
        <Button type="submit" variant="success" className="w-full">
          {i18n.t('Add new resource')}
        </Button>
        {form?.formState?.errors?.values && (
          <p className="block text-destructive">
            {form.formState.errors.values.message}
          </p>
        )}
      </form>
    </Form>
  );
}
