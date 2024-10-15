'use client';

import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {i18n} from '@/lib/i18n';
import type {Cloned, Maybe} from '@/types/util';
import {
  Avatar,
  AvatarImage,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {useCallback, useEffect, useRef} from 'react';
import type {UseFormReturn} from 'react-hook-form';
import {useForm} from 'react-hook-form';
import type {
  MutateProps,
  MutateResponse,
  TicketActionProps,
  UpdateAssignmentProps,
} from '../../../actions';
import {
  cancelTicket,
  closeTicket,
  mutate,
  updateAssignment,
} from '../../../actions';
import {ASSIGNMENT, INVOICING_TYPE} from '../../../constants';
import {useRetryAction} from '../../../hooks';
import type {
  ContactPartner,
  Category as TCategory,
  Priority as TPriority,
} from '../../../orm/projects';
import type {Ticket} from '../../../orm/tickets';
import {TicketFormSchema, TicketInfo} from '../../../schema';
import {formatDate, getProfilePic, isWithProvider} from '../../../utils';
import {Category, Priority, Status} from '../pills';
import {Skeleton} from '@/ui/components/skeleton';

type Props = {
  ticket: Cloned<Ticket>;
  categories: TCategory[];
  priorities: TPriority[];
  contacts: ContactPartner[];
};

const getDefaultValues = (ticket: Cloned<Ticket>) => {
  return {
    subject: ticket?.name ?? '',
    category: ticket?.projectTaskCategory?.id,
    priority: ticket?.priority?.id,
    description: ticket?.description ?? '',
    assignment: ticket?.assignment,
    managedBy: ticket?.assignedToContact?.id,
  };
};

export function TicketDetails(props: Props) {
  const {ticket, categories, priorities, contacts} = props;

  const company = ticket.project?.company?.name ?? '';
  const client = ticket.project?.clientPartner?.simpleFullName ?? '';

  const {action: muatateAction, loading: isSubmitting} = useRetryAction(mutate);
  const {action: closeTicketAction, loading: isClosingTicket} = useRetryAction(
    closeTicket,
    i18n.get('Ticket closed'),
  );

  const {action: cancelTicketAction, loading: isCancellingTicket} =
    useRetryAction(cancelTicket, i18n.get('Ticket canceled'));

  const {action: updateAssignmentAction, loading: isUpdatingAssignment} =
    useRetryAction(
      updateAssignment,
      isWithProvider(ticket.assignment)
        ? i18n.get('Ticket assigned to') + ' ' + client
        : i18n.get('Ticket assigned to') + ' ' + company,
    );

  const {workspaceURL, workspaceURI} = useWorkspace();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<TicketInfo>({
    resolver: zodResolver(TicketFormSchema),
    defaultValues: getDefaultValues(ticket),
  });

  const loading =
    isSubmitting ||
    isClosingTicket ||
    isCancellingTicket ||
    isUpdatingAssignment ||
    form.formState.isSubmitting;

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

      await muatateAction(mutateProps, onSuccess);
    },
    [
      form.formState.dirtyFields,
      muatateAction,
      ticket?.id,
      ticket?.version,
      workspaceURI,
      workspaceURL,
    ],
  );

  const closeAndCancel = !ticket.status?.isCompleted && (
    <>
      <CloseTicket
        id={ticket.id}
        version={ticket.version}
        disabled={loading}
        form={form}
        handleSubmit={handleSubmit}
        action={closeTicketAction}
      />
      <CancelTicket
        id={ticket.id}
        version={ticket.version}
        disabled={loading}
        form={form}
        handleSubmit={handleSubmit}
        action={cancelTicketAction}
      />
    </>
  );

  const assignToButton = (
    <AssignToButton
      id={ticket.id}
      version={ticket.version}
      disabled={loading}
      form={form}
      handleSubmit={handleSubmit}
      assignment={ticket.assignment ?? ASSIGNMENT.PROVIDER}
      company={company}
      client={client}
      action={updateAssignmentAction}
    />
  );

  useEffect(() => {
    form.reset(getDefaultValues(ticket));
  }, [ticket, form]);

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(value => handleSubmit(value))}>
        <div className="flex flex-col-reverse lg:flex-col gap-4 rounded-md border bg-card p-4 mt-5">
          <div className="grid grid-cols-1 gap-4 lg:flex lg:flex-row-reverse lg:justify-start lg:grow">
            <Button
              size="sm"
              type="submit"
              variant="success"
              disabled={!form.formState.isDirty || loading}>
              {i18n.get('Save Changes')}
            </Button>
            <div className="contents lg:hidden">
              {assignToButton}
              {closeAndCancel}
            </div>
          </div>
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
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span>
                  <span className="font-medium pe-2">
                    {i18n.get('Status')}:
                  </span>
                  <Status name={ticket.status?.name} />
                </span>
                <span className="hidden lg:inline-flex gap-4 ml-auto">
                  {closeAndCancel}
                </span>
              </div>
              <hr className="hidden lg:block" />
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
            </div>
            <hr />
            <p className="flex !mt-3.5 items-center">
              <span className="font-medium pe-2">
                {i18n.get('Created by')}:
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
              {formatDate(ticket.createdOn)}
            </p>
            <hr />

            <div>
              <div className="lg:flex space-y-2 mb-3">
                <div>
                  <div className="flex items-center gap-2 space-y-0">
                    <span className="font-medium pe-2">
                      {i18n.get('Assigned to')}:
                    </span>
                    <div className="h-10 flex items-center">
                      {isWithProvider(ticket.assignment)
                        ? ticket.project?.company?.name
                        : ticket.project?.clientPartner?.simpleFullName}
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block ml-auto">{assignToButton}</div>
              </div>

              <div className="lg:flex space-y-2 mb-3">
                <FormField
                  control={form.control}
                  name="managedBy"
                  render={({field}) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormLabel className="font-medium text-md">
                        {i18n.get('Managed by')}:
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger className="w-fit">
                            <SelectValue
                              placeholder={i18n.get('Select Assignee')}
                            />
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
                            wrapperClassName: 'overflow-visible bg-card',
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
  className?: string;
};

