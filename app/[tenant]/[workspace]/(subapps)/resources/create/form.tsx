'use client';

import {useRef} from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/components/select';
import {Textarea} from '@/ui/components/textarea';
import {useToast} from '@/ui/components/use-toast';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm, useFieldArray} from 'react-hook-form';
import {z} from 'zod';
import {useRouter} from 'next/navigation';
import {useDropzone} from 'react-dropzone';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {MdDelete} from 'react-icons/md';

import {upload} from './action';
import {getFileSizeText} from '@/subapps/resources/common/utils';

const MAX_FILE_SIZE = 20000000;

const formSchema = z.object({
  values: z
    .array(
      z.object({
        title: z.string().min(2, {message: 'Title is required'}),
        description: z.string(),
        file: z
          .any()
          .refine(file => file, 'File is required.')
          .refine(file => file.size <= MAX_FILE_SIZE, `Max file size is 20MB.`),
      }),
    )
    .min(1, {message: 'Single file is required to create resource'}),
  category: z.string().min(1, {message: 'Category is required'}),
});

export default function ResourceForm({categories}: any) {
  const {toast} = useToast();
  const router = useRouter();
  const {workspaceURI} = useWorkspace();

  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: '',
      values: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    formData.append('category', values.category);

    values.values.forEach((value: any, index: number) => {
      formData.append(`values[${index}][title]`, value.title);
      formData.append(`values[${index}][description]`, value.description);
      formData.append(`values[${index}][file]`, value.file);
    });

    const result = await upload(formData);

    if (result.success) {
      toast({
        title: 'Resource created successfully.',
      });
      router.push(`${workspaceURI}/resources/categories?id=${values.category}`);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error creating resource',
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

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8">
        <FormField
          control={form.control}
          name="category"
          render={({field}) => (
            <FormItem>
              <FormLabel>Category*</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category: any) => (
                    <SelectItem value={category.id} key={category.id}>
                      {category.fileName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div
          {...getRootProps({className: 'dropzone'})}
          className="flex justify-center items-center cursor-pointer rounded bg-muted h-36">
          <input {...getInputProps()} />
          <p>Drag and drop some files here, or click to select files</p>
        </div>
        {fields?.length ? (
          <div className="flex flex-col gap-2">
            <h4 className="text-lg font-semibold">Uploaded Files</h4>
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
                    onClick={() =>
                      window.confirm('Do you want to remove?') && remove(index)
                    }
                  />
                </div>
                <FormField
                  control={form.control}
                  name={`values.${index}.title`}
                  render={({field}) => (
                    <FormItem className="inline-block">
                      <FormControl>
                        <Input placeholder="Enter resource title*" {...field} />
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
                          placeholder="Enter resource description"
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
        <Button type="submit">Submit</Button>
        {form?.formState?.errors?.values && (
          <p className="block text-destructive">
            {form.formState.errors.values.message}
          </p>
        )}
      </form>
    </Form>
  );
}
