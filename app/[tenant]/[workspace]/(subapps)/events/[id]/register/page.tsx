import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';
import {getSession} from '@/auth';
import {workspacePathname} from '@/utils/workspace';
import {findWorkspace} from '@/orm/workspace';
import {findPartnerByEmail} from '@/orm/partner';

// ---- LOCAL IMPORTS ---- //
import Content from '@/subapps/events/[id]/register/content';
import {findEventByID} from '@/subapps/events/common/orm/event';
import {findModelFields} from '@/orm/model-fields';
import {
  PORTAL_PARTICIPANT_MODEL,
  CONTACT_ATTRS,
} from '@/subapps/events/common/constants';

export default async function Page({
  params,
}: {
  params: {id: string; tenant: string; workspace: string};
}) {
  const {id, tenant} = params;

  const session = await getSession();
  const user: any = session?.user;

  const {workspaceURL} = workspacePathname(params);

  const workspace: any = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
    tenantId: tenant,
  }).then(clone);

  if (!workspace) {
    return notFound();
  }

  const eventDetails = await findEventByID({
    id,
    workspace,
    tenantId: tenant,
    user,
  }).then(clone);

  if (!eventDetails) {
    return notFound();
  }
  const metaFields = await findModelFields({
    modelName: PORTAL_PARTICIPANT_MODEL,
    modelField: CONTACT_ATTRS,
    tenantId: tenant,
  }).then(clone);

  const partner = user
    ? await findPartnerByEmail(user.email, tenant).then(clone)
    : {};

  return (
    <>
      <Content
        eventDetails={eventDetails}
        metaFields={metaFields}
        workspace={workspace}
        user={partner}
      />
    </>
  );
}
