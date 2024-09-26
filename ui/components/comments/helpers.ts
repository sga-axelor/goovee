export function download(record: any, isMeta: boolean = false) {
  if (!record) return null;

  const html =
    record.contentType === 'html' || record?.metaFile?.fileType === 'text/html';

  const link = document.createElement('a');
  const name = record.fileName;

  link.innerHTML = name || 'File';
  link.download = name || 'download';
  link.href = html
    ? getHTMLURL(record)
    : getDownloadURL({id: record.id, isMeta});

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

export function getDownloadURL({
  id,
  isMeta = false,
}: {
  id: string;
  isMeta?: boolean;
}) {
  const metaParam = isMeta ? '?meta=true' : '';
  return `${process.env.NEXT_PUBLIC_HOST}/api/download/${id}${metaParam}`;
}
