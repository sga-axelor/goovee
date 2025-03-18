import {NextRequest, NextResponse} from 'next/server';
import {findFile, streamFile} from '@/utils/download';
import {manager} from '@/tenant';

export async function GET(
  request: NextRequest,
  {params}: {params: {tenant: string; id: string}},
) {
  const {id, tenant} = params;

  const client = await manager.getClient(tenant);

  if (!client || !id) {
    return NextResponse.json({message: 'Bad request'}, {status: 400});
  }

  const partner = await client.aOSPartner.findOne({
    where: {id},
    select: {picture: {id: true}},
  });

  if (!partner) return new NextResponse('Partner not found', {status: 404});
  if (!partner.picture?.id) {
    return new NextResponse('Picture not found', {status: 404});
  }

  const file = await findFile({
    id: partner.picture.id,
    meta: true,
    tenant,
  });

  if (!file) {
    return new NextResponse('File not found', {status: 404});
  }

  return streamFile(file);
}
