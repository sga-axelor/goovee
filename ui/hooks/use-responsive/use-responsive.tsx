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
  const xs = useMediaQuery('(max-width: 575.98px)');
  const sm = useMediaQuery('(min-width: 576px) and (max-width: 767.98px)');
  const md = useMediaQuery('(min-width: 768px) and (max-width: 991.98px)');
  const lg = useMediaQuery('(min-width: 992px) and (max-width: 1199.98px)');
  const xl = useMediaQuery('(min-width: 1200px) and (max-width: 1399.98px)');
  const xxl = useMediaQuery('(min-width: 1400px)');
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
