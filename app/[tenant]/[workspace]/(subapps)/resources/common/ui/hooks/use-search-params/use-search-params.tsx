'use client';

import {useCallback, useMemo} from 'react';
import {
  usePathname,
  useRouter,
  useSearchParams as useNextSearchParams,
} from 'next/navigation';

export function useSearchParams() {
  const searchParams = useNextSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const updateSearchParams = useCallback(
    (
      values: Array<{
        key: string;
        value?: string | number;
      }>,
    ) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      values.forEach(({key, value = ''}: any) => {
        value = value && String(value)?.trim();
        if (!value) {
          current.delete(key);
        } else {
          current.set(key, value);
        }
      });

      const search = current.toString();
      const query = search ? `?${search}` : '';
      router.push(`${pathname}${query}`);
    },
    [pathname, router],
  );

  const value = useMemo(
    () => ({searchParams, updateSearchParams}),
    [searchParams, updateSearchParams],
  );

  return value;
}

export default useSearchParams;
