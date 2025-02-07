'use server';

import axios from 'axios';

import {t} from '@/locale/server';

export async function createRow(model: string | undefined, data: any) {
  if (model == null) {
    throw new Error(await t('No model registered to create row'));
  }

  const aos = process.env.NEXT_PUBLIC_AOS_URL;

  if (!aos) {
    throw new Error(await t('Rest API URL not set'));
  }

  const res = await axios
    .put(
      `${aos}/ws/rest/${model}`,
      {data},
      {
        auth: {
          username: process.env.BASIC_AUTH_USERNAME as string,
          password: process.env.BASIC_AUTH_PASSWORD as string,
        },
      },
    )
    .then((_res: any) => _res?.data);

  if (!res?.data || res?.status === -1) {
    throw new Error(await t('Failed to create row'));
  }

  return res.data?.[0];
}
