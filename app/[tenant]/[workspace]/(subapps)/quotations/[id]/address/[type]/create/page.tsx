import {redirect} from 'next/navigation';
import {notFound} from 'next/navigation';

// ---- CORE IMPORRS ---- //
import {ADDRESS_TYPE} from '@/constants';
import {clone} from '@/utils';
import {getSession} from '@/auth';
import {workspacePathname} from '@/utils/workspace';
import {findSubappAccess, findWorkspace} from '@/orm/workspace';
import {SUBAPP_CODES} from '@/constants';
import {PartnerTypeMap, findPartnerByEmail} from '@/orm/partner';
import {findCountries} from '@/orm/address';

// ---- LOCAL IMPORTS ---- //
import Content from '@/subapps/quotations/[id]/address/[type]/create/content';

export default async function Page({params}: {params: any}) {
  const {tenant, type} = params;

  const session = await getSession();
  const user: any = session?.user;

  const {workspaceURL} = workspacePathname(params);

  const workspace: any = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
    tenantId: tenant,
  }).then(clone);

  if (!workspace) {
    return notFound();
  }

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.quotations,
    user,
    url: workspaceURL,
    tenantId: tenant,
  });

  if (!subapp) return notFound();

  if (![ADDRESS_TYPE.invoicing, ADDRESS_TYPE.delivery].includes(params?.type)) {
    redirect('/account/addresses');
  }

  const partner = await findPartnerByEmail(user.email, tenant);

  if (!partner) {
    return notFound();
  }
  const {partnerTypeSelect} = partner;

  const userType: any = Object.entries(PartnerTypeMap).find(
    ([key, value]) => value === partnerTypeSelect,
  )?.[0];

  const countries: any = await findCountries(tenant).then(clone);

  return <Content type={type} userType={userType} countries={countries} />;
}
