import {findTranslations} from '@/locale/api';
import {NextResponse} from 'next/server';

export async function GET(
  request: Request,
  {params}: {params: {tenant: string; code: string}},
) {
  const {code, tenant} = params;

  try {
    const translations = await findTranslations(code, tenant);

    return NextResponse.json(translations);
  } catch (err) {
    return NextResponse.json({});
  }
}
