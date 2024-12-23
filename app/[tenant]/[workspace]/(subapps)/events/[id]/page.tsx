import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {findEventByID} from '@/subapps/events/common/orm/event';
import {clone} from '@/utils';
import {workspacePathname} from '@/utils/workspace';
import {findWorkspace} from '@/orm/workspace';
import {getTranslation} from '@/i18n/server';
import {getSession} from '@/auth';

// ---- LOCAL IMPORTS ---- //
import {EventDetails} from '@/subapps/events/common/ui/components';
import {fetchEventParticipants} from '@/subapps/events/common/actions/actions';

export async function generateMetadata() {
  return {
    title: await getTranslation('Event'),
    description: await getTranslation('Event website'),
  };
}

export default async function Page({
  params,
}: {
  params: {id: string; tenant: string; workspace: string};
}) {
  const {id, tenant} = params;

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

  const eventDetails: any = await findEventByID({
    id,
    workspace,
    tenantId: tenant,
    user,
  }).then(clone);

  if (!eventDetails) {
    return notFound();
  }
  const {isRegistered} = await fetchEventParticipants({
    id,
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
