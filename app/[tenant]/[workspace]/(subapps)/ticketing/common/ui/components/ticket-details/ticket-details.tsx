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
import {ASSIGNMENT, INVOICING_TYPE} from '../../../constants';
import {useRetryAction} from '../../../hooks';
import {TicketFormSchema, TicketInfo} from '../../../schema';
import {formatDate, getProfilePic} from '../../../utils';
import {Category, Priority} from '../pills';
import {Stepper} from '../stepper';
import {AssignToSupplier} from '../ticket-form/ticket-actions';

type Props = {
  ticket: AOSProjectTask;
  statuses: {id: ID; name: string}[];
  categories: {id: ID; name: string}[];
  priorities: {id: ID; name: string}[];
  contacts: {id: ID; name: string}[];
};

const getDefaultValues = (ticket: Maybe<AOSProjectTask>) => {
  return {
    subject: ticket?.name ?? '',
    category: ticket?.projectTaskCategory?.id,
    priority: ticket?.priority?.id,
    description: ticket?.description ?? '',
    assignedTo: ticket?.assignedToContact?.id,
  };
};

export function TicketDetails(props: Props) {
  const {ticket, categories, priorities, statuses, contacts} = props;

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
                {i18n.get('Requested by')}:
              </span>
              <Avatar className="h-8 w-8">
                <AvatarImage
                  className="object-cover"
                  src={getProfilePic(
                    ticket.requestedByContact?.id
                      ? ticket.requestedByContact.picture?.id
                      : ticket.project?.company?.logo?.id,
                  )}
                />
              </Avatar>
              <span className="ms-2">
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
                <div>
                  {ticket.assignment === ASSIGNMENT.PROVIDER ? (
                    <div className="flex items-center gap-2 space-y-0">
                      <span className="font-medium pe-2">
                        {i18n.get('Assigned to')}:
                      </span>
                      <div className="h-10 flex items-center">
                        {ticket.project?.company?.name}
                      </div>
                    </div>
                  ) : (
                    <FormField
                      control={form.control}
                      name="assignedTo"
                      render={({field}) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormLabel className="font-medium text-md">
                            {i18n.get('Assigned to')}:
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value?.toString()}>
                            <FormControl>
                              <SelectTrigger className="w-fit">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {contacts.map(contact => (
                                <SelectItem
                                  value={contact.id.toString()}
                                  key={contact.id}>
                                  {contact.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                <p>
                  <span className="font-medium pe-2">Expected on:</span>
                  {formatDate(ticket.taskEndDate)}
                </p>
              </div>
              {ticket.assignment !== ASSIGNMENT.PROVIDER && (
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
            {ticket.displayFinancialData &&
              ticket.invoicingType === INVOICING_TYPE.PACKAGE && (
                <div className="flex gap-4">
                  <span className="font-medium">
                    {i18n.get('Financial data')}:
                  </span>
                  <div className="flex flex-col">
                    <span className="font-medium">{i18n.get('Qty')}</span>
                    <span>{ticket.quantity}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {i18n.get('Invoicing unit')}
                    </span>
                    <span>{ticket.invoicingUnit?.name}</span>
                  </div>
                </div>
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
                          content={ticket.description}
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

function getProgress(p: Maybe<string>): number {
  if (p) {
    const progress = Number(p);
    if (!isNaN(progress)) {
      return progress;
    }
  }
  return 0;
}
