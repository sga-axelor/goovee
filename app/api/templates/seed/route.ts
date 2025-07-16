import path from 'path';
import {NextResponse} from 'next/server';

import {seedTemplates} from '@/app/[tenant]/[workspace]/(subapps)/website/common/utils/templates';
export const dynamic = 'force-dynamic';
export async function GET() {
  const templatesDir = path.join(
    process.cwd(),
    'app/[tenant]/[workspace]/(subapps)/website/common/templates',
  );
  const tenantId = 'd';

  await seedTemplates({tenantId, templatesDir});
  return NextResponse.json({success: true, templatesDir, tenantId});
}
