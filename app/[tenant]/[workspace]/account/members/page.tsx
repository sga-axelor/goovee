import {workspacePathname} from '@/utils/workspace';
import {findAvailableSubapps, findMembers} from '../common/orm/members';
import Content from './content';
import {findInvites} from '../common/orm/invites';
import {getSession} from '@/lib/core/auth';

export default async function Page({
  params,
}: {
  params: {workspace: string; tenant: string};
}) {
  const {tenant, workspaceURL} = workspacePathname(params);

  const session = await getSession();

  const user = session?.user!;

  const partnerId = (user?.isContact ? user.mainPartnerId : user.id)!;

  const members: any = await findMembers({
    workspaceURL,
    tenantId: tenant,
    partnerId,
  });

  const invites = await findInvites({
    workspaceURL,
    tenantId: tenant,
    partnerId,
  });

  const availableApps = await findAvailableSubapps({
    url: workspaceURL,
    tenantId: tenant,
  });

  const $members = [...members?.partners, ...members?.contacts];

  return (
    <div className="bg-white p-2 lg:p-0 lg:bg-inherit">
      <Content
        members={$members}
        invites={invites}
        availableApps={availableApps || []}
      />
    </div>
  );
}
