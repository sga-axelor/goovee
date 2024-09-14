import type {NextAuthOptions} from 'next-auth';

// ---- CORE IMPORTS ---- //
import {findPartnerByEmail, registerPartner} from '@/orm/partner';
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
        const {id, emailAddress, fullName: name, isContact, mainPartner} = user;

        session.user = {
          id,
          name,
          email: emailAddress?.address,
          isContact,
          mainPartnerId: isContact ? mainPartner?.id : undefined,
          tenantId: token?.tenantId as Tenant['id'],
        };
      }

      return session;
    },
    async jwt({user, token}: any) {
      if (user?.tenantId) {
        token.tenantId = user.tenantId;
      }
      return token;
    },
    async signIn({account, profile, ...rest}: any) {
      if (false && account.provider === 'google') {
        const {given_name, family_name, email} = profile;
        const exists = await findPartnerByEmail(email);
        if (!exists) {
          try {
            const user = await registerPartner({
              firstName: given_name,
              name: family_name,
              email,
            });

            return Boolean(user);
          } catch (err) {
            return false;
          }
        } else {
          return true;
        }
      }

      return true;
    },
  },
};
