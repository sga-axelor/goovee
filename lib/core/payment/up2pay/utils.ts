import {UP2PAY_ENCODE_MAP, UP2PAY_ENCODE_REGEX} from './constants';

export function formatAmountForUp2pay(amount: string | number): string {
  return Math.round(Number(amount) * 100).toString();
}

export function join(params: object, encode: boolean = true) {
  return Object.entries(params)
    .map(([key, value]) => {
      return `${key}=${!encode ? value : encodeURIComponent(value)}`;
    })
    .join('&');
}

export function hasKeys(obj: Record<string, any>, keys: string[]): boolean {
  return keys.every(key => obj.hasOwnProperty(key));
}

export function clearUp2payParams(
  searchParams: URLSearchParams,
  params: readonly string[],
): string {
  const clean = new URLSearchParams(searchParams.toString());
  for (const key of params) {
    clean.delete(key);
  }
  return clean.toString();
}

export function up2payEncode(value: string): string {
  return value.replace(UP2PAY_ENCODE_REGEX, char => UP2PAY_ENCODE_MAP[char]);
}

// Reconstruct the message Up2Pay signed from the callback URLSearchParams.
// URLSearchParams decodes the transport encoding (+→space, %7C→|, etc.) back
// to literal values, then up2payEncode applies Up2Pay's own encoding rules.
export function buildSignatureMessage(params: URLSearchParams): string {
  return [...params.entries()]
    .filter(([key]) => key !== 'sign')
    .map(([key, value]) => `${key}=${up2payEncode(value)}`)
    .join('&');
}
