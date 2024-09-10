import {getTenant} from '@/goovee';
import axios from 'axios';
import {NextResponse} from 'next/server';

export async function POST(
  request: Request,
  {params}: {params: {tenant: string}},
) {
  let tenant;

  try {
    const result = await getTenant(params.tenant);
    tenant = result?.tenant;
  } catch (err) {}

  if (!(tenant && tenant?.aos?.url && tenant?.aos?.auth)) {
    return new NextResponse('Bad Request', {status: 400});
  }

  const {model = 'com.axelor.dms.db.DMSFile', record} = await request.json();

  const {aos} = tenant;

  const res = await axios.post(
    `${aos.url}/ws/dms/download/batch`,
    {
      model,
      records: [record.id],
    },
    {
      auth: {
        username: aos.auth.username,
        password: aos.auth.password,
      },
    },
  );

  if (res.status === 200) {
    const {batchId, batchName} = await res.data;
    if (batchId || batchName) {
      return download(
        `${aos.url}/ws/dms/download/${batchId}?fileName=${batchName}`,
        batchName,
      );
    }
  }

  return new NextResponse('File not found', {status: 404});
}

export async function download(url: string, fileName?: string) {
  if (fileName && !url.startsWith('data:')) {
    const qs = new URLSearchParams({fileName}).toString();
    const sp = url.includes('?') ? '&' : '?';
    url = url + sp + qs;
  }

  const res = await axios.head(url);

  if (res.status === 404) {
    return new NextResponse('File not found', {status: 404});
  }

  return axios.get(url, {
    responseType: 'blob',
  });
}
