export type Column<T extends string = string> = {
  key: T | (string & {});
  label: string;
};
export type FilterKey = 'priority' | 'requestedBy' | 'status' | 'updatedOn';
export type SortKey =
  | 'ticketId'
  | 'requestedBy'
  | 'subject'
  | 'priority'
  | 'status'
  | 'category'
  | 'assignedTo'
  | 'updatedOn';
