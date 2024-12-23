'use client';

import React, {useEffect, useState} from 'react';
import {useParams} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {useAppLang} from '@/ui/hooks';
import {i18n} from '@/i18n';
import {Loader} from '@/ui/components/loader';

export default function Locale({children}: {children: React.ReactNode}) {
  const {dir, lang} = useAppLang();
  const params = useParams<{tenant: string}>();
  const [loading, setLoading] = useState(true);

  const tenant = params?.tenant;

  useEffect(() => {
    if (!tenant) {
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        await i18n.load(lang, tenant);
        document.documentElement.lang = lang;
        document.documentElement.dir = dir;
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [dir, lang, tenant]);

  if (loading) {
    return <Loader />;
  }

  return <>{children}</>;
}
