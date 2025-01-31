import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {findEvent} from '@/subapps/events/common/orm/event';
import {clone} from '@/utils';
import {workspacePathname} from '@/utils/workspace';
import {findWorkspace} from '@/orm/workspace';
import {t} from '@/locale/server';
import {getSession} from '@/auth';

// ---- LOCAL IMPORTS ---- //
import {EventDetails} from '@/subapps/events/common/ui/components';
import {fetchEventParticipants} from '@/subapps/events/common/actions/actions';

export async function generateMetadata() {
  return {
    title: await t('Event'),
    description: await t('Event website'),
  };
}

export default async function Page({
  params,
}: {
  params: {slug: string; tenant: string; workspace: string};
}) {
  const {slug, tenant} = params;

  const session = await getSession();
  const user = session?.user;

  const {workspaceURL} = workspacePathname(params);

  const workspace: any = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
    tenantId: tenant,
  }).then(clone);

  if (!workspace) {
    return notFound();
  }

  const eventDetails: any = await findEvent({
    slug,
    workspace,
    tenantId: tenant,
    user,
  }).then(clone);

  if (!eventDetails) {
    return notFound();
  }
  const {isRegistered} = await fetchEventParticipants({
    slug,
    workspace,
    user,
  });

  return (
    <EventDetails
      eventDetails={eventDetails}
      workspace={workspace}
      isRegistered={isRegistered}
    />
  );
}
