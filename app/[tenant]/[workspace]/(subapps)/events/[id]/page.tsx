import {notFound} from 'next/navigation';
import {getSession} from 'next-auth/react';

// ---- CORE IMPORTS ---- //
import {findEventByID} from '@/subapps/events/common/orm/event';
import {clone} from '@/utils';
import {workspacePathname} from '@/utils/workspace';
import {findWorkspace} from '@/orm/workspace';
import {getTranslation} from '@/i18n/server';

// ---- LOCAL IMPORTS ---- //
import {EventDetails} from '@/subapps/events/common/ui/components';

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

  return <EventDetails eventDetails={eventDetails} workspace={workspace} />;
}
