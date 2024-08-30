'use client';

// ---- CORE IMPORTS ---- //
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {AOSProjectTask} from '@/goovee/.generated/models';
import {i18n} from '@/lib/i18n';
import {Textarea} from '@/ui/components';
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
import {ID} from '@goovee/orm';
import {zodResolver} from '@hookform/resolvers/zod';
import {pick} from 'lodash';
import {useRouter} from 'next/navigation';
import {useRef} from 'react';
import {useForm} from 'react-hook-form';

// ---- LOCAL IMPORT ---- //
import {mutate} from './action';
import {TicketFormSchema, TicketInfo} from './schema';

type TicketFormProps = {
  ticket?: AOSProjectTask;
  projectId: string;
  categories: {
    id: ID;
    name: string;
  }[];
  priorities: {
    id: ID;
    name: string;
  }[];
};

export function TicketForm(props: TicketFormProps) {
  const {ticket, categories, priorities, projectId} = props;
  const router = useRouter();
  const {workspaceURL, workspaceURI} = useWorkspace();

  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<TicketInfo>({
    resolver: zodResolver(TicketFormSchema),
    defaultValues: {
      subject: ticket?.name ?? '',
      category: ticket?.projectTaskCategory?.id,
      priority: ticket?.priority?.id,
      description: ticket?.description ?? '',
    },
  });

  const handleSubmit = async (value: TicketInfo) => {
    const dirtyFieldKeys = Object.keys(form.formState.dirtyFields);
    const dirtyValues = pick(value, dirtyFieldKeys) as TicketInfo;

    if (!dirtyFieldKeys.length) return router.back();

    const {error, message, data} = await mutate({
      action:
        ticket?.id && ticket?.version
          ? {
              type: 'update',
              data: {
                id: ticket.id,
                version: ticket.version,
                ...dirtyValues,
              },
            }
          : {
              type: 'create',
              data: {
                project: projectId,
                ...dirtyValues,
              },
            },
      workspaceURL,
      workspaceURI,
    });

    if (error) {
      return console.error(message);
    }

    router.replace(
      `${workspaceURI}/ticketing/projects/${projectId}/tickets/${data.id}`,
    );
  };

  return (
    <div className="container">
      <div className="flex items-center justify-between mt-5 mb-5">
        <h3 className="text-lg font-semibold">
          {ticket?.id
            ? i18n.get('Update a ticket')
            : i18n.get('Create a ticket')}
        </h3>
      </div>
      <Form {...form}>
        <form ref={formRef} onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="space-y-4 rounded-md border bg-white p-4">
            <FormField
              control={form.control}
              name="subject"
              render={({field}) => (
                <FormItem>
                  <FormLabel>{i18n.get('Subject')}*</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      placeholder={i18n.get('Enter your subject')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({field}) => (
                <FormItem>
                  <FormLabel>{i18n.get('Category')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={i18n.get('Select your category')}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem
                          value={category.id.toString()}
                          key={category.id}>
                          {category.name}
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
              name="priority"
              render={({field}) => (
                <FormItem>
                  <FormLabel>{i18n.get('Priority')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={i18n.get('Select your priority')}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {priorities.map(priority => (
                        <SelectItem
                          value={priority.id.toString()}
                          key={priority.id}>
                          {priority.name}
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
                  <FormLabel>{i18n.get('Ticket description')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={i18n.get('Enter ticket description')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" className="w-30" variant="success">
                {ticket?.id ? i18n.get('Update') : i18n.get('Create a ticket')}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