function AssignToButton(
  props: ActionProps & {
    assignment: number;
    client: string;
    company: string;
    action: (
      actionProps: UpdateAssignmentProps,
      onSuccess?: ((res: true) => Promise<void>) | undefined,
    ) => Promise<void>;
  },
) {
  const {
    id,
    version,
    disabled,
    form,
    handleSubmit,
    className,
    assignment,
    client,
    company,
    action,
  } = props;
  const {workspaceURL} = useWorkspace();
  const handleClick = useCallback(async () => {
    if (disabled) return;
    const onSuccess = async (data?: MutateResponse) => {
      let newVersion = version;
      if (data) {
        newVersion = data.version;
      }

      return await action({
        data: {
          id,
          version: newVersion,
          assignment: isWithProvider(assignment)
            ? ASSIGNMENT.CUSTOMER
            : ASSIGNMENT.PROVIDER,
        },
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
  }, [
    id,
    version,
    workspaceURL,
    action,
    form,
    handleSubmit,
    disabled,
    assignment,
  ]);

  return (
    <Button
      size="sm"
      type="button"
      className={className}
      variant="success"
      disabled={disabled}
      onClick={handleClick}>
      {isWithProvider(assignment)
        ? i18n.get('Assign to') + ' ' + client
        : i18n.get('Assign to') + ' ' + company}
    </Button>
  );
}

function CancelTicket(
  props: ActionProps & {
    action: (
      actionProps: TicketActionProps,
      onSuccess?: ((res: true) => Promise<void>) | undefined,
    ) => Promise<void>;
  },
) {
  const {id, version, disabled, form, handleSubmit, action, className} = props;
  const {workspaceURL} = useWorkspace();

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
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="destructive"
          disabled={disabled}
          className={className}>
          {i18n.get('Cancel ticket')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{i18n.get('Are you sure?')}</DialogTitle>
          <DialogDescription>
            {i18n.get('This action cannot be undone.')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" size="sm" variant="outline">
              {i18n.get('Cancel')}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={handleClick}>
              {i18n.get('OK')}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CloseTicket(
  props: ActionProps & {
    action: (
      actionProps: TicketActionProps,
      onSuccess?: ((res: true) => Promise<void>) | undefined,
    ) => Promise<void>;
  },
) {
  const {id, version, disabled, form, handleSubmit, className, action} = props;
  const {workspaceURL} = useWorkspace();

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
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="success"
          disabled={disabled}
          className={className}>
          {i18n.get('Close ticket')}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{i18n.get('Are you sure?')}</DialogTitle>
          <DialogDescription>
            {i18n.get('This action cannot be undone.')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" size="sm" variant="outline">
              {i18n.get('Cancel')}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={handleClick}>
              {i18n.get('OK')}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
