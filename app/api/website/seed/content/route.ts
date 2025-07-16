import {NextResponse} from 'next/server';

import {seedContent} from '@/app/[tenant]/[workspace]/(subapps)/website/common/utils/templates';
export const dynamic = 'force-dynamic';
export async function GET() {
  const tenantId = 'd';

  const contents = await seedContent(tenantId);
  return NextResponse.json({success: true, data: contents});
}
