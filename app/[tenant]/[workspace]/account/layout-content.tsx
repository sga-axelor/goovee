'use client';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/core/i18n';
import {useSearchParams} from '@/ui/hooks';

// ---- LOCAL IMPORTS ---- //
import Sidebar from './sidebar';

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
              {i18n.get(`Quotation number ${quotation}`)}
            </h4>
          )}
          {checkout && (
            <h4 className="font-medium text-xl">{i18n.get('Confirm cart')}</h4>
          )}
          <div className="overflow-auto flex flex-col gap-6">{children}</div>
        </>
      ) : (
        <>
          <h4 className="text-xl font-semibold">
            {i18n.get('Profile Settings')}
          </h4>
          <div className="grid grid-cols-[15%_1fr] bg-white rounded-md pe-6 py-4 gap-4">
            <Sidebar isAdmin={isAdmin} />
            <div className="overflow-auto">{children}</div>
          </div>
        </>
      )}
    </>
  );
}
