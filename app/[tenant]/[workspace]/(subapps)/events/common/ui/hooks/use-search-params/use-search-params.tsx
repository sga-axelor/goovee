import {useCallback, useMemo} from 'react';
import {useSearchParams as useNextSearchParams} from 'next/navigation';
import {usePathname, useRouter} from 'next/navigation';

export const useSearchParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useNextSearchParams();

  const update = useCallback(
    (
      values: Array<{
        key: string;
        value?: string | number | (string | number)[];
      }>,
    ) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      values.forEach(({key, value}: any) => {
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
    [pathname, router, searchParams],
  );

  return useMemo(() => ({searchParams, update}), [searchParams, update]);
};
