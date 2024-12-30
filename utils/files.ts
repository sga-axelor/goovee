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

type DownloadOptions = {
  isMeta?: boolean;
};

export function download(
  record: any,
  tenantId: string,
  options: DownloadOptions = {},
) {
  if (!(record && tenantId)) return null;

  const html =
    record.contentType === 'html' || record?.metaFile?.fileType === 'text/html';

  const link = document.createElement('a');
  const name = record.fileName;

  link.innerHTML = name || 'File';
  link.download = name || 'download';
  link.href = html
    ? getHTMLURL(record)
    : getDownloadURL(record?.id, tenantId, options);

  Object.assign(link.style, {
    position: 'absolute',
    display: 'none',
    zIndex: 1000000000,
  });

  document.body.appendChild(link);

  link.onclick = e => {
    setTimeout(() => {
      if (e.target) {
        document.body.removeChild(e.target as any);
      }
    }, 300);
  };

  setTimeout(() => link.click(), 100);
}

export function getHTMLURL(record: any) {
  const dynamicContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated HTML Page</title>
  </head>
  <body>
    <main>
      ${record.content}
    </main>
  </body>
  </html>
`;

  const blob = new Blob([dynamicContent], {type: 'text/html'});
  const url = URL.createObjectURL(blob);

  return url;
}

export function getImageURL(
  id: ID | undefined,
  tenant: string,
  options: {noimage?: boolean; noimageSrc?: string} = {},
) {
  const {noimage, noimageSrc} = options;

  if (!(id && tenant)) {
    return noimage ? noimageSrc || '/images/no-image.png' : '';
  }

  return `${process.env.NEXT_PUBLIC_HOST}/api/tenant/${tenant}/download/image/${id}`;
}

export function getDownloadURL(
  id?: ID,
  tenantId?: string,
  options: DownloadOptions & {noimage?: boolean; noimageSrc?: string} = {},
) {
  const {noimage, noimageSrc} = options;

  if (!(id && tenantId)) {
    return noimage ? noimageSrc || '/images/no-image.png' : '';
  }

  let query = '';

  const {isMeta} = options;

  if (isMeta) {
    query += 'meta=true';
  }

  return `${process.env.NEXT_PUBLIC_HOST}/api/tenant/${tenantId}/download/${id}${query ? `?${query}` : ''}`;
}

export function getFileTypeIcon(fileType: string) {
  if (fileType === null || fileType === undefined) {
    return 'md-Web';
  }

  switch (fileType) {
    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    case 'application/vnd.oasis.opendocument.text':
      return 'bs-FileEarmarkWordFill';
    case 'application/vnd.ms-excel':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    case 'application/vnd.oasis.opendocument.spreadsheet':
      return 'bs-FileEarmarkExcelFill';
    case 'application/vnd.ms-powerpoint':
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    case 'application/vnd.oasis.opendocument.presentation':
      return 'bs-FileEarmarkPptFill';
    case 'application/pdf':
      return 'bs-FileEarmarkPdfFill';
    case 'application/zip':
    case 'application/gzip':
      return 'bs-FileEarmarkZipFill';
    default:
      if (fileType.startsWith('text')) return 'bs-FileEarmarkTextFill';
      if (fileType.startsWith('image')) return 'bs-FileEarmarkImageFill';
      if (fileType.startsWith('video')) return 'bs-FileEarmarkPlayFill';
      return 'md-Web';
  }
}

const iconColors: any = {
  'bs-FileEarmarkWordFill': '#0d47a1',
  'bs-FileEarmarkExcelFill': '#2e7d32',
  'bs-FileEarmarkPptFill': '#b93419',
  'bs-FileEarmarkPdfFill': '#ff5722',
};

export function getIconColor(icon: string) {
  return iconColors[icon];
}
