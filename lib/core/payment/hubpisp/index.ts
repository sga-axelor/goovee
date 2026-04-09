import {
  getPispAccessToken,
  generateDigest,
  buildPispHeaders,
  pispFetch,
} from './crypto';
import {
  generateRequestId,
  getDateHeader,
  buildRequestTarget,
  buildParisISOString,
} from './utils';
import {
  HUBPISP_DEFAULT_EXPIRE_IN,
  HUBPISP_CONSENT_STATUS,
  PAYMENT_LINK_PATH,
} from './constants';
import type {
  CreatePaymentLinkParams,
  CreatePaymentLinkResult,
  GetPaymentLinkStatusResult,
  PaymentLinkStatusResult,
} from './types';

export async function createPaymentLink(
  params: CreatePaymentLinkParams,
): Promise<CreatePaymentLinkResult> {
  console.log('[HUBPISP][CREATE_LINK] Called', {
    currency: params.currency,
    amount: params.amount,
    localInstrument: params.localInstrument,
    endToEnd: params.endToEnd,
    remittanceInformation: params.remittanceInformation,
    expireIn: params.expireIn,
    requestedExecutionDate: params.requestedExecutionDate,
  });

  const {
    currency,
    amount,
    expireIn,
    requestedExecutionDate: rawExecutionDate,
    localInstrument,
    endToEnd,
    remittanceInformation,
    successfulReportUrl,
    unsuccessfulReportUrl,
    psuInfo,
    pageConsentInfo: pci,
  } = params;

  const baseUrl = process.env.HUBPISP_API_URL;
  const keyId = process.env.HUBPISP_CERT_FINGERPRINT;
  const beneficiaryName = process.env.HUBPISP_BENEFICIARY_NAME;
  const iban = process.env.HUBPISP_IBAN;
  const bicFi = process.env.HUBPISP_BIC;

  if (!(baseUrl && keyId && beneficiaryName && iban)) {
    console.error('[HUBPISP][CREATE_LINK] Missing env config', {
      hasBaseUrl: !!baseUrl,
      hasKeyId: !!keyId,
      hasBeneficiaryName: !!beneficiaryName,
      hasIban: !!iban,
    });
    throw new Error('HUB PISP is not configured');
  }

  console.log('[HUBPISP][CREATE_LINK] Env config OK', {
    baseUrl,
    keyId,
    bicFi: bicFi ?? 'not set',
  });

  if (!currency || currency !== 'EUR') {
    throw new Error(
      `HUB PISP only supports EUR payments (got: ${currency ?? 'none'})`,
    );
  }

  console.log('[HUBPISP][CREATE_LINK] Fetching access token');
  const token = await getPispAccessToken();
  console.log('[HUBPISP][CREATE_LINK] Access token obtained');

  const requestedExecutionDate =
    rawExecutionDate ?? buildParisISOString(Date.now() + 15_000);
  console.log(
    '[HUBPISP][CREATE_LINK] requestedExecutionDate',
    requestedExecutionDate,
  );

  const body = {
    amount,
    currency,
    beneficiary: {
      creditor: {name: beneficiaryName},
      creditorAccount: {iban},
      creditorAgent: bicFi ? {bic: bicFi} : undefined,
    },
    requestedExecutionDate,
    consentInfo: {
      expireIn: expireIn ?? HUBPISP_DEFAULT_EXPIRE_IN,
      unit: 'SECONDS',
    },
    localInstrument,
    endToEnd: endToEnd?.slice(0, 35),
    remittanceInformation: remittanceInformation?.slice(0, 100),
    successfulReportUrl,
    unsuccessfulReportUrl,
    psuInfo,
    pageConsentInfo: pci
      ? {
          pageTimeout: pci.pageTimeout ?? undefined,
          pageTimeoutUnit: pci.pageTimeoutUnit,
          pageUserTimeout: pci.pageUserTimeout ?? undefined,
          pageUserTimeoutUnit: pci.pageUserTimeoutUnit,
          pageTimeOutReturnURL: pci.pageTimeOutReturnURL,
        }
      : undefined,
  };

  const bodyString = JSON.stringify(body);
  console.log('[HUBPISP][CREATE_LINK] Body built', JSON.parse(bodyString));

  const digest = generateDigest(bodyString);
  const date = getDateHeader();
  const xRequestId = generateRequestId();
  const requestTarget = buildRequestTarget('post', PAYMENT_LINK_PATH);
  console.log('[HUBPISP][CREATE_LINK] Signing params', {
    digest,
    date,
    xRequestId,
    requestTarget,
  });

  const headers = buildPispHeaders({
    token,
    keyId,
    requestTarget,
    digest,
    date,
    xRequestId,
  });
  console.log('[HUBPISP][CREATE_LINK] Headers built', headers);

  const url = `${baseUrl}${PAYMENT_LINK_PATH}`;
  console.log('[HUBPISP][CREATE_LINK] Sending request', {url, method: 'POST'});

  const response = await pispFetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json', ...headers},
    body: bodyString,
  });
  console.log('[HUBPISP][CREATE_LINK] Response received', {
    status: response.status,
    ok: response.ok,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('[HUBPISP][CREATE_LINK] Request failed', {
      status: response.status,
      body: errorBody,
    });
    throw new Error(
      `HUB PISP create payment link failed (${response.status}): ${errorBody}`,
    );
  }

  const data = await response.json();
  console.log('[HUBPISP][CREATE_LINK] Response data', data);

  const result = {
    resourceId: data.resourceId,
    consentHref: data._links?.consent?.href,
  };
  console.log('[HUBPISP][CREATE_LINK] Returning', result);

  return result;
}

