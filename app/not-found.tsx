'use client';

import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import {Button} from '@/ui/components';
import {i18n} from '@/i18n';

export default function NotFound() {
  const searchParams = useSearchParams();
  const searchParamMessage = searchParams.get('message');

  const message = searchParamMessage
    ? decodeURIComponent(searchParamMessage)
    : i18n.get('Could not find the requested resource');

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="space-y-2">
        <div className="space-y-1">
          <h2 className="text-3xl">404 | {i18n.get('Not Found')}</h2>
          <p className="text-muted-foreground">{message}</p>
        </div>
        <div>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
