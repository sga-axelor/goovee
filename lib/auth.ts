import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import type {NextAuthOptions} from 'next-auth';

// ---- CORE IMPORTS ---- //
import {compare} from '@/utils/auth';
import {findPartnerByEmail, registerPartner} from '@/orm/partner';
import type {ID} from '@/types';

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: {label: 'Email', type: 'text'},
        password: {label: 'Password', type: 'password'},
      },
      async authorize({email, password, tenantId}: any, req) {
        if (!email) return null;

        const user = await findPartnerByEmail(email, tenantId);

        if (!user) {
          return null;
        }

        const {id, fullName: name, password: hashedpassword} = user;

        if (password && hashedpassword) {
          const isvalid = await compare(password, hashedpassword);
          if (!isvalid) return null;
        }

        return {
          id,
          name,
          email,
          tenantId,
        };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({session, token}) {
      const user =
        session?.user?.email &&
        (await findPartnerByEmail(session.user.email, token?.tenantId as ID));

      if (user) {
        const {id, emailAddress, fullName: name, isContact, mainPartner} = user;

        session.user = {
          id,
          name,
          email: emailAddress?.address,
          isContact,
          mainPartnerId: isContact ? mainPartner?.id : undefined,
          tenantId: token?.tenantId as ID,
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
