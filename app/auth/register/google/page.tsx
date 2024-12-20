export const dynamic = 'force-dynamic';

import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {findWorkspaces} from '@/orm/workspace';
import {clone} from '@/utils';
import {ALLOW_ALL_REGISTRATION, ALLOW_AOS_ONLY_REGISTRATION} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import Form from './form';
import {extractSearchParams, isExistingUser} from '../common/utils';
import {UserExists} from '../common/ui/components';

export default async function Page({
  searchParams,
}: {
  searchParams: {
    workspaceURI?: string;
    tenant: string;
  };
}) {
  const {workspaceURI, tenantId, workspaceURL} = extractSearchParams({
    searchParams,
  });

  if (!(workspaceURI && tenantId)) {
    return notFound();
  }

  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return notFound();
  }

  const existing = await isExistingUser({workspaceURL, tenantId});

  if (existing) {
    return <UserExists workspaceURL={workspaceURL} />;
  }

  const workspaces = await findWorkspaces({url: workspaceURL, tenantId}).then(
    clone,
  );

  const workspace = workspaces.find((w: any) => w.url === workspaceURL);

  const canRegister = [
    ALLOW_ALL_REGISTRATION,
    ALLOW_AOS_ONLY_REGISTRATION,
  ].includes(workspace?.allowRegistrationSelect);

  if (!canRegister) {
    return notFound();
  }

  return <Form workspace={workspace} />;
}
