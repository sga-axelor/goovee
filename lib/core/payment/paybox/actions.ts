import {DEFAULT_CURRENCY_CODE} from '@/constants';
import {decodeFilter as decode} from '@/utils/url';
import {getPaymentURL} from '.';
import {getParamsWithoutSign} from './utils';
import {readPEMFile, verifySignature} from './crypto';
import {PAYBOX_ERRORS} from './constant';

export async function createPayboxOrder({
  amount,
  email,
  currency = DEFAULT_CURRENCY_CODE,
  context,
  url,
}: {
  amount: string | number;
  email: string;
  currency: string;
  context: any;
  url: {
    success: string;
    failure: string;
  };
}) {
  if (!(amount && currency && email)) {
    throw new Error('Amount, currency and email is required');
  }

  return {
    url: getPaymentURL({
      amount,
      email,
      context,
      currency,
      url,
    }),
  };
}

export async function findPayboxOrder(data: any) {
  if (!data) {
    throw new Error('Cannot find paybox order');
  }

  const message = getParamsWithoutSign(data);

  const pem = readPEMFile();

  const sign = data.sign;

  const error = data.error;

  if (!(pem && message && sign)) {
    throw new Error('Bad request');
  }

  if (!verifySignature(message, sign, pem)) {
    throw new Error('Bad request');
  }

  if (error !== PAYBOX_ERRORS.CODE_ERROR_OPERATION_SUCCESSFUL) {
    throw new Error('Bad request');
  }

  return decode(data.reference);
}
