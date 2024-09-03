import {findCountries, findPartnerAddress} from '@/orm/address';
import {clone} from '@/utils';
import {redirect} from 'next/navigation';
import Content from './content';

export default async function Page({
  params,
}: {
  params: {id: string; tenant: string; workspace: string};
}) {
  const {tenant, workspace, id} = params;

  let partnerAddress = await findPartnerAddress(id, tenant).then(clone);

  if (!partnerAddress) {
    redirect(`${tenant}/${workspace}/account/addresses`);
  }

  const countries = await findCountries(tenant).then(clone);

  return (
    <Content
      id={params?.id}
      partnerAddress={partnerAddress}
      countries={countries}
    />
  );
}
