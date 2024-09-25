import {CreateTicketInfo, UpdateTicketInfo} from '../schema';

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

export type ActionResponse<T = any> = Promise<
  | {error: true; message: string; data?: never}
  | {error: false; data: T; message?: never}
>;
