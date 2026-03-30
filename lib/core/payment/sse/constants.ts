export const PAYMENT_UPDATE_STATUS = {
  SUCCESS: 'success',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  PARTIAL: 'partial',
} as const;

export type PaymentUpdateStatus =
  (typeof PAYMENT_UPDATE_STATUS)[keyof typeof PAYMENT_UPDATE_STATUS];
