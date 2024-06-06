import {client} from '@/globals';
import {NextResponse} from 'next/server';

export async function GET(
  request: Request,
  {params}: {params: {code: string}},
) {
  const {code} = params;

  const c = await client;

  try {
    let translations = await c.aOSMetaTranslation.find({
      where: {
        language: code,
      },
    });

    const translationsJSON: any = {};

    translations?.forEach((t: any) => {
      translationsJSON[t.key] = t.value;
    });

    return NextResponse.json(translationsJSON);
  } catch (err) {
    return NextResponse.json({});
  }
}
