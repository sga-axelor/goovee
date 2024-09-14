import Credentials from 'next-auth/providers/credentials';
import {findPartnerByEmail} from '@/orm/partner';
import {compare} from './utils';

export const credentials = Credentials({
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
});

export default credentials;
