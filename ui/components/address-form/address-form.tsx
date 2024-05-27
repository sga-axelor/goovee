"use client";

import { useState, useEffect } from "react";

// ---- CORE IMPORTS ---- //
import { i18n } from "@/lib/i18n";
import type { Address, Country } from "@/types";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CheckedState } from "@radix-ui/react-checkbox";
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

export function AddressForm({ values: valuesProp, countries, onSubmit }: AddressFormProps) {
  const [values, setValues] = useState(valuesProp || { ...defaultAddress, addressl7country: countries?.[0] });
  const [selectedValue, setSelectedValue] = useState<String>(countries?.[0].id.toString());

  const handleCheckbox = (event: any) => {
    setValues((v) => ({
      ...v,
      multipletype: event,
    }));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = event.target;
    setValues((v) => ({
      ...v,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<any>) => {
    onSubmit && onSubmit(event, values);
  };

  useEffect(() => {
    valuesProp && setValues(valuesProp);
  }, [valuesProp]);

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <h3>{i18n.get("Address Information")}</h3>
        <Separator className="my-2" />
        <div>
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

          <div className="w-full mb-4">
            <Label className="text-base font-medium text-primary mb-1">{i18n.get("Country")}</Label>
            <Select
              onValueChange={(o) => {
                let selectedCountry = countries?.find((op) => op.id === o);
                setSelectedValue(o);
                setValues((v) => ({ ...v, addressl7country: selectedCountry } as any));
              }}
              defaultValue={selectedValue as string | undefined}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Country</SelectLabel>
                  {countries.map((op: any) => {
                    return (
                      <SelectItem key={op?.id} value={op.id}>
                        {op?.name}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2 mb-6">
            <Checkbox
              onCheckedChange={handleCheckbox}
              name="multipletype"
              checked={values.multipletype}
            />
            <Label className="ml-2 text-primary">{i18n.get("Use this address for both billing and delivery")}</Label>
          </div>
        </div>
      </div>
      <Button type="submit" className="rounded-full">
        {i18n.get("Save modifications")}
      </Button>
    </form>
  );
}

export default AddressForm;
