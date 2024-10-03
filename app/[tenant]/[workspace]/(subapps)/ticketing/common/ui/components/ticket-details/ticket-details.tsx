'use client';

import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {i18n} from '@/lib/i18n';
import {Cloned, Maybe} from '@/types/util';
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
import {zodResolver} from '@hookform/resolvers/zod';
import {pick} from 'lodash';
import {ReactNode, useCallback, useEffect, useRef} from 'react';
import {useForm, UseFormReturn} from 'react-hook-form';

import {
  assignToSupplier,
  cancelTicket,
  closeTicket,
  mutate,
  MutateProps,
  MutateResponse,
} from '../../../actions';
import {ASSIGNMENT, INVOICING_TYPE} from '../../../constants';
import {useRetryAction} from '../../../hooks';
import type {
  ContactPartner,
  Category as TCategory,
  Priority as TPriority,
  Status as TStatus,
} from '../../../orm/projects';
import type {Ticket} from '../../../orm/tickets';
import {TicketFormSchema, TicketInfo} from '../../../schema';
import {formatDate, getProfilePic} from '../../../utils';
import {Category, Priority} from '../pills';
import {Stepper} from '../stepper';

type Props = {
  ticket: Cloned<Ticket>;
  statuses: TStatus[];
  categories: TCategory[];
  priorities: TPriority[];
  contacts: ContactPartner[];
  breadCrumbs: ReactNode;
};

const getDefaultValues = (ticket: Cloned<Ticket>) => {
  return {
    subject: ticket?.name ?? '',
    category: ticket?.projectTaskCategory?.id,
    priority: ticket?.priority?.id,
    description: ticket?.description ?? '',
    assignedTo: ticket?.assignedToContact?.id,
  };
};

