import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';
import {getSession} from '@/orm/auth';
import {workspacePathname} from '@/utils/workspace';
import {findWorkspace} from '@/orm/workspace';

// ---- LOCAL IMPORTS ---- //
import Content from '@/subapps/events/[id]/register/content';
import {findEventByID} from '@/subapps/events/common/orm/event';
import {findModelFields} from '@/subapps/events/common/orm/meta-json-field';
import {
  PORTAL_PARTICIPANT_MODEL,
  CONTACT_ATTRS,
} from '@/subapps/events/common/constants';
import {findUser} from '@/subapps/events/common/orm/partner';

export default async function Page({
  params,
}: {
  params: {id: string; tenant: string; workspace: string};
}) {
  const {id, tenant} = params;

  const session = await getSession();

  const {workspaceURL} = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
    tenantId: tenant,
  }).then(clone);

  const eventDetails = await findEventByID({
    id,
    workspace,
    tenantId: tenant,
  }).then(clone);

  if (!eventDetails) {
    return notFound();
  }
  const metaFields = await findModelFields({
    modelName: PORTAL_PARTICIPANT_MODEL,
    modelField: CONTACT_ATTRS,
    tenantId: tenant,
  }).then(clone);

  const user = await findUser({userId, workspaceURL: workspace.url}).then(
    clone,
  );

  return (
    <>
      <Content
        eventDetails={eventDetails}
        metaFields={metaFields}
        workspace={workspace}
        user={user}
      />
    </>
  );
}
