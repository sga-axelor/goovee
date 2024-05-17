export function extractWorkspace(pathname: string) {
  if (!pathname) return {};

  const regex = /\/(.+)\/(.+)\//gm;
  const [match = []] = [...pathname.matchAll(regex)];
  const [_pathname, tenant, workspace] = match;

  return {
    pathname,
    tenant,
    workspace,
  };
}
