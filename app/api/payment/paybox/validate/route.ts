export const dynamic = 'force-dynamic';

import {NextResponse} from 'next/server';
import {readPEMFile, verifySignature} from '@/payment/paybox/crypto';
import {getParamsWithoutSign} from '@/payment/paybox/utils';
import { PAYBOX_ERRORS } from '@/payment/paybox/constant';

export async function GET(request: Request) {
  const parsed = new URL(request.url);
  const params = new URLSearchParams(parsed.search);

  const message = getParamsWithoutSign(parsed.search);

  const pem = readPEMFile();

  const sign = params.get('sign');

  const error = params.get('error');

  if (!(pem && message && sign)) {
    return new NextResponse('Bad Request', {status: 400});
  }

  if (!verifySignature(message, sign, pem)) {
    return new NextResponse('Bad Request', {status: 400});
  }

  if (error !== PAYBOX_ERRORS.CODE_ERROR_OPERATION_SUCCESSFUL) {
    return new NextResponse('Bad Request', {status: 400});
  }

  return new NextResponse('OK', {status: 200});
}
