'use client';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/locale';
import {useSearchParams} from '@/ui/hooks';

// ---- LOCAL IMPORTS ---- //
import Menubar from './menubar';

export default function LayoutContent({
  children,
  isAdmin,
}: {
  children: React.ReactNode;
  isAdmin: boolean;
}) {
  const {searchParams} = useSearchParams();
  const quotation = searchParams.get('quotation') || '';
  const checkout = searchParams.get('checkout') || '';

  return (
    <>
      {quotation || checkout ? (
        <>
          {quotation && (
            <h4 className="font-medium text-xl">
              {i18n.t(`Quotation number ${quotation}`)}
            </h4>
          )}
          {checkout && (
            <h4 className="font-medium text-xl">{i18n.t('Confirm cart')}</h4>
          )}
          <div className="overflow-auto flex flex-col gap-6">{children}</div>
        </>
      ) : (
        <>
          <h4 className="hidden lg:block text-xl font-semibold">
            {i18n.t('Profile Settings')}
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-[15%_1fr] lg:bg-white rounded-md p-0 lg:pe-6 lg:py-4 gap-4">
            <Menubar isAdmin={isAdmin} />
            <div className="overflow-auto lg:p-0 lg:bg-inherit">{children}</div>
          </div>
        </>
      )}
    </>
  );
}
