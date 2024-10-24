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