export function TicketDetails(props: Props) {
  const {ticket, categories, priorities, statuses, contacts, breadCrumbs} =
    props;

  const {action, loading} = useRetryAction(mutate);

  const {workspaceURL, workspaceURI} = useWorkspace();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<TicketInfo>({
    resolver: zodResolver(TicketFormSchema),
    defaultValues: getDefaultValues(ticket),
  });

  const handleSubmit = useCallback(
    async (
      value: TicketInfo,
      onSuccess?: (res: MutateResponse) => Promise<void>,
    ) => {
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

      await action(mutateProps, onSuccess);
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
      <div className="flex flex-col lg:flex-row gap-4 justify-between min-h-9 items-center">
        {breadCrumbs}
        {!ticket.status?.isCompleted && (
          <div className="flex gap-4">
            <CancelTicket
              id={ticket.id}
              version={ticket.version}
              disabled={form.formState.isSubmitting || loading}
              form={form}
              handleSubmit={handleSubmit}
            />
            <CloseTicket
              id={ticket.id}
              version={ticket.version}
              disabled={form.formState.isSubmitting || loading}
              form={form}
              handleSubmit={handleSubmit}
            />
          </div>
        )}
      </div>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(value => handleSubmit(value))}>
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
                {ticket.requestedByContact?.simpleFullName
                  ? ticket.requestedByContact?.simpleFullName
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

            <div>
              <div className="sm:flex space-y-2 mb-3">
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
                                  {contact.simpleFullName}
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
                {ticket.assignment !== ASSIGNMENT.PROVIDER && (
                  <div className="sm:ml-auto ml-[6.5rem]">
                    <AssignToSupplier
                      id={ticket.id}
                      version={ticket.version}
                      disabled={form.formState.isSubmitting || loading}
                      form={form}
                      handleSubmit={handleSubmit}
                    />
                  </div>
                )}
              </div>
              <p>
                <span className="font-medium pe-2">Expected on:</span>
                {formatDate(ticket.taskEndDate)}
              </p>
            </div>
            <hr />
            <div className="sm:flex items-center !mt-3.5">
              <p className="font-medium pe-2 mb-3 sm:mb-0">
                {i18n.get('Progress')}: {getProgress(ticket.progress)}%
              </p>
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
              disabled={
                !form.formState.isDirty ||
                form.formState.isSubmitting ||
                loading
              }>
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

type ActionProps = {
  id: string;
  version: number;
  form: UseFormReturn<TicketInfo>;
  disabled: boolean;
  handleSubmit: (
    value: TicketInfo,
    onSuccess?: (res: MutateResponse) => Promise<void>,
  ) => void;
};

function AssignToSupplier(props: ActionProps) {
  const {id, version, disabled, form, handleSubmit} = props;
  const {workspaceURL} = useWorkspace();
  const {action, loading} = useRetryAction(
    assignToSupplier,
    i18n.get('Ticket assigned to supplier'),
  );

  const handleClick = useCallback(async () => {
    if (disabled) return;
    const onSuccess = async (data?: MutateResponse) => {
      let newVersion = version;
      if (data) {
        newVersion = data.version;
      }

      return await action({
        data: {id: id, version: newVersion},
        workspaceURL,
      });
    };

    if (form.formState.isDirty) {
      const isValid = await form.trigger(undefined, {shouldFocus: true});
      if (!isValid) return;

      const dirtyFieldKeys = Object.keys(form.formState.dirtyFields);
      const dirtyValues = pick(form.getValues(), dirtyFieldKeys) as TicketInfo;
      return handleSubmit(dirtyValues, onSuccess);
    }

    await onSuccess();
  }, [id, version, workspaceURL, action, form, handleSubmit, disabled]);

  return (
    <Button
      size="sm"
      type="button"
      variant="success"
      disabled={loading || disabled}
      onClick={handleClick}>
      {i18n.get('Assign to supplier')}
    </Button>
  );
}

function CancelTicket(props: ActionProps) {
  const {id, version, disabled, form, handleSubmit} = props;
  const {workspaceURL} = useWorkspace();
  const {action, loading} = useRetryAction(
    cancelTicket,
    i18n.get('Ticket canceled'),
  );

  const handleClick = useCallback(async () => {
    if (disabled) return;
    const onSuccess = async (data?: MutateResponse) => {
      let newVersion = version;
      if (data) {
        newVersion = data.version;
      }

      return await action({
        data: {id: id, version: newVersion},
        workspaceURL,
      });
    };

    if (form.formState.isDirty) {
      const isValid = await form.trigger(undefined, {shouldFocus: true});
      if (!isValid) return;

      const dirtyFieldKeys = Object.keys(form.formState.dirtyFields);
      const dirtyValues = pick(form.getValues(), dirtyFieldKeys) as TicketInfo;
      return handleSubmit(dirtyValues, onSuccess);
    }

    await onSuccess();
  }, [id, version, workspaceURL, action, form, handleSubmit, disabled]);

  return (
    <Button
      size="sm"
      variant="destructive"
      disabled={loading}
      onClick={handleClick}>
      {i18n.get('Cancel ticket')}
    </Button>
  );
}

function CloseTicket(props: ActionProps) {
  const {id, version, disabled, form, handleSubmit} = props;
  const {workspaceURL} = useWorkspace();
  const {action, loading} = useRetryAction(
    closeTicket,
    i18n.get('Ticket closed'),
  );

  const handleClick = useCallback(async () => {
    if (disabled) return;
    const onSuccess = async (data?: MutateResponse) => {
      let newVersion = version;
      if (data) {
        newVersion = data.version;
      }

      return await action({
        data: {id: id, version: newVersion},
        workspaceURL,
      });
    };

    if (form.formState.isDirty) {
      const isValid = await form.trigger(undefined, {shouldFocus: true});
      if (!isValid) return;

      const dirtyFieldKeys = Object.keys(form.formState.dirtyFields);
      const dirtyValues = pick(form.getValues(), dirtyFieldKeys) as TicketInfo;
      return handleSubmit(dirtyValues, onSuccess);
    }

    await onSuccess();
  }, [id, version, workspaceURL, action, form, handleSubmit, disabled]);

  return (
    <Button
      size="sm"
      variant="success"
      disabled={loading}
      onClick={handleClick}>
      {i18n.get('Close ticket')}
    </Button>
  );
}
