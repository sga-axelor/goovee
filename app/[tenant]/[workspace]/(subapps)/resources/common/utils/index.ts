export function getFilename(disposition: string | null) {
  if (disposition === null) return null;
  var results = /filename\*=UTF-8''(.*)/i.exec(disposition);
  if (results) {
    return decodeURIComponent(results[1]);
  }
  results = /filename=(.*)/i.exec(disposition);
  if (results) {
    // remove trailing double quote
    return results[1].replace(/^"(.+(?="$))"$/, '$1');
  }
  return null;
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

export function getDownloadURL(record: any) {
  return `${process.env.NEXT_PUBLIC_HOST}/api/download/${record.id}`;
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

export function download(record: any) {
  if (!record) return null;

  const html =
    record.contentType === 'html' || record?.metaFile?.fileType === 'text/html';

  const link = document.createElement('a');
  const name = record.fileName;

  link.innerHTML = name || 'File';
  link.download = name || 'download';
  link.href = html ? getHTMLURL(record) : getDownloadURL(record);

  Object.assign(link.style, {
    position: 'absolute',
    visibility: 'hidden',
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
