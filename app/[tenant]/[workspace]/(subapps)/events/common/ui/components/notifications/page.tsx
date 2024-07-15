'use client';

import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import {useWindowSize} from 'usehooks-ts';

// ---- LOCAL IMPORTS ---- //
import {Notifications} from '@/app/events/common/ui/components/notifications/components';

const NotificationsPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const {width} = useWindowSize();
  const router = useRouter();
  useEffect(() => {
    setIsMounted(true);
    if (width >= 960) return router.push('/');
  }, [width, router]);
  return (
    <div
      className="dark:bg-slate-950  "
      style={{height: 'calc(100vh - 3.75rem)'}}>
      <Notifications />
    </div>
  );
};

export default NotificationsPage;
