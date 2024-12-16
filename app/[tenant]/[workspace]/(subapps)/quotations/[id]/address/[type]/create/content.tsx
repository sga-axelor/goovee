'use client';

// ---- CORE IMPORTS ---- //
import {ADDRESS_TYPE} from '@/constants';
import {Country} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {AddressForm} from '@/subapps/quotations/common/ui/components';

function Content({
  quotation,
  type,
  countries = [],
}: {
  quotation: any;
  type: ADDRESS_TYPE;
  countries?: Country[];
}) {
  return (
    <AddressForm quotation={quotation} type={type} countries={countries} />
  );
}

export default Content;
