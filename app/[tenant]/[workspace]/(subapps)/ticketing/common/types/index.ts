export type Column<T extends string = string> = {
  key: T | (string & {});
  label: string;
};

export type Ticket = {
  id: string;
  version: number;
  name?: string;
  updatedOn?: Date;
  assignment: number;
  assignedToContact?: {
    id: string;
    name: string;
    version: number;
  };
  requestedByContact?: {
    id: string;
    name: string;
    version: number;
  };
  priority?: {
    id: string;
    name: string;
    version: number;
  };
  status?: {
    id: string;
    name: string;
    version: number;
  };
  projectTaskCategory?: {
    id: string;
    name: string;
    version: number;
  };
  assignedTo?: {
    id: string;
    name: string;
    version: number;
  };
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
