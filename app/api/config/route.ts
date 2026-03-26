export const dynamic = 'force-dynamic';

import {NextResponse} from 'next/server';
import {getPublicEnvironment} from '@/environment';

export async function GET() {
  /**
   * NOTE:
   * We do NOT use NEXT_PUBLIC_* envs because those are statically inlined at build time
   * and cannot vary across environments (e.g., Docker image reuse).
   * Instead, GOOVEE_PUBLIC_* variables are injected at runtime via the environment
   * Only non-sensitive, client-safe configuration is prefixed with GOOVEE_PUBLIC_
   */
  return NextResponse.json(getPublicEnvironment());
}
