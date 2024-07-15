// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';

// ---- LOCAL IMPORTS ---- //
import Content from '@/app/events/[id]/register/content';
import {findEvent} from '@/app/events/common/orm/event';
import {findModelFields} from '@/app/events/common/orm/meta-json-field';

export default async function Page({params}: {params: {id: string}}) {
  const eventDetails = await findEvent(params.id).then(clone);
  const metaFields = await findModelFields(
    'com.axelor.apps.portal.db.PortalParticipant',
    'contactAttrs',
  ).then(clone);

  return (
    <>
      <Content eventDetails={eventDetails} metaFields={metaFields} />
    </>
  );
}
