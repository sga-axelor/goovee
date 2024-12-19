'use client';

// ---- CORE IMPORTS ---- //
import {ADDRESS_TYPE} from '@/constants';
import {Country} from '@/types';
import {UserType} from '@/lib/core/auth/types';

// ---- LOCAL IMPORTS ---- //
import {AddressForm} from '@/app/[tenant]/[workspace]/account/address/common/ui/components';

function Content({
  type,
  countries = [],
  userType,
}: {
  type: ADDRESS_TYPE;
  countries?: Country[];
  userType: UserType;
}) {
  return <AddressForm type={type} countries={countries} userType={userType} />;
}

export default Content;
