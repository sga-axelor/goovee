import Google from 'next-auth/providers/google';

export const google = Google({
  clientId: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
});

export default google;
