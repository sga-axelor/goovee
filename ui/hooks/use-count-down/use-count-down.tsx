'use client';

import {useEffect, useState, useCallback} from 'react';

function calculateTimeRemaining(expiryTime: number) {
  const now = new Date().getTime();
  return Math.max(expiryTime - now, 0);
}

export function useCountDown(initialMinutes: number) {
  const [expiryTime, setExpiryTime] = useState(
    () => new Date().getTime() + initialMinutes * 60000,
  );

  const [timeRemaining, setTimeRemaining] = useState(
    calculateTimeRemaining(expiryTime),
  );

  const [isExpired, setIsExpired] = useState(!initialMinutes ? true : false);

  const reset = useCallback(
    (minutes = initialMinutes) => {
      const newExpiryTime = new Date().getTime() + minutes * 60000;

      setExpiryTime(newExpiryTime);
      setTimeRemaining(calculateTimeRemaining(newExpiryTime));
      setIsExpired(false);
    },
    [initialMinutes],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining(expiryTime);
      setTimeRemaining(remaining);
      setIsExpired(remaining <= 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryTime]);

  const formattedTime = useCallback(() => {
    const minutes = Math.floor(timeRemaining / 60000);
    const seconds = Math.floor((timeRemaining % 60000) / 1000);
    return {minutes, seconds};
  }, [timeRemaining]);

  return {timeRemaining: formattedTime(), isExpired, reset};
}

export default useCountDown;
