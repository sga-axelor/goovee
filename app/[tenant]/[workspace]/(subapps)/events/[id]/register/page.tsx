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

export default async function Page({
  params,
}: {
  params: {tenant: string; workspace: string; id: string};
}) {
  const {id, tenant} = params;

  const eventDetails = await findEventByID({id, tenantId: tenant}).then(clone);

  if (!eventDetails) {
    return notFound();
  }
  const metaFields = await findModelFields({
    modelName: PORTAL_PARTICIPANT_MODEL,
    modelField: CONTACT_ATTRS,
    tenantId: tenant,
  }).then(clone);

  return (
    <>
      <Content eventDetails={eventDetails} metaFields={metaFields} />
    </>
  );
}
