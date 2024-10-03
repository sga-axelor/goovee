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

export type SuccessResponse<T = any> = {error: false; data: T; message?: never};
export type ErrorResponse = {error: true; data?: never; message: string};

export type ActionResponse<T = any> = Promise<
  ErrorResponse | SuccessResponse<T>
>;
