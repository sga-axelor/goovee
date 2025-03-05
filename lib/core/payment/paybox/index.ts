import {DEFAULT_CURRENCY_CODE} from '@/constants';
import {encodeFilter as encode} from '@/utils/url';
import {formatAmountForPaybox, hasKeys, join} from './utils';
import {createHMAC} from './crypto';

const CurrencyCode: Record<string, number> = {
  EUR: 978,
};

const DefaultCurrencyCode = CurrencyCode[DEFAULT_CURRENCY_CODE];

export function getPaymentURL({
  amount,
  email,
  contextId,
  currency,
  url,
}: {
  amount: string | number;
  email: string;
  contextId: string;
  currency: string;
  url: {
    success: string;
    failure: string;
  };
}) {
  const payload: any = {
    PBX_RANG: process.env.PBX_RANG,
    PBX_IDENTIFIANT: process.env.PBX_IDENTIFIANT,
    PBX_SITE: process.env.PBX_SITE,
    PBX_PAYBOX: process.env.PBX_PAYBOX,
    PBX_BACKUP1: process.env.PBX_BACKUP1,
    PBX_BACKUP2: process.env.PBX_BACKUP2,
    PBX_DEVISE: CurrencyCode[currency] || DefaultCurrencyCode,
    PBX_TOTAL: formatAmountForPaybox(amount),
    PBX_PORTEUR: email,
    PBX_CMD: encode({context_id: contextId, amount}),
    PBX_HASH: 'Sha512',
    PBX_EFFECTUE: url?.success,
    PBX_ATTENTE: url?.success,
    PBX_REFUSE: url?.failure,
    PBX_ANNULE: url?.failure,
    PBX_REPONDRE_A: `${process.env.NEXT_PUBLIC_HOST}/api/payment/paybox/validate`,
    PBX_RETOUR: 'reference:R;error:E;transaction:S;sign:K',
    PBX_TIME: new Date().toISOString(),
  };

  const hmac = createHMAC(join(payload, false), process.env.PBX_SECRET!);

  if (!hmac) {
    throw new Error('Error processing request');
  }

  if (
    !hasKeys(payload, [
      'PBX_RANG',
      'PBX_IDENTIFIANT',
      'PBX_SITE',
      'PBX_PAYBOX',
      'PBX_TOTAL',
      'PBX_PORTEUR',
      'PBX_CMD',
      'PBX_EFFECTUE',
      'PBX_ATTENTE',
      'PBX_REFUSE',
      'PBX_ANNULE',
      'PBX_REPONDRE_A',
    ])
  ) {
    throw new Error('Invalid configuration');
  }

  const paymentURL = `${payload.PBX_PAYBOX}?${join(payload)}&PBX_HMAC=${hmac}`;

  return paymentURL;
}
