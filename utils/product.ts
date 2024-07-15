export function getImageURL(id?: string | number) {
  if (!id) {
    return undefined;
  }

  return `${process.env.NEXT_PUBLIC_HOST}/api/download/${id}?meta=true`;
}
