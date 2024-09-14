'use client';

import React, {useEffect} from 'react';
import {useParams, useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {useAppLang} from '@/ui/hooks';
import {i18n} from '@/i18n';

export default function Locale({children}: {children: React.ReactNode}) {
  const {dir, lang} = useAppLang();
  const router = useRouter();
  const params = useParams<{tenant: string}>();

  const tenant = params?.tenant;

  useEffect(() => {
    if (!tenant) return;

    const load = async () => {
      try {
        await i18n.load(lang, tenant);
        document.documentElement.lang = lang;
        document.documentElement.dir = dir;
        router.refresh();
      } catch (err) {
      } finally {
      }
    };
    load();
  }, [dir, lang, tenant, router]);

  return <>{children}</>;
}
