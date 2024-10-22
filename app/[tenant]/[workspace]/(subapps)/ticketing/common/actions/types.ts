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

export type ActionConfig = {
  force?: boolean;
};

export type SuccessResponse<T = any> = {
  success: true;
  data: T;
  message?: never;
  error?: never;
};
export type ErrorResponse = {
  error: true;
  data?: never;
  message: string;
  success?: never;
};

export type ActionResponse<T = any> = Promise<
  ErrorResponse | SuccessResponse<T>
>;
