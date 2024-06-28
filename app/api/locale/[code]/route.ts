import {getClient} from '@/goovee';
import {NextResponse} from 'next/server';

export async function GET(
  request: Request,
  {params}: {params: {code: string}},
) {
  const {code} = params;

  const client = await getClient();

  try {
    let translations = await client.aOSMetaTranslation.find({
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
