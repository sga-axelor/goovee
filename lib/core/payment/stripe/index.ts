import 'server-only';

import {experimental_taintUniqueValue} from 'react';
import Stripe from 'stripe';

const secret = process.env.STRIPE_CLIENT_SECRET;

if (secret) {
  experimental_taintUniqueValue(
    'Stripe secret key is a server secret. Do not pass to Client Components.',
    process,
    secret,
  );
}

export const stripe = new Stripe(secret as string);
