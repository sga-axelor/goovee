import fs, {Stats} from 'fs';
import {getClient} from '@/goovee';
import {NextResponse} from 'next/server';
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

export async function GET(request: Request, {params}: {params: {id: string}}) {
  const client = await getClient();

  const record = await client.aOSDMSFile.findOne({
    where: {id: params?.id},
    select: {
      metaFile: true,
    },
  });

  if (!record) {
    return new NextResponse('File not found', {status: 404});
  }

  try {
    const filePath = `${process.env.DATA_STORAGE}/${record.metaFile?.filePath}`;

    const data: ReadableStream<Uint8Array> = streamFile(filePath);
    const stats: Stats = await fs.promises.stat(filePath);

    const res = new NextResponse(data, {
      status: 200,
      headers: new Headers({
        'content-disposition': `attachment; filename=${record?.metaFile?.fileName}`,
        'content-type': record?.metaFile?.fileType,
        'content-length': stats.size + '',
      }),
    });

    return res;
  } catch (err) {
    return new NextResponse('Error downloading file', {status: 500});
  }
}
