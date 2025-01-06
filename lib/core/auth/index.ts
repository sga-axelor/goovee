import {getServerSession} from 'next-auth';
import type {NextAuthOptions} from 'next-auth';

// ---- CORE IMPORTS ---- //
import {findPartnerByEmail} from '@/orm/partner';
import {transformLocale} from '@/locale/utils';
import {type Tenant} from '@/tenant';

import google from './google';
import credentials from './credentials';

export const authOptions: NextAuthOptions = {
  providers: [credentials, google],
  callbacks: {
    async session({session, token}) {
      const user =
        session?.user?.email &&
        (await findPartnerByEmail(
          session.user.email,
          token?.tenantId as Tenant['id'],
        ));

      if (user) {
        const {
          id,
          emailAddress,
          fullName: name = '',
          isContact,
          mainPartner,
          localization,
        } = user;

        session.user = {
          id,
          name,
          email: emailAddress?.address,
          isContact,
          mainPartnerId: isContact ? mainPartner?.id : undefined,
          tenantId: token?.tenantId as Tenant['id'],
          locale: transformLocale(localization?.code),
        };
      }

      return session;
    },
    async jwt({user, token, trigger, session}: any) {
      if (
        trigger === 'update' &&
        session?.email &&
        session?.id &&
        session?.tenantId
      ) {
        /**
         * Updating session after registering with Google Oauth
         */

        const partner = await findPartnerByEmail(
          session.email,
          session.tenantId,
        );

        if (partner) {
          const {id, name, isContact, mainPartner, localization} = partner;

          token.id = id;
          token.name = name;
          token.email = session.email;
          token.isContact = isContact;
          token.tenantId = session.tenantId;
          token.mainPartnerId = isContact ? mainPartner?.id : undefined;
          token.locale = transformLocale(localization?.code);
        }
      }

      if (user?.tenantId) {
        token.tenantId = user.tenantId;
      }

      return token;
    },
  },
};

export async function getSession(...args: any[]) {
  return getServerSession(...([...args, authOptions] as any));
}
