import {workspacePathname} from '@/utils/workspace';
import {findAvailableSubapps, findMembers} from '../common/orm/members';
import Content from './content';
import {findInvites} from '../common/orm/invites';

export default async function Page({
  params,
}: {
  params: {workspace: string; tenant: string};
}) {
  const {tenant, workspaceURL} = workspacePathname(params);

  const members = await findMembers({
    workspaceURL,
    tenantId: tenant,
  });

  const invites = await findInvites({
    workspaceURL,
    tenantId: tenant,
  });

  const availableApps = await findAvailableSubapps({
    url: workspaceURL,
    tenantId: tenant,
  });

  return (
    <Content
      members={members}
      invites={invites}
      availableApps={availableApps || []}
    />
  );
}
