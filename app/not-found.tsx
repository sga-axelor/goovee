import Link from 'next/link';
import {Button} from '@/ui/components';
import {i18n} from '@/lib/i18n';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="space-y-2">
        <div className="space-y-1">
          <h2 className="text-3xl">404 | {i18n.get('Not Found')}</h2>
          <p className="text-muted-foreground">
            {i18n.get('Could not find the requested resource')}
          </p>
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
