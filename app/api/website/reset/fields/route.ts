import {resetFields} from '@/app/[tenant]/[workspace]/(subapps)/website/common/utils/templates';
import {NextResponse} from 'next/server';

export const dynamic = 'force-dynamic';
export async function GET() {
  const tenantId = 'd';
  await resetFields(tenantId);
  return NextResponse.json({success: true, tenantId});
}
