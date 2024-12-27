export function getOrderBy(sort: string): Record<string, any> {
  const orderByMap: Record<string, any> = {
    'a-z': {title: 'ASC'},
    'z-a': {title: 'DESC'},
    newest: {createdOn: 'DESC'},
    oldest: {createdOn: 'ASC'},
  };
  return orderByMap[sort] || orderByMap['a-z'];
}
