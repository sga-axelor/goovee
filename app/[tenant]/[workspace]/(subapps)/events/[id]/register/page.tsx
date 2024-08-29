import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';

// ---- LOCAL IMPORTS ---- //
import Content from '@/subapps/events/[id]/register/content';
import {findEventByID} from '@/subapps/events/common/orm/event';
import {findModelFields} from '@/subapps/events/common/orm/meta-json-field';
import {
  PORTAL_PARTICIPANT_MODEL,
  CONTACT_ATTRS,
} from '@/subapps/events/common/constants';

export default async function Page({params}: {params: {id: string}}) {
  const eventDetails = await findEventByID(params.id).then(clone);

  if (!eventDetails) {
    return notFound();
  }
  const metaFields = await findModelFields(
    PORTAL_PARTICIPANT_MODEL,
    CONTACT_ATTRS,
  ).then(clone);

  return (
    <>
      <Content eventDetails={eventDetails} metaFields={metaFields} />
    </>
  );
}
