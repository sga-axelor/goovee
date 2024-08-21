export function getFileSizeText(fileSize: number) {
  if (!fileSize) return '';

  if (fileSize > 1000000000)
    return (fileSize / 1000000000.0).toFixed(2) + ' GB';

  if (fileSize > 1000000) return (fileSize / 1000000.0).toFixed(2) + ' MB';

  if (fileSize >= 1000) return (fileSize / 1000.0).toFixed(2) + ' KB';

  return fileSize + ' B';
}
