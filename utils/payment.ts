import {PaymentOption} from '@/types';

export const isPaymentOptionAvailable = (
  paymentOptions: any[] = [],
  type: PaymentOption,
) => paymentOptions.some((option: any) => option?.typeSelect === type);
