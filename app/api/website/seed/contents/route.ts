import {NextResponse} from 'next/server';

import {seedContents} from '@/app/[tenant]/[workspace]/(subapps)/website/common/utils/templates';
export const dynamic = 'force-dynamic';
export async function GET() {
  const tenantId = 'd';

  const contents = await seedContents(tenantId);
  return NextResponse.json({success: true, data: contents});
}
