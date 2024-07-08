'use client';

import {useRef} from 'react';
import {useRouter} from 'next/navigation';
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
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {cn} from '@/utils/css';
import {useToast} from '@/ui/hooks/use-toast';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

import {create} from './action';
import {DynamicIcon} from '@/subapps/resources/common/ui/components';

const formSchema = z.object({
  title: z.string().min(1, {message: 'Title is required'}),
  parent: z.string(),
  description: z.string(),
  icon: z.string(),
  color: z.string(),
});

export default function ResourceForm({categories, colors, icons}: any) {
  const formRef = useRef<HTMLFormElement>(null);
  const {toast} = useToast();
  const router = useRouter();
  const {workspaceURI} = useWorkspace();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      parent: '',
      description: '',
      icon: '',
      color: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('icon', values.icon);
    formData.append('parent', values.parent);
    formData.append('color', values.color);

    const result = await create(formData);

    if (result.success) {
      toast({
        title: 'Category created successfully.',
      });
      router.push(
        `${workspaceURI}/resources/categories?id=${result?.data?.id}`,
      );
    } else {
      toast({
        variant: 'destructive',
        title: 'Error creating resource',
      });
    }
  };

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({field}) => (
            <FormItem>
              <FormLabel>Category title*</FormLabel>
              <FormControl>
                <Input placeholder="Enter Category title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="parent"
          render={({field}) => (
            <FormItem>
              <FormLabel>Parent</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a parent" />
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

        <FormField
          control={form.control}
          name="description"
          render={({field}) => (
            <FormItem>
              <FormLabel>Category description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter category description" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="icon"
          render={({field}) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <FormControl>
                <div className="border rounded-lg p-6 flex gap-6 flex-wrap">
                  {icons.map((icon: string, i: string) => {
                    return (
                      <DynamicIcon
                        key={i}
                        icon={icon}
                        className={cn(
                          'h-6 w-6 text-main-black shrink-0 cursor-pointer',
                          {
                            'text-green-700': field.value === icon,
                          },
                        )}
                        onClick={() => field.onChange(icon)}
                      />
                    );
                  })}
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({field}) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a color" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {colors.map((color: any) => (
                    <SelectItem value={color.value} key={color.value}>
                      {color.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Add new category
        </Button>
      </form>
    </Form>
  );
}
