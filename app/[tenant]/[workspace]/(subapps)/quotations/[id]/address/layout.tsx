import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {Container} from '@/ui/components';
import {getSession} from '@/auth';
import {workspacePathname} from '@/utils/workspace';
import {SUBAPP_CODES} from '@/constants';
import {getTranslation} from '@/i18n/server';
import {findSubappAccess} from '@/orm/workspace';
import {clone} from '@/utils';

// ---- LOCAL IMPORTS ---- //
import {findQuotation} from '@/subapps/quotations/common/orm/quotations';
import {getWhereClause} from '@/subapps/quotations/common/utils/quotations';

export default async function Layout({
  params,
  children,
}: {
  params: {
    id: string;
    tenant: string;
    workspace: string;
  };
  children: React.ReactNode;
}) {
  const {id, tenant} = params;

  const session = await getSession();
  const user: any = session?.user;
  if (!user) {
    return notFound();
  }

  const {workspaceURL} = workspacePathname(params);

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.quotations,
    user,
    url: workspaceURL,
    tenantId: tenant,
  });

  if (!subapp) {
    return notFound();
  }

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

  return (
    <div className="mt-2">
      <Container
        title={`${await getTranslation('Quotation')} ${quotation.saleOrderSeq}`}>
        {children}
      </Container>
    </div>
  );
}
