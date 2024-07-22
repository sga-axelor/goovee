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
    (values: any) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      values.forEach(({key, value = ''}: any) => {
        if (Array.isArray(value)) {
          current.delete(key);
          value.forEach(val => {
            if (val != null) {
              current.append(key, String(val).trim());
            }
          });
        } else {
          value = value && String(value)?.trim();
          value ? current.set(key, value) : current.delete(key);
        }
      });
      const query = current.toString();
      router.push(`${pathname}${query ? `?${query}` : ''}`);
    },
    [searchParams, router, pathname],
  );

  return useMemo(() => ({searchParams, update}), [searchParams, update]);
};
