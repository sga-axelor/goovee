export type Column = {
  key: string;
  label: string;
  orderBy?: (dir: 'ASC' | 'DESC') => Record<string, any>;
};

export type Ticket = {
  id: string;
  version: number;
  name?: string;
  ticketNumber?: string;
  updatedOn?: Date;
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
