import {i18n} from '@/locale';

export function NotFound() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="space-y-2">
        <div className="space-y-1">
          <h2 className="text-3xl">404 | {i18n.t('Not Found')}</h2>
          <p className="text-muted-foreground">
            {i18n.t('Page not available')}
          </p>
        </div>
      </div>
    </div>
  );
}
