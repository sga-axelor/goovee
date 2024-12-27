import {workspacePathname} from '@/utils/workspace';

// ---- LOCAL IMPORTS ---- //
import {findAvailableSubapps} from '../../common/orm/members';
import Form from './form';

export default async function Page({
  params,
}: {
  params: {workspace: string; tenant: string};
}) {
  const {tenant, workspaceURL} = workspacePathname(params);

  const availableApps = await findAvailableSubapps({
    url: workspaceURL,
    tenantId: tenant,
  });

  return (
    <div className="p-2 lg:p-0">
      <Form availableApps={availableApps || []} />
    </div>
  );
}
