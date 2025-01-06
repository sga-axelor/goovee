'use client';

import React, {useCallback, useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';

// ---- CORE IMPORTS ---- //
import {useAppLang} from '@/ui/hooks';
import {i18n, l10n} from '@/locale';
import {useParams} from 'next/navigation';

export default function Locale({children}: {children: React.ReactNode}) {
  const [loading, setLoading] = useState<boolean>(true);
  const params = useParams();
  const tenant = params?.tenant;

  const {data: session} = useSession();
  const user = session?.user;
  const locale = user?.locale;

  const {dir, lang} = useAppLang({locale});

  const init = useCallback(async (locale?: string, tenant?: string) => {
    setLoading(true);
    await l10n.init(locale);
    await i18n.load(l10n.getLocale(), tenant);
    setLoading(false);
  }, []);

  useEffect(() => {
    init(locale, tenant as string);
  }, [init, locale, tenant]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [dir, lang]);

  if (loading) return null;

  return <>{children}</>;
}
