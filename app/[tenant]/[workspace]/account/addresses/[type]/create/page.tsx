import {findCountries} from '@/orm/address';
import {clone} from '@/utils';
import {redirect} from 'next/navigation';
import Content from './content';

export default async function Page({
  params,
}: {
  params: {tenant: string; type: 'invoicing' | 'delivery'};
}) {
  const {tenant} = params;

  if (!['invoicing', 'delivery'].includes(params?.type)) {
    redirect('/account/addresses');
  }

  const countries = await findCountries(tenant).then(clone);

  return <Content type={params?.type} countries={countries} />;
}
