'use client';

// ---- CORE IMPORTS ---- //
import {ADDRESS_TYPE} from '@/constants';
import {Country} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {AddressForm} from '@/subapps/quotations/common/ui/components';

function Content({
  quotation,
  address,
  type,
  countries = [],
}: {
  quotation: any;
  address: any;
  countries?: Country[];
  type: ADDRESS_TYPE;
}) {
  return (
    <AddressForm
      quotation={quotation}
      address={address}
      type={type}
      countries={countries}
    />
  );
}

export default Content;
