import {type Tenant} from '@/tenant';
import {Maybe} from '@/types/util';
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string';

export function extractWorkspace(pathname: string) {
  if (!pathname) return {};

  const regex = /\/(.+)\/(.+)\//gm;
  const [match = []] = [...pathname.matchAll(regex)];
  const [_pathname, tenant, workspace] = match;

  return {
    pathname,
    tenant,
    workspace,
  };
}

export function encodeFilter<T extends Maybe<Record<string, any>> = any>(
  obj: T,
): string {
  if (!obj) return '';
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

export function getLoginURL(params: {
  callbackurl?: string;
  workspaceURI?: string;
  tenant?: Tenant['id'] | number | null;
}) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(
    ([key, value]) => key && value && sp.append(key, String(value)),
  );

  return `/auth/login?${sp.toString()}`;
}
