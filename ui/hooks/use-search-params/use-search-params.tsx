'use client';

import {useCallback, useMemo} from 'react';
import {
  useSearchParams as useNextSearchParams,
  usePathname,
  useRouter,
} from 'next/navigation';

export const useSearchParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useNextSearchParams();

  const update = useCallback(
    (
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
    },
    [searchParams, router, pathname],
  );

  return useMemo(() => ({searchParams, update}), [searchParams, update]);
};
