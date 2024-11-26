'use client';

import {i18n} from '@/i18n';
import type {Maybe} from '@/types/util';
import {
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
import {INVOICING_TYPE} from '../../../constants';
import type {
  ContactPartner,
  Category as TCategory,
  Priority as TPriority,
} from '../../../types';
import {formatDate, isWithProvider} from '../../../utils';
import {Category, Priority, Status} from '../pills';
import {useTicketDetails} from './ticket-details-provider';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

type Props = {
  categories: TCategory[];
  priorities: TPriority[];
  contacts: ContactPartner[];
};

export function TicketDetails(props: Props) {
  const {
    ticketForm: form,
    ticket,
    handleTicketFormSubmit: handleSubmit,
    loading,
  } = useTicketDetails();
  const {tenant} = useWorkspace();
  const {categories, priorities, contacts} = props;

  const closeAndCancel = !ticket.status?.isCompleted && (
    <>
      <CloseTicket />
      <CancelTicket />
    </>
  );

  const assignToButton = <AssignToButton />;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(value => handleSubmit(value))}>
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
                      value={field.value?.toString()}>
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
                      value={field.value?.toString()}>
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
            <p className="!mt-3.5">
              <span className="font-medium pe-2">
                {i18n.get('Created by')}:
              </span>

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
                        value={field.value?.toString()}>
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

function AssignToButton({className}: {className?: string}) {
  const {loading, handleAssignment, ticket} = useTicketDetails();

  const company = ticket.project?.company?.name ?? '';
  const client = ticket.project?.clientPartner?.simpleFullName ?? '';
  return (
    <Button
      size="sm"
      type="button"
      className={className}
      variant="success"
      disabled={loading}
      onClick={handleAssignment}>
      {isWithProvider(ticket.assignment)
        ? i18n.get('Assign to') + ' ' + client
        : i18n.get('Assign to') + ' ' + company}
    </Button>
  );
}

function CancelTicket({className}: {className?: string}) {
  const {loading, handleCancelTicket} = useTicketDetails();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="destructive"
          disabled={loading}
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
              onClick={handleCancelTicket}>
              {i18n.get('OK')}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CloseTicket({className}: {className?: string}) {
  const {loading, handleCloseTicket} = useTicketDetails();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="success"
          disabled={loading}
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
              onClick={handleCloseTicket}>
              {i18n.get('OK')}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
