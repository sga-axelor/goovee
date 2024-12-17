import {redirect} from 'next/navigation';
import {notFound} from 'next/navigation';

// ---- CORE IMPORRS ---- //
import {ADDRESS_TYPE} from '@/constants';
import {clone} from '@/utils';
import {getSession} from '@/auth';
import {workspacePathname} from '@/utils/workspace';
import {findSubappAccess, findWorkspace} from '@/orm/workspace';
import {SUBAPP_CODES} from '@/constants';
import {findAddress, findCountries} from '@/orm/address';
import {User} from '@/types';

// ---- LOCAL IMPORTS ---- //
import Content from '@/subapps/quotations/[id]/address/[type]/edit/[address_id]/content';
import {getWhereClause} from '@/subapps/quotations/common/utils/quotations';
import {findQuotation} from '@/subapps/quotations/common/orm/quotations';

export default async function Page({params}: {params: any}) {
  const {tenant, id, type, address_id} = params;

  const session = await getSession();
  const user: any = session?.user;
  if (!user) {
    return notFound();
  }

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

  const {role, isContactAdmin} = subapp;

  const where = getWhereClause({
    user,
    role,
    isContactAdmin,
  });

  const quotation = await findQuotation({
    id,
    tenantId: tenant,
    params: {where},
    workspaceURL,
  }).then(clone);

  if (!quotation) {
    return notFound();
  }

  if (![ADDRESS_TYPE.invoicing, ADDRESS_TYPE.delivery].includes(params?.type)) {
    redirect('/account/addresses');
  }

  const countries: any = await findCountries(tenant).then(clone);

  const address = await findAddress({
    id: address_id,
    tenantId: tenant,
  }).then(clone);

  return (
    <Content
      quotation={quotation}
      type={type}
      address={address}
      countries={countries}
    />
  );
}
