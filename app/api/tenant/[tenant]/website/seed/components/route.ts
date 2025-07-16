import {NextRequest, NextResponse} from 'next/server';

import {seedComponents} from '@/app/[tenant]/[workspace]/(subapps)/website/common/utils/templates';
export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  {params}: {params: {tenant: string}},
) {
  if (process.env.ENABLE_SEEDING !== 'true') {
    return NextResponse.json({error: true}, {status: 503});
  }
  const {tenant} = params;

  const templates = await seedComponents(tenant);
  return NextResponse.json({success: true, data: templates});
}
