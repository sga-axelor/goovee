import NextAuth, {DefaultSession} from 'next-auth';

// ---- CORE IMPORTS ---- //
import {ID, User} from '.';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User & DefaultSession['user'];
  }
}
