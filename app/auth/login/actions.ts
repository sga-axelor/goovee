'use server';

import {revalidatePath} from 'next/cache';

export async function revalidate(url: string) {
  if (!url) return;
  revalidatePath(url);
}
