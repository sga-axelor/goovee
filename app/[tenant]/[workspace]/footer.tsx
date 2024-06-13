'use client';
// ----- CORE IMPORTS ----- //
import {i18n} from '@/lib/i18n';

export default function Footer() {
  return (
    <p className="text-center p-2 mb-0">
      Copyright (c) {new Date().getFullYear()} Axelor.{' '}
      {i18n.get('All Rights Reserved')}.
    </p>
  );
}
