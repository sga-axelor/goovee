import type {ID} from '@/types';

export function getImageURL(id: ID, tenantId: string) {
  if (!(id && tenantId)) {
    return undefined;
  }

  return `${process.env.NEXT_PUBLIC_HOST}/api/tenant/${tenantId}/download/${id}?meta=true`;
}
