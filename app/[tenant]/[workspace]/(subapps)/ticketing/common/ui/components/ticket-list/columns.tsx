import {formatDate} from '@/locale/formatters';
import type {Cloned} from '@/types/util';
import type {
  ChildTicket,
  ParentTicket,
  TicketLink,
  TicketListTicket,
} from '../../../types';
import {isWithProvider} from '../../../utils';
import {Category, Priority, Status} from '../pills';
import type {Column} from '../table-elements';

export const ticketColumns: Column<Cloned<TicketListTicket>>[] = [
  {
    key: 'id',
    label: 'Ticket ID',
    content: t => <p className="font-medium">#{t.id}</p>,
    getter: 'id',
    mobile: true,
  },
  {
    key: 'createdByContact',
    label: 'Created by',
    content: t =>
      t.createdByContact?.id
        ? t.createdByContact.simpleFullName
        : t.project?.company?.name,
    getter: t => t.createdByContact?.simpleFullName ?? t.project?.company?.name,
  },
  {
    key: 'name',
    label: 'Subject',
    // content: t => <div className="max-w-40 line-clamp-2">{t.name}</div>,
    content: t => <div className="line-clamp-2">{t.name}</div>,
    getter: 'name',
    mobile: true,
    required: true,
  },
  {
    key: 'priority',
    label: 'Priority',
    content: t => <Priority name={t.priority?.name} />,
    getter: 'priority.name',
  },
  {
    key: 'status',
    label: 'Status',
    content: t => <Status name={t.status?.name} />,
    getter: 'status.name',
  },
  {
    key: 'projectTaskCategory',
    label: 'Category',
    content: t => <Category name={t.projectTaskCategory?.name} />,
    getter: 'projectTaskCategory.name',
  },
  {
    key: 'managedByContact',
    label: 'Managed by',
    content: t => t.managedByContact?.simpleFullName,
    getter: 'managedByContact.simpleFullName',
  },
  {
    key: 'assignment',
    label: 'Assigned to',
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
    label: 'Updated',
    content: t => formatDate(t?.updatedOn!),
    getter: 'updatedOn',
  },
];

export const parentColumns: Column<Cloned<ParentTicket>>[] = [
  {
    key: 'id',
    label: 'Ticket ID',
    content: t => <p className="font-medium">#{t.id}</p>,
    getter: 'id',
    mobile: true,
  },
  {
    key: 'name',
    label: 'Subject',
    content: t => <div className="max-w-40 line-clamp-2">{t.name}</div>,
    getter: 'name',
    mobile: true,
    required: true,
  },
  {
    key: 'priority',
    label: 'Priority',
    content: t => <Priority name={t.priority?.name} />,
    getter: 'priority.name',
  },
  {
    key: 'status',
    label: 'Status',
    content: t => <Status name={t.status?.name} />,
    getter: 'status.name',
  },
  {
    key: 'projectTaskCategory',
    label: 'Category',
    content: t => <Category name={t.projectTaskCategory?.name} />,
    getter: 'projectTaskCategory.name',
  },
  {
    key: 'managedByContact',
    label: 'Managed by',
    content: t => t.managedByContact?.simpleFullName,
    getter: 'managedByContact.simpleFullName',
  },
  {
    key: 'assignment',
    label: 'Assigned to',
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
    label: 'Updated',
    content: t => formatDate(t?.updatedOn!),
    getter: 'updatedOn',
  },
];

export const childColumns: Column<Cloned<ChildTicket>>[] = [
  {
    key: 'id',
    label: 'Ticket ID',
    content: t => <p className="font-medium">#{t.id}</p>,
    getter: 'id',
    mobile: true,
  },
  {
    key: 'name',
    label: 'Subject',
    content: t => <div className="max-w-40 line-clamp-2">{t.name}</div>,
    getter: 'name',
    mobile: true,
    required: true,
  },
  {
    key: 'priority',
    label: 'Priority',
    content: t => <Priority name={t.priority?.name} />,
    getter: 'priority.name',
  },
  {
    key: 'status',
    label: 'Status',
    content: t => <Status name={t.status?.name} />,
    getter: 'status.name',
  },
  {
    key: 'projectTaskCategory',
    label: 'Category',
    content: t => <Category name={t.projectTaskCategory?.name} />,
    getter: 'projectTaskCategory.name',
  },
  {
    key: 'managedByContact',
    label: 'Managed by',
    content: t => t.managedByContact?.simpleFullName,
    getter: 'managedByContact.simpleFullName',
  },
  {
    key: 'assignment',
    label: 'Assigned to',
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
    label: 'Updated',
    content: t => formatDate(t?.updatedOn!),
    getter: 'updatedOn',
  },
];

export const relatedColumns: Column<Cloned<TicketLink>>[] = [
  {
    key: 'projectTaskLinkType',
    label: 'Link type',
    content: l => <p className="font-medium">{l.projectTaskLinkType?.name}</p>,
    getter: 'projectTaskLinkType.name',
    mobile: true,
    required: true,
  },
  {
    key: 'id',
    label: 'Ticket ID',
    content: ({relatedTask: t}) => <p className="font-medium">#{t?.id}</p>,
    getter: 'relatedTask.id',
  },
  {
    key: 'name',
    label: 'Subject',
    content: ({relatedTask: t}) => (
      <div className="max-w-40 line-clamp-2">{t?.name}</div>
    ),
    getter: 'relatedTask.name',
    mobile: true,
    required: true,
  },
  {
    key: 'priority',
    label: 'Priority',
    content: ({relatedTask: t}) => <Priority name={t?.priority?.name} />,
    getter: 'relatedTask.priority.name',
  },
  {
    key: 'status',
    label: 'Status',
    content: ({relatedTask: t}) => <Status name={t?.status?.name} />,
    getter: 'relatedTask.status.name',
  },
  {
    key: 'managedByContact',
    label: 'Managed by',
    content: ({relatedTask: t}) => t?.managedByContact?.simpleFullName,
    getter: 'relatedTask.managedByContact.simpleFullName',
  },
  {
    key: 'assignment',
    label: 'Assigned to',
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
    label: 'Updated',
    content: ({relatedTask: t}) => formatDate(t?.updatedOn!),
    getter: 'relatedTask.updatedOn',
  },
];
