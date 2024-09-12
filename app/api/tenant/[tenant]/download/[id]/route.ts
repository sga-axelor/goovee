import fs, {Stats} from 'fs';
import {getTenant} from '@/goovee';
import {NextRequest, NextResponse} from 'next/server';
import type {ReadableOptions} from 'stream';

export async function findFile({
  id,
  meta,
  tenant: tenantId,
}: {
  id: string;
  meta?: boolean;
  tenant: string;
}) {
  if (!id && tenantId) {
    return null;
  }

  let tenant, client;

  try {
    const result = await getTenant(tenantId);

    tenant = result?.tenant;
    client = result?.client;
  } catch (err) {
    return null;
  }

  if (!(client && tenant && tenant?.aos?.storage)) {
    return null;
  }

  const storage = tenant?.aos?.storage;

  let record, filePath, fileName, fileType;

  if (meta) {
    record = await client.aOSMetaFile.findOne({
      where: {id},
    });

    if (!record) {
      return null;
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
      return null;
    }

    filePath = `${storage}/${record?.metaFile?.filePath}`;
    fileName = record?.metaFile?.fileName;
    fileType = record?.metaFile?.fileType;
  }

  return {
    record,
    fileName,
    filePath,
    fileType,
  };
}

export function createStream(
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

export async function streamFile({
  fileName,
  filePath,
  fileType,
}: {
  fileName: string;
  filePath: string;
  fileType: string;
}) {
  if (!(fileName && filePath && fileType)) {
    return new NextResponse('Bad request', {status: 400});
  }

  try {
    const data: ReadableStream<Uint8Array> = createStream(filePath);
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
