import {notFound} from 'next/navigation';

import Form from './form';
import {findInviteById} from '../../common/orm/register';
import {SEARCH_PARAMS} from '@/constants';

export default async function Page({
  params,
  searchParams,
}: {
  params: {
    id: string;
  };
  searchParams: any;
}) {
  const {id} = params;
  const tenantId = searchParams?.[SEARCH_PARAMS.TENANT_ID];

  if (!tenantId) {
    return notFound();
  }

  const invite = await findInviteById({id, tenantId});

  if (!invite) {
    return notFound();
  }

  return <Form email={invite?.emailAddress?.address} inviteId={invite.id} />;
}
