'use client';

import {useMemo} from 'react';
import {useSearchParams as useNextSearchParams} from 'next/navigation';
import {usePathname, useRouter} from 'next/navigation';

export const useSearchParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useNextSearchParams();

  const update = (
    values: Array<{
      key: string;
      value?: string | number;
    }>,
  ) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    values.forEach(({key, value = ''}: any) => {
      value = value && String(value)?.trim();
      value ? current.set(key, value) : current.delete(key);
    });
    const query = current.toString();
    router.push(`${pathname}${query ? `?${query}` : ''}`);
  };

  return useMemo(() => ({searchParams, update}), [searchParams]);
};
