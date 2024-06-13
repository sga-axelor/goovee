import {useCallback, useEffect, useMemo, useState} from 'react';

export function useMediaQuery(query: string) {
  const media = useMemo(() => window.matchMedia(query), [query]);
  const [state, setState] = useState<boolean>(media.matches);
  const handleChange = useCallback(() => setState(media.matches), [media]);

  useEffect(() => {
    media.addEventListener('change', handleChange);
    return () => {
      media.removeEventListener('change', handleChange);
    };
  }, [handleChange, media]);

  return state;
}

export function useResponsive() {
  const xs = useMediaQuery('(max-width: 35.9988rem)');
  const sm = useMediaQuery('(min-width: 36rem) and (max-width: 47.9988rem)');
  const md = useMediaQuery('(min-width: 48rem) and (max-width: 61.9988rem)');
  const lg = useMediaQuery('(min-width: 62rem) and (max-width: 74.9988rem)');
  const xl = useMediaQuery('(min-width: 75rem) and (max-width: 87.4988rem)');
  const xxl = useMediaQuery('(min-width: 87.5rem)');
  return {
    xs,
    sm,
    md,
    lg,
    xl,
    xxl,
  };
}

export default useResponsive;
