'use client';

import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {AOSProjectTask} from '@/goovee/.generated/models';
import {i18n} from '@/lib/i18n';
import {Maybe} from '@/types/util';
import {
  Avatar,
  AvatarImage,
  Button,
  Input,
  RichTextEditor,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/components';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/ui/components/form';
import {Progress} from '@/ui/components/progress';
import {ID} from '@goovee/orm';
import {zodResolver} from '@hookform/resolvers/zod';
import {pick} from 'lodash';
import {useCallback, useEffect, useRef} from 'react';
import {useForm} from 'react-hook-form';

import {mutate, MutateProps} from '../../../actions';
import {ASSIGNMENT} from '../../../constants';
import {formatDate} from '../../../utils';
import {Category, Priority} from '../pills';
import {Stepper} from '../stepper';
import {TicketFormSchema, TicketInfo} from '../ticket-form';
import {AssignToSupplier} from '../ticket-form/ticket-actions';
import {useRetryAction} from '../../../hooks';

type Props = {
  ticket: AOSProjectTask;
  statuses: {id: ID; name: string}[];
  categories: {id: ID; name: string}[];
  priorities: {id: ID; name: string}[];
};

const getDefaultValues = (ticket: Maybe<AOSProjectTask>) => {
  return {
    subject: ticket?.name ?? '',
    category: ticket?.projectTaskCategory?.id,
    priority: ticket?.priority?.id,
    description: ticket?.description ?? '',
  };
};

export function TicketDetails(props: Props) {
  const {ticket, categories, priorities, statuses} = props;

  const {action} = useRetryAction(mutate);

  const {workspaceURL, workspaceURI} = useWorkspace();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<TicketInfo>({
    resolver: zodResolver(TicketFormSchema),
    defaultValues: getDefaultValues(ticket),
  });

  const handleSubmit = useCallback(
    async (value: TicketInfo) => {
      const dirtyFieldKeys = Object.keys(form.formState.dirtyFields);
      const dirtyValues = pick(value, dirtyFieldKeys) as TicketInfo;

      if (!dirtyFieldKeys.length) return;
      const mutateProps: MutateProps = {
        action: {
          type: 'update',
          data: {
            id: ticket.id!,
            version: ticket.version!,
            ...dirtyValues,
          },
        },
        workspaceURL,
        workspaceURI,
      };

      await action(mutateProps);
    },
    [
      form.formState.dirtyFields,
      action,
      ticket?.id,
      ticket?.version,
      workspaceURI,
      workspaceURL,
    ],
  );

  useEffect(() => {
    form.reset(getDefaultValues(ticket));
  }, [ticket, form]);

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="space-y-4 rounded-md border bg-card p-4 mt-5">
          <Stepper
            steps={statuses}
            current={ticket.status?.id}
            className="mb-12 md:mx-20"
          />
          <div className="space-y-3">
            <div className="flex justify-between">
              <p className="text-base font-medium">#{ticket?.id}</p>
            </div>
            <FormField
              control={form.control}
              name="subject"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      className="text-xl font-semibold h-11"
                      placeholder={i18n.get('Enter your subject')}
                      value={field.value ?? ''}
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
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormLabel className="font-medium text-md">
                    {i18n.get('Category')}:
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger className="w-fit">
                        <SelectValue
                          asChild
                          placeholder={i18n.get('Select your category')}>
                          <Category
                            name={
                              categories.find(c => c.id == field.value)?.name
                            }
                          />
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem
                          value={category.id.toString()}
                          key={category.id}>
                          <Category name={category.name} />
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
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormLabel className="font-medium text-md">
                    {i18n.get('Priority')}:
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger className="w-fit">
                        <SelectValue
                          asChild
                          placeholder={i18n.get('Select your priority')}>
                          <Priority
                            name={
                              priorities.find(c => c.id == field.value)?.name
                            }
                          />
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {priorities.map(priority => (
                        <SelectItem
                          value={priority.id.toString()}
                          key={priority.id}>
                          <Priority name={priority.name} />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <hr />
            <p className="flex !mt-3.5 items-center">
              <span className="font-medium pe-2">
                {i18n.get('Request by')}:
              </span>
              <Avatar className="h-8 w-10">
                <AvatarImage
                  src="/images/user.png"
                  className="h-8 w-10 rounded-full"
                />
              </Avatar>
              <span>
                {ticket.requestedByContact?.name
                  ? ticket.requestedByContact?.name
                  : ticket.project?.company?.name}
              </span>
            </p>
            <p>
              <span className="font-medium pe-2">
                {i18n.get('Created on')}:
              </span>
              {formatDate(ticket.taskDate)}
            </p>
            <hr />

            <div className="flex items-start">
              <div className="flex flex-col space-y-2">
                <p>
                  <span className="font-medium pe-2">Assigned to:</span>
                  {ticket.assignment === ASSIGNMENT.PROVIDER
                    ? ticket.project?.company?.name
                    : ticket.assignedToContact?.name}
                </p>
                <p>
                  <span className="font-medium pe-2">Expected on:</span>
                  {formatDate(ticket.taskEndDate)}
                </p>
              </div>
              {ticket.assignment !== 2 && (
                <div className="ml-auto">
                  <AssignToSupplier id={ticket.id!} version={ticket.version!} />
                </div>
              )}
            </div>
            <hr />
            <div className="sm:flex items-center !mt-3.5">
              <p className="font-medium pe-2"> {i18n.get('Progress')}: </p>
              {getProgress(ticket.progress)}%
              <Progress
                value={getProgress(ticket.progress)}
                className="h-3 basis-3/4 sm:ms-5 rounded-none"
              />
            </div>
            <p>
              <span className="font-medium pe-2"> {i18n.get('Version')}:</span>
              {ticket.targetVersion?.title}
            </p>
            <hr />
            {ticket.displayFinancialData && (
              <p>
                <span className="font-medium"> {i18n.get('Billing')}: </span>
                {ticket.quantity} {ticket.invoicingUnit?.name}
              </p>
            )}
            <div className="!mt-10">
              <FormField
                control={form.control}
                name="description"
                render={({field}) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <RichTextEditor
                          onChange={field.onChange}
                          content={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="success"
              disabled={!form.formState.isDirty}>
              {i18n.get('Save Changes')}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

function Description({description}: {description: Maybe<string>}) {
  if (!description) return null;
  //TODO: sanitize with DOMPurify
  const html = description;
  return <div dangerouslySetInnerHTML={{__html: html}} />;
}

function getProgress(p: Maybe<string>): number {
  if (p) {
    const progress = Number(p);
    if (!isNaN(progress)) {
      return progress;
    }
  }
  return 0;
}
