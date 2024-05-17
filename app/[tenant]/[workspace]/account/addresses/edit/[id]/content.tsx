"use client";

import { Box } from "@axelor/ui";

// ---- CORE IMPORTS ---- //
import { i18n } from "@/lib/i18n";
import { AddressForm } from "@/ui/components";
import type { PartnerAddress, Country, Address } from "@/types";

// ---- LOCAL IMPORTS ---- //
import { updateAddress } from "./actions";

export default function Content({
  id,
  partnerAddress,
  countries,
}: {
  id: string;
  partnerAddress: PartnerAddress;
  countries: Country[];
}) {
  const { address } = partnerAddress;

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    values: Partial<Address> & { multipletype?: boolean }
  ) => {
    event.preventDefault();

    let isDeliveryAddr = partnerAddress.isDeliveryAddr,
      isInvoicingAddr = partnerAddress.isInvoicingAddr;

    if (values.multipletype) {
      isDeliveryAddr = true;
      isInvoicingAddr = true;
    }

    const { multipletype, addressl7country, ...address } = values;

    const _address = await updateAddress({
      id,
      address: {
        ...address,
        addressl7country: addressl7country?.id,
        formattedFullName: address.addressl2,
        fullName: address.addressl2,
      } as Address,
      isInvoicingAddr,
      isDeliveryAddr,
    });
  };

  return (
    <>
      <Box as="h2" mb={3}>
        <b>{i18n.get("Edit Address")}</b>
      </Box>
      <AddressForm
        onSubmit={handleSubmit}
        countries={countries}
        values={{
          ...address,
          multipletype:
            partnerAddress.isDeliveryAddr && partnerAddress.isInvoicingAddr,
        }}
      />
    </>
  );
}
