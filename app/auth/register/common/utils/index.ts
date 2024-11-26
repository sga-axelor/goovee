import {getSession} from '@/auth';
import {clone} from '@/utils';
import {findWorkspaces} from '@/orm/workspace';

export function extractSearchParams({
  searchParams,
}: {
  searchParams: {
    workspaceURI?: string;
    tenant?: string;
  };
}) {
  const workspaceURI =
    searchParams?.workspaceURI && decodeURIComponent(searchParams.workspaceURI);

  const tenantId =
    searchParams?.tenant && decodeURIComponent(searchParams.tenant);

  const workspaceURL = `${process.env.NEXT_PUBLIC_HOST}${workspaceURI}`;

  return {
    workspaceURI,
    tenantId,
    workspaceURL,
  };
}

export async function isExistingUser({
  workspaceURL,
  tenantId,
}: {
  workspaceURL: string;
  tenantId: string;
}) {
  const session = await getSession();
  const user = session?.user;

  let userWorkspaces = [];
  if (user) {
    userWorkspaces = await findWorkspaces({
      url: workspaceURL,
      user,
      tenantId,
    }).then(clone);
  }

  const existing = userWorkspaces.some((w: any) => w.url === workspaceURL);

  return existing;
}

async function isRegistrationEnabled() {}
