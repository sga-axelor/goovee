'use client';

// ---- CORE IMPORTS ---- //
import {ADDRESS_TYPE} from '@/constants';
import {Country} from '@/types';
import {UserType} from '@/lib/core/auth/types';

// ---- LOCAL IMPORTS ---- //
import {AddressForm} from '@/app/[tenant]/[workspace]/account/addresses/common/ui/components';

function Content({
  address,
  type,
  countries = [],
  userType,
}: {
  address: any;
  countries?: Country[];
  userType: UserType;
  type: ADDRESS_TYPE;
}) {
  return (
    <AddressForm
      address={address}
      type={type}
      countries={countries}
      userType={userType}
    />
  );
}

export default Content;
