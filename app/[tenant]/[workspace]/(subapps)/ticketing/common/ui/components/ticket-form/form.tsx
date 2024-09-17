'use client';

// ---- CORE IMPORTS ---- //
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {AOSProjectTask} from '@/goovee/.generated/models';
import {i18n} from '@/lib/i18n';
import {Maybe} from '@/types/util';
import {RichTextEditor, ToastAction} from '@/ui/components';
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
import {useToast} from '@/ui/hooks';
import {ID} from '@goovee/orm';
import {zodResolver} from '@hookform/resolvers/zod';
import {pick} from 'lodash';
import {useRouter} from 'next/navigation';
import {useCallback, useEffect, useRef, useState} from 'react';
import {useForm} from 'react-hook-form';

// ---- LOCAL IMPORT ---- //
import {VERSION_MISMATCH_ERROR} from '../../../constants';
import {MutateProps} from '../../../actions';
import {mutate} from '../../../actions';
import {TicketFormSchema, TicketInfo} from './schema';

type TicketFormProps = {
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
  const {categories, priorities, projectId} = props;
  const router = useRouter();
  const {toast} = useToast();
  const {workspaceURL, workspaceURI} = useWorkspace();
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<TicketInfo>({
    resolver: zodResolver(TicketFormSchema),
  });

  const handleSuccess = useCallback(
    (ticketId: string) => {
      setSuccess(true);
      router.replace(
        `${workspaceURI}/ticketing/projects/${projectId}/tickets/${ticketId}`,
      );
    },
    [router, workspaceURI, projectId],
  );

  const handleError = useCallback(
    (message: string) => {
      return toast({
        variant: 'destructive',
        title: message,
        duration: 5000,
      });
    },
    [toast],
  );

  const handleSubmit = useCallback(
    async (value: TicketInfo) => {
      const dirtyFieldKeys = Object.keys(form.formState.dirtyFields);
      const dirtyValues = pick(value, dirtyFieldKeys) as TicketInfo;

      if (!dirtyFieldKeys.length) return router.back();
      const mutateProps: MutateProps = {
        action: {
          type: 'create',
          data: {
            project: projectId,
            ...dirtyValues,
          },
        },
        workspaceURL,
        workspaceURI,
      };

      const {error, message, data} = await mutate(mutateProps);

      if (error) {
        handleError(message);
        return;
      }

      handleSuccess(data.id);
    },
    [
      form.formState.dirtyFields,
      handleError,
      handleSuccess,
      projectId,
      router,
      workspaceURI,
      workspaceURL,
    ],
  );

  return (
    <div className="container">
      <div className="flex items-center justify-between mt-5 mb-5">
        <h3 className="text-lg font-semibold">{i18n.get('Create a ticket')}</h3>
      </div>
      <Form {...form}>
        <form ref={formRef} onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="space-y-4 rounded-md border bg-card p-4">
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
              render={({field}) => {
                return (
                  <FormItem>
                    <FormLabel>{i18n.get('Ticket description')}</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        onChange={field.onChange}
                        classNames={{
                          wrapperClassName: 'overflow-visible',
                          toolbarClassName: 'mt-0',
                          editorClassName: 'px-4',
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                className="w-30"
                variant="success"
                disabled={success}>
                {i18n.get('Create a ticket')}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
