'use client';

import {useCallback, useMemo, useState} from 'react';

type useQuantityProps = {
  initialValue: number;
};

export function useQuantity(
  {initialValue}: useQuantityProps = {initialValue: 1},
) {
  const [quantity, setQuantity] = useState(initialValue);

  const increment = useCallback(() => {
    setQuantity(q => q + 1);
  }, []);

  const decrement = useCallback(() => {
    setQuantity(q => Math.max(1, q - 1));
  }, []);

  return useMemo(
    () => ({
      quantity,
      increment,
      decrement,
      setQuantity,
    }),
    [quantity, increment, decrement],
  );
}