export async function fetchPaymentLinkStatus(
  resourceId: string,
): Promise<PaymentLinkStatusResult> {
  const baseUrl = process.env.HUBPISP_API_URL;
  const keyId = process.env.HUBPISP_CERT_FINGERPRINT;

  if (!(baseUrl && keyId)) {
    console.error('[HUBPISP][LINK_STATUS] Missing env config', {
      hasBaseUrl: !!baseUrl,
      hasKeyId: !!keyId,
    });
    throw new Error('HUB PISP is not configured');
  }

  const token = await getPispAccessToken();

  const path = `${PAYMENT_LINK_PATH}/${resourceId}`;
  const bodyString = '';
  const digest = generateDigest(bodyString);
  const date = getDateHeader();
  const xRequestId = generateRequestId();
  const requestTarget = buildRequestTarget('get', path);

  const headers = buildPispHeaders({
    token,
    keyId,
    requestTarget,
    digest,
    date,
    xRequestId,
  });

  const response = await pispFetch(`${baseUrl}${path}`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('[HUBPISP][LINK_STATUS] Request failed', {
      resourceId,
      status: response.status,
      body: errorBody,
    });
    throw new Error(
      `HUB PISP fetch payment link status failed (${response.status}): ${errorBody}`,
    );
  }

  const data = await response.json();
  return data as PaymentLinkStatusResult;
}

/**
 * Fetches the payment link status and returns a discriminated union
 * based on consentStatus: 'PROCESSED' | 'EXPIRED' | 'PENDING' | 'EXECUTED'.
 */
export async function getPaymentLinkStatus(
  resourceId: string,
): Promise<GetPaymentLinkStatusResult> {
  const data = await fetchPaymentLinkStatus(resourceId);
  const consentStatus = data.consentStatus;

  if (consentStatus === HUBPISP_CONSENT_STATUS.EXPIRED) {
    console.warn('[HUBPISP][SYNC_LINK] Payment link is EXPIRED', {resourceId});
    return {consentStatus: HUBPISP_CONSENT_STATUS.EXPIRED};
  }

  if (consentStatus === HUBPISP_CONSENT_STATUS.PROCESSED) {
    return {consentStatus: HUBPISP_CONSENT_STATUS.PROCESSED, data};
  }

  return {consentStatus};
}
