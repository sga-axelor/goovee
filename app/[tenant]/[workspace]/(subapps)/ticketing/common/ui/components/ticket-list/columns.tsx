import {i18n} from '@/lib/i18n';
import type {Cloned} from '@/types/util';
import type {Ticket, TicketListTicket} from '../../../orm/tickets';
import {formatDate, isWithProvider} from '../../../utils';
import {Category, Priority, Status} from '../pills';
import type {Column} from '../table-elements';

export const ticketColumns: Column<Cloned<TicketListTicket>>[] = [
  {
    key: 'ticketId',
    label: i18n.get('Ticket ID'),
    content: t => <p className="font-medium">#{t.id}</p>,
    getter: 'id',
    mobile: true,
  },
  {
    key: 'createdBy',
    label: i18n.get('Created by'),
    content: t =>
      t.requestedByContact?.id
        ? t.requestedByContact.simpleFullName
        : t.project?.company?.name,
    getter: t =>
      t.requestedByContact?.simpleFullName ?? t.project?.company?.name,
  },
  {
    key: 'subject',
    label: i18n.get('Subject'),
    content: t => <div className="max-w-40 line-clamp-2">{t.name}</div>,
    getter: 'name',
    mobile: true,
  },
  {
    key: 'priority',
    label: i18n.get('Priority'),
    content: t => <Priority name={t.priority?.name} />,
    getter: 'priority.name',
  },
  {
    key: 'status',
    label: i18n.get('Status'),
    content: t => <Status name={t.status?.name} />,
    getter: 'status.name',
  },
  {
    key: 'category',
    label: i18n.get('Category'),
    content: t => <Category name={t.projectTaskCategory?.name} />,
    getter: 'projectTaskCategory.name',
  },
  {
    key: 'managedBy',
    label: i18n.get('Managed by'),
    content: t => t.assignedToContact?.simpleFullName,
    getter: 'assignedToContact.simpleFullName',
  },
  {
    key: 'assignedTo',
    label: i18n.get('Assigned to'),
    content: t =>
      isWithProvider(t.assignment)
        ? t?.project?.company?.name
        : t.project?.clientPartner?.simpleFullName,
    getter: t =>
      isWithProvider(t.assignment)
        ? t.project?.company?.name
        : t.project?.clientPartner?.simpleFullName,
  },
  {
    key: 'updatedOn',
    label: i18n.get('Updated'),
    content: t => formatDate(t.updatedOn),
    getter: 'updatedOn',
  },
];

export const childColumns: Column<
  Cloned<NonNullable<Ticket['childTasks']>[number]>
>[] = [
  {
    key: 'ticketId',
    label: i18n.get('Ticket ID'),
    content: t => <p className="font-medium">#{t.id}</p>,
    getter: 'id',
    mobile: true,
  },
  {
    key: 'subject',
    label: i18n.get('Subject'),
    content: t => <div className="max-w-40 line-clamp-2">{t.name}</div>,
    getter: 'name',
    mobile: true,
  },
  {
    key: 'priority',
    label: i18n.get('Priority'),
    content: t => <Priority name={t.priority?.name} />,
    getter: 'priority.name',
  },
  {
    key: 'status',
    label: i18n.get('Status'),
    content: t => <Status name={t.status?.name} />,
    getter: 'status.name',
  },
  {
    key: 'category',
    label: i18n.get('Category'),
    content: t => <Category name={t.projectTaskCategory?.name} />,
    getter: 'projectTaskCategory.name',
  },
  {
    key: 'managedBy',
    label: i18n.get('Managed by'),
    content: t => t.assignedToContact?.simpleFullName,
    getter: 'assignedToContact.simpleFullName',
  },
  {
    key: 'assignedTo',
    label: i18n.get('Assigned to'),
    content: t =>
      isWithProvider(t.assignment)
        ? t?.project?.company?.name
        : t.project?.clientPartner?.simpleFullName,
    getter: t =>
      isWithProvider(t.assignment)
        ? t.project?.company?.name
        : t.project?.clientPartner?.simpleFullName,
  },
  {
    key: 'updatedOn',
    label: i18n.get('Updated'),
    content: t => formatDate(t.updatedOn),
    getter: 'updatedOn',
  },
];

export const relatedColumns: Column<
  Cloned<NonNullable<Ticket['projectTaskLinkList']>[number]>
>[] = [
  {
    key: 'linkType',
    label: i18n.get('Link type'),
    content: l => <p className="font-medium">{l.projectTaskLinkType?.name}</p>,
    getter: 'projectTaskLinkType.name',
    mobile: true,
  },
  {
    key: 'ticketId',
    label: i18n.get('Ticket ID'),
    content: ({relatedTask: t}) => <p className="font-medium">#{t?.id}</p>,
    getter: 'relatedTask.id',
  },
  {
    key: 'subject',
    label: i18n.get('Subject'),
    content: ({relatedTask: t}) => (
      <div className="max-w-40 line-clamp-2">{t?.name}</div>
    ),
    getter: 'relatedTask.name',
    mobile: true,
  },
  {
    key: 'priority',
    label: i18n.get('Priority'),
    content: ({relatedTask: t}) => <Priority name={t?.priority?.name} />,
    getter: 'relatedTask.priority.name',
  },
  {
    key: 'status',
    label: i18n.get('Status'),
    content: ({relatedTask: t}) => <Status name={t?.status?.name} />,
    getter: 'relatedTask.status.name',
  },
  {
    key: 'managedBy',
    label: i18n.get('Managed by'),
    content: ({relatedTask: t}) => t?.assignedToContact?.simpleFullName,
    getter: 'relatedTask.assignedToContact.simpleFullName',
  },
  {
    key: 'assignedTo',
    label: i18n.get('Assigned to'),
    content: ({relatedTask: t}) =>
      isWithProvider(t?.assignment)
        ? t?.project?.company?.name
        : t?.project?.clientPartner?.simpleFullName,
    getter: ({relatedTask: t}) =>
      isWithProvider(t?.assignment)
        ? t?.project?.company?.name
        : t?.project?.clientPartner?.simpleFullName,
  },
  {
    key: 'updatedOn',
    label: i18n.get('Updated'),
    content: ({relatedTask: t}) => formatDate(t?.updatedOn),
    getter: 'relatedTask.updatedOn',
  },
];
