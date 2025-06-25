export const dynamic = 'force-dynamic';

import {NextResponse} from 'next/server';
import {getGooveeEnvironment} from '@/environment';

export async function GET() {
  return NextResponse.json(getGooveeEnvironment());
}
