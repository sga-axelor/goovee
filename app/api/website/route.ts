import {
  findWebsiteBySlug,
  findWebsitePageBySlug,
} from '@/app/[tenant]/[workspace]/(subapps)/website/common/orm/website';
import {NextResponse} from 'next/server';

export async function GET() {
  const data = await findWebsitePageBySlug({
    tenantId: 'd',
    workspaceURL: 'http://localhost:3001/d/india',
    websiteSlug: 'ax-ind',
    websitePageSlug: 'ax-ind-home',
  });

  return NextResponse.json(data);
}
