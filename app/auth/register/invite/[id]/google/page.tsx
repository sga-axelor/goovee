import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {SEARCH_PARAMS} from '@/constants';
import {getTranslation} from '@/i18n/server';
import {findPartnerByEmail} from '@/orm/partner';

// ---- LOCAL IMPORTS ---- //
import Form from './form';
import {findInviteById} from '../../../common/orm/register';
import Subscribe from '../subscribe';

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

  if (!invite?.emailAddress?.address) {
    return notFound();
  }

  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return notFound();
  }

  /**
   * Google Oauth Uses doesn't contain id or other information
   */
  const partner = await findPartnerByEmail(user.email, tenantId);

  if (user) {
    if (user.email !== invite.emailAddress.address) {
      return (
        <div className="container space-y-6 mt-8">
          <h1 className="text-[2rem] font-bold">
            {await getTranslation('Sign Up')}
          </h1>
          <div className="bg-white py-4 px-6">
            <p>
              {await getTranslation(
                'You are currently loggedin with a different user. Logout to continue registration for the invite.',
              )}
            </p>
          </div>
        </div>
      );
    } else if (
      user.email === invite.emailAddress.address &&
      partner?.isActivatedOnPortal &&
      partner?.isRegisteredOnPortal &&
      partner?.isContact &&
      partner?.mainPartner?.id === invite.partner?.id
    ) {
      return (
        <Subscribe
          workspaceURL={invite.workspace.url}
          inviteId={invite.id}
          updateSession={!!partner}
        />
      );
    }
  }

  return (
    <Form
      email={invite?.emailAddress?.address}
      inviteId={invite.id}
      updateSession={!!partner}
    />
  );
}
