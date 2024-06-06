import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import type {NextAuthOptions} from 'next-auth';

// ---- CORE IMPORTS ---- //
import {client} from '@/globals';
import {compare} from '@/utils/auth';
import {registerPartner} from '@/orm/partner';
import {clone} from '@/utils';

async function findPartner(email: string) {
  if (!email) return null;

  const c = await client;

  const partner = await c.aOSPartner
    .findOne({
      where: {
        emailAddress: {
          address: {
            eq: email,
          },
        },
      },
      select: {
        fullName: true,
        isContact: true,
        password: true,
        emailAddress: true,
        mainPartner: {
          id: true,
        },
      },
    })
    .then(clone);

  return partner;
}

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: {label: 'Email', type: 'text'},
        password: {label: 'Password', type: 'password'},
      },
      async authorize({email, password}: any, req) {
        if (!email) return null;

        const user = await findPartner(email);

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
        };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({session}) {
      const user =
        session?.user?.email && (await findPartner(session.user.email));

      if (user) {
        const {id, emailAddress, fullName: name, isContact, mainPartner} = user;

        session.user = {
          id,
          name,
          email: emailAddress?.address,
          isContact,
          mainPartnerId: isContact ? mainPartner?.id : undefined,
        };
      }

      return session;
    },
    async signIn({account, profile}: any) {
      if (account.provider === 'google') {
        const {given_name, family_name, email} = profile;
        const exists = await findPartner(email);
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
