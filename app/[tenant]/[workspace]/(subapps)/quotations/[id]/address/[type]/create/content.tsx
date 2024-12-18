'use client';

// ---- CORE IMPORTS ---- //
import {ADDRESS_TYPE} from '@/constants';
import {Country} from '@/types';
import {UserType} from '@/lib/core/auth/types';

// ---- LOCAL IMPORTS ---- //
import {AddressForm} from '@/subapps/quotations/common/ui/components';

function Content({
  quotation,
  type,
  countries = [],
  userType,
}: {
  quotation: any;
  type: ADDRESS_TYPE;
  countries?: Country[];
  userType: UserType;
}) {
  return (
    <AddressForm
      quotation={quotation}
      type={type}
      countries={countries}
      userType={userType}
    />
  );
}

export default Content;
