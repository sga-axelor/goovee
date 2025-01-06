'use client';
// ---- CORE IMPORTS ---- //
import {i18n} from '@/locale';

export default function Content() {
  return (
    <div className="px-4 md:px-12 py-2 md:py-4">
      <h2 className="text-3xl font-bold text-foreground mb-4">
        {i18n.t('Notifications')}
      </h2>
    </div>
  );
}
