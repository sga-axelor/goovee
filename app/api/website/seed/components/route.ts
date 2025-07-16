import {NextResponse} from 'next/server';

import {seedComponents} from '@/app/[tenant]/[workspace]/(subapps)/website/common/utils/templates';
export const dynamic = 'force-dynamic';

export async function GET() {
  const tenantId = 'd';

  const templates = await seedComponents(tenantId);
  return NextResponse.json({success: true, data: templates});
}
