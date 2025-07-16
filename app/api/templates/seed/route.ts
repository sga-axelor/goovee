import {NextResponse} from 'next/server';

import {
  seedContent,
  seedTemplates,
} from '@/app/[tenant]/[workspace]/(subapps)/website/common/utils/templates';
export const dynamic = 'force-dynamic';
export async function GET() {
  const tenantId = 'd';

  const templates = await seedTemplates({tenantId});
  const contents = await seedContent(tenantId);
  return NextResponse.json({success: true, data: {templates, contents}});
}
