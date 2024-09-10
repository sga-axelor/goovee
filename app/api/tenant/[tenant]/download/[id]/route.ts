import fs, {Stats} from 'fs';
import {getTenant} from '@/goovee';
import {NextRequest, NextResponse} from 'next/server';
import type {ReadableOptions} from 'stream';

function streamFile(
  path: string,
  options?: ReadableOptions,
): ReadableStream<Uint8Array> {
  const downloadStream = fs.createReadStream(path, options);

  return new ReadableStream({
    start(controller) {
      downloadStream.on('data', (chunk: Buffer) =>
        controller.enqueue(new Uint8Array(chunk)),
      );
      downloadStream.on('end', () => controller.close());
      downloadStream.on('error', (error: NodeJS.ErrnoException) =>
        controller.error(error),
      );
    },
    cancel() {
      downloadStream.destroy();
    },
  });
}

export async function GET(
  request: NextRequest,
  {params}: {params: {tenant: string; id: string}},
) {
  const {id} = params;

  let tenant, client;

  try {
    const result = await getTenant(params.tenant);
    tenant = result?.tenant;
    client = result?.client;
  } catch (err) {}

  if (!(client && tenant && tenant?.aos?.storage)) {
    return new NextResponse('Bad Request', {status: 400});
  }

  const storage = tenant?.aos?.storage;

  const searchParams = request.nextUrl.searchParams;
  const meta = searchParams.get('meta') === 'true';

  let record, filePath, fileName, fileType;

  if (meta) {
    record = await client.aOSMetaFile.findOne({
      where: {id},
    });

    if (!record) {
      return new NextResponse('File not found', {status: 404});
    }

    filePath = `${storage}/${record?.filePath}`;
    fileName = record?.fileName;
    fileType = record?.fileType;
  } else {
    record = await client.aOSDMSFile.findOne({
      where: {id},
      select: {
        metaFile: true,
      },
    });

    if (!record) {
      return new NextResponse('File not found', {status: 404});
    }

    filePath = `${storage}/${record?.metaFile?.filePath}`;
    fileName = record?.metaFile?.fileName;
    fileType = record?.metaFile?.fileType;
  }

  try {
    const data: ReadableStream<Uint8Array> = streamFile(filePath);
    const stats: Stats = await fs.promises.stat(filePath);

    const res = new NextResponse(data, {
      status: 200,
      headers: new Headers({
        'content-disposition': `attachment; filename=${fileName}`,
        'content-type': fileType,
        'content-length': stats.size + '',
      }),
    });

    return res;
  } catch (err) {
    return new NextResponse('Error downloading file', {status: 500});
  }
}
