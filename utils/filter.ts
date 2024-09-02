import {Maybe} from '@/types/util';
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string';

export function encodeFilter(obj: Record<string, any>): string {
  try {
    const stringify = JSON.stringify(obj);
    return compressToEncodedURIComponent(stringify);
  } catch (e) {
    console.error(e);
    return '';
  }
}
export function decodeFilter(base64: Maybe<string>): unknown {
  if (!base64) return;
  try {
    const stringify = decompressFromEncodedURIComponent(base64);
    return JSON.parse(stringify);
  } catch (e) {
    console.error(e);
    return;
  }
}
