import {z} from 'zod';
import {PAYMENT_SOURCE} from './type';

export const PaymentSourceSchema = z.enum(PAYMENT_SOURCE);

export type PaymentSource = z.infer<typeof PaymentSourceSchema>;
