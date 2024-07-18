// ---- CORE IMPORTS ---- //
import {findEvent} from '@/subapps/events/common/orm/event';
import {clone} from '@/utils';
import {getSession} from '@/orm/auth';

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
  params: {id: string};
  searchParams: {success?: string};
}) {
  const session = await getSession();
  const eventDetails = await findEvent(params.id).then(clone);
  const successMessage = searchParams.success === 'true';
  const userId = session?.user?.id;

  return (
    <EventDetails
      eventDetails={eventDetails}
      successMessage={successMessage}
      comments={eventDetails?.eventCommentList}
      userId={userId}
    />
  );
}
