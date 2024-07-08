import axios from 'axios';
import {NextResponse} from 'next/server';

export async function POST(request: Request) {
  const {model = 'com.axelor.dms.db.DMSFile', record} = await request.json();

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_AOS_URL}/ws/dms/download/batch`,
    {
      model,
      records: [record.id],
    },
    {
      auth: {
        username: process.env.BASIC_AUTH_USERNAME as string,
        password: process.env.BASIC_AUTH_PASSWORD as string,
      },
    },
  );

  if (res.status === 200) {
    const {batchId, batchName} = await res.data;
    if (batchId || batchName) {
      return download(
        `${process.env.NEXT_PUBLIC_AOS_URL}/ws/dms/download/${batchId}?fileName=${batchName}`,
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
