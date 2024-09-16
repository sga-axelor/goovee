import {CreateTicketInfo, UpdateTicketInfo} from '../ui/components/ticket-form';

export type MutateProps = {
  workspaceURL: string;
  workspaceURI: string;
  action:
    | {
        type: 'create';
        data: CreateTicketInfo;
      }
    | {
        type: 'update';
        data: UpdateTicketInfo;
      };
};

export type ActionResponse = Promise<
  | {error: true; message: string; data?: never}
  | {error: false; data: any; message?: never}
>;
