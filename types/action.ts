export type SuccessResponse<T = unknown> = {
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

export type ActionResponse<T = unknown> = Promise<
  ErrorResponse | SuccessResponse<T>
>;
