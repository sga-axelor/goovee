export function getImageURL(id?: string | number) {
  if (!id) {
    return '';
  }

  return `${process.env.NEXT_PUBLIC_HOST}/api/image/${id}`;
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
