export function getImageURL(id?: string | number) {
  if (!id) {
    return '';
  }
  return `${process.env.NEXT_PUBLIC_HOST}/api/image/${id}`;
}
