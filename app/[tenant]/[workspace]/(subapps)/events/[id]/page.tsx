import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {findEventByID} from '@/subapps/events/common/orm/event';
import {clone} from '@/utils';

// ---- LOCAL IMPORTS ---- //
import {EventDetails} from '@/subapps/events/common/ui/components';

export const metadata = {
  title: 'Event',
  description: 'Event website',
};

export default async function Page({
  params,
  searchParams,
}: {
  params: {tenant: string; workspace: string; id: string};
  searchParams: {success?: string};
}) {
  const {id, tenant} = params;

  const eventDetails = await findEventByID({id, tenantId: tenant}).then(clone);

  if (!eventDetails) {
    return notFound();
  }

  const successMessage = searchParams.success === 'true';

  return (
    <EventDetails eventDetails={eventDetails} successMessage={successMessage} />
  );
}
