"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Divider,
  TextField,
  Button,
  Input,
  InputLabel,
  Select,
} from "@axelor/ui";

// ---- CORE IMPORTS ---- //
import { i18n } from "@/lib/i18n";
import type { Address, Country } from "@/types";

export type AddressFormProps = {
  values?: Partial<Address> & { multipletype?: boolean };
  countries: Country[];
  onSubmit: (event: React.FormEvent<any>, values: Partial<Address>) => void;
};

const defaultAddress = {
  addressl2: "",
  addressl3: "",
  addressl4: "",
  addressl6: "",
  multipletype: false,
};

export function AddressForm({
  values: valuesProp,
  countries,
  onSubmit,
}: AddressFormProps) {
  const [values, setValues] = useState(
    valuesProp || { ...defaultAddress, addressl7country: countries?.[0] }
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;

    setValues((v) => ({
      ...v,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<any>) => {
    onSubmit && onSubmit(event, values);
  };

  useEffect(() => {
    valuesProp && setValues(valuesProp);
  }, [valuesProp]);

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <Box bg="white" rounded={2} p={3} mt={2}>
        <Box as="h3">{i18n.get("Address Information")}</Box>
        <Divider my={2} />
        <Box d="flex" flexDirection="column" gap="1rem">
          <TextField
            label={i18n.get("Recipient details")}
            name="addressl2"
            value={values.addressl2}
            onChange={handleChange}
          />
          <TextField
            label={i18n.get("N° and Street label")}
            name="addressl4"
            value={values.addressl4}
            onChange={handleChange}
            required
          />
          <TextField
            label={i18n.get("Address precision")}
            name="addressl3"
            value={values.addressl3}
            onChange={handleChange}
          />
          <TextField
            label={i18n.get("Zip/City")}
            name="addressl6"
            value={values.addressl6}
            onChange={handleChange}
            required
          />

          <Box>
            <InputLabel>{i18n.get("Country")}</InputLabel>
            {/* @ts-expect-error */}
            <Select
              clearIcon={false}
              value={values.addressl7country}
              onChange={(o) =>
                setValues((v) => ({ ...v, addressl7country: o } as any))
              }
              options={countries}
              optionKey={(o: any) => o.id}
              optionLabel={(o: any) => o.name}
            />
          </Box>
          <Box d="flex" alignItems="center">
            <Input
              d="inline-block"
              type="checkbox"
              mt={0}
              me={2}
              name="multipletype"
              onChange={handleChange}
            />
            <InputLabel mb={0}>
              {i18n.get("Use this address for both billing and delivery")}
            </InputLabel>
          </Box>
        </Box>
      </Box>
      <Button variant="primary" w={100} rounded="pill" type="submit">
        {i18n.get("Save modifications")}
      </Button>
    </Box>
  );
}

export default AddressForm;
