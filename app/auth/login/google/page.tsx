export const dynamic = 'force-dynamic';

import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {t} from '@/locale/server';
import {findPartnerByEmail} from '@/orm/partner';

// ---- LOCAL IMPORTS ---- //
import {extractSearchParams, isExistingUser} from '../../register/common/utils';
import Content from './content';

function Description({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="container space-y-6 mt-8">
      <h1 className="text-[2rem] font-bold">{title}</h1>
      <div className="bg-white py-4 px-6">
        <p>{description}</p>
      </div>
    </div>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: {
    workspaceURI?: string;
    tenant: string;
    callbackurl: string;
  };
}) {
  const {workspaceURI, tenantId, workspaceURL} = extractSearchParams({
    searchParams,
  });

  if (!(workspaceURI && tenantId)) {
    return notFound();
  }

  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return (
      <Description
        title={await t('Log In', {tenantId})}
        description={await t('Login with your gmail account to continue.', {
          tenantId,
        })}
      />
    );
  }

  const partner = await findPartnerByEmail(user.email, tenantId);

  if (
    !(partner && partner.isActivatedOnPortal && partner.isRegisteredOnPortal)
  ) {
    return (
      <Description
        title={await t('Log In', {tenantId})}
        description={await t('We cannot find your record.', {
          tenantId,
        })}
      />
    );
  }

  const existing = await isExistingUser({
    workspaceURL,
    tenantId,
    user: {
      isContact: partner.isContact,
      id: partner.id,
      mainPartnerId: partner.isContact ? partner.mainPartner?.id : undefined,
      email: user.email,
    },
  });

  if (!existing) {
    return (
      <Description
        title={await t('Log In', {tenantId})}
        description={await t('You are not a member of this workspace.', {
          tenantId,
        })}
      />
    );
  }

  return <Content partner={partner} />;
}
