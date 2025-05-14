'use client';
import {usePathname} from 'next/navigation';
import {useEffect, useState} from 'react';
import ThemeProvider from '@/subapps/website/common/theme/ThemeProvider';
import '/public/scss/scoped.scss';

export function TemplateRoot({children}: {children: React.ReactNode}) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  // added bootstrap functionality
  useEffect(() => {
    if (typeof window !== 'undefined') import('bootstrap');
  }, []);

  // scroll animation added
  useEffect(() => {
    (async () => {
      const scrollCue = (
        await import('@/subapps/website/common/plugins/scrollcue')
      ).default;
      scrollCue.init({interval: -400, duration: 700, percentage: 0.8});
      scrollCue.update();
    })();
  }, [pathname]);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="gv relative">
      <ThemeProvider>
        {/* <div className="page-loader" /> */}
        {loading ? <div className="page-loader" /> : children}
      </ThemeProvider>
    </div>
  );
}
