import type {ID} from '@/types';

export function getFileSizeText(fileSize: number) {
  if (!fileSize) return '';

  if (fileSize > 1000000000)
    return (fileSize / 1000000000.0).toFixed(2) + ' GB';

  if (fileSize > 1000000) return (fileSize / 1000000.0).toFixed(2) + ' MB';

  if (fileSize >= 1000) return (fileSize / 1000.0).toFixed(2) + ' KB';

  return fileSize + ' B';
}

export function parseFormData(formData: FormData) {
  const values: any = [];

  for (const [key, value] of formData.entries()) {
    const index = Number(key.match(/\[(\d+)\]/)?.[1]);

    if (Number.isNaN(index)) {
      continue;
    }

    if (!values[index]) {
      values[index] = {};
    }

    const field = key.substring(key.lastIndexOf('[') + 1, key.lastIndexOf(']'));

    values[index][field] = value instanceof File ? value : value.toString();
  }

  return values;
}

export function getImageURL(
  id: ID,
  tenant: string,
  options?: {noimage?: boolean},
) {
  if (!(id && tenant)) {
    return options?.noimage ? '/images/no-image.png' : '';
  }

  return `${process.env.NEXT_PUBLIC_HOST}/api/tenant/${tenant}/download/image/${id}`;
}

export function getDownloadURL(id: ID, tenantId: string) {
  if (!(id && tenantId)) return '';

  return `${process.env.NEXT_PUBLIC_HOST}/api/tenant/${tenantId}/download/${id}`;
}
