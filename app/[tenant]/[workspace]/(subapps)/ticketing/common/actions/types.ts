import {MUTATE_TYPE} from '../constants';
import type {CreateTicketInfo, UpdateTicketInfo} from '../utils/validators';

export type MutateProps = {
  workspaceURL: string;
  workspaceURI: string;
  action:
    | {
        type: typeof MUTATE_TYPE.CREATE;
        data: CreateTicketInfo;
      }
    | {
        type: typeof MUTATE_TYPE.UPDATE;
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
