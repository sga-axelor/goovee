import {getServerSession} from 'next-auth';

// ---- CORE IMPORTS ---- //
import {authOptions} from '@/lib/auth';

export async function getSession(...args: any[]) {
  return getServerSession(...([...args, authOptions] as any));
}
