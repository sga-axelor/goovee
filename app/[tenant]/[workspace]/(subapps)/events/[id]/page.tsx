import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {findEventByID} from '@/subapps/events/common/orm/event';
import {clone} from '@/utils';

// ---- LOCAL IMPORTS ---- //
import {EventDetails} from '@/subapps/events/common/ui/components';
import {getSession} from 'next-auth/react';
import {workspacePathname} from '@/utils/workspace';
import {findWorkspace} from '@/orm/workspace';

export const metadata = {
  title: 'Event',
  description: 'Event website',
};

export default async function Page({
  params,
  searchParams,
}: {
  params: {id: string; tenant: string; workspace: string};
  searchParams: {success?: string};
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

  const successMessage = searchParams.success === 'true';

  return (
    <EventDetails eventDetails={eventDetails} successMessage={successMessage} />
  );
}
