import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {findGooveeUserByEmail} from '@/orm/partner';
import {findWorkspace} from '@/orm/workspace';
import {clone} from '@/utils';
import {workspacePathname} from '@/utils/workspace';

// ---- LOCAL IMPORTS ---- //
import Content from '@/app/[tenant]/[workspace]/(subapps)/events/[slug]/register/content';
import {findModelFields} from '@/orm/model-fields';
import {
  CONTACT_ATTRS,
  PORTAL_PARTICIPANT_MODEL,
} from '@/subapps/events/common/constants';
import {findEvent} from '@/subapps/events/common/orm/event';
import {
  hasRegistrationEnded,
  isLoginNeededForRegistration,
} from '@/subapps/events/common/utils';

export default async function Page({
  params,
}: {
  params: {slug: string; tenant: string; workspace: string};
}) {
  const {slug, tenant} = params;

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

  const eventDetails = await findEvent({
    slug,
    workspace,
    tenantId: tenant,
    user,
  }).then(clone);

  if (!eventDetails) {
    return notFound();
  }

  const allowGuestEventRegistration =
    workspace.config?.allowGuestEventRegistration;
  const eventAllowRegistration = eventDetails?.eventAllowRegistration;

  const allowGuests =
    allowGuestEventRegistration && !isLoginNeededForRegistration(eventDetails);

  const isRegistrationAllow =
    eventAllowRegistration &&
    (user || allowGuests) &&
    !hasRegistrationEnded(eventDetails);

  if (!isRegistrationAllow) notFound();

  const metaFields = await findModelFields({
    modelName: PORTAL_PARTICIPANT_MODEL,
    modelField: CONTACT_ATTRS,
    tenantId: tenant,
  }).then(clone);

  const partner = user
    ? await findGooveeUserByEmail(user.email, tenant).then(clone)
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
