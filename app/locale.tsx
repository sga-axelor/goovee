'use client';

import React, {useEffect} from 'react';

// ---- CORE IMPORTS ---- //
import {useAppLang} from '@/ui/hooks';
import {i18n} from '@/lib/i18n';
import {useRouter} from 'next/navigation';

export default function Locale({children}: {children: React.ReactNode}) {
  const {dir, lang} = useAppLang();
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        await i18n.load(lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = dir;
        router.refresh();
      } catch (err) {
      } finally {
      }
    };
    load();
  }, [dir, lang, router]);

  return <>{children}</>;
}
