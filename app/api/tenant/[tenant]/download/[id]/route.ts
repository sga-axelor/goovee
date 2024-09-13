import {NextRequest, NextResponse} from 'next/server';
import {findFile, streamFile} from '../utils';

export async function GET(
  request: NextRequest,
  {params}: {params: {tenant: string; id: string}},
) {
  const {id, tenant} = params;

  const searchParams = request.nextUrl.searchParams;
  const meta = searchParams.get('meta') === 'true';

  const file = await findFile({
    id,
    meta,
    tenant,
  });

  if (!file) {
    return new NextResponse('File not found', {status: 404});
  }

  return streamFile(file);
}
