'use client';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/locale';
import {
  Checkbox,
  DropdownSelector,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
  Separator,
} from '@/ui/components';
import {City, Country} from '@/types';

interface AddressInformationProps {
  country: {
    id: string | number;
    name: string;
  };
  countries: Country[];
  cities: City[];
  form: any;
}

export function AddressInformation({
  countries,
  cities = [],
  form,
  country,
}: AddressInformationProps) {
  const handleCountryChange = (selectedOption: {id: string; name: string}) => {
    form.setValue('addressInformation.country', selectedOption, {
      shouldValidate: true,
    });
    form.trigger('addressInformation.country.id');
  };

  const handleCityChange = (selectedOption: {id: string; name: string}) => {
    form.setValue('addressInformation.city', selectedOption, {
      shouldValidate: true,
    });
    form.trigger('addressInformation.city.id');
  };

  return (
    <div className="bg-white py-4 px-6 rounded-lg">
      <h4 className="font-medium text-xl mb-0">
        {i18n.t('Address information')}
      </h4>
      <Separator className="my-2" />
      <div className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="addressInformation.country.id"
          render={({field}) => (
            <FormItem>
              <FormControl>
                <DropdownSelector
                  options={countries}
                  selectedValue={field.value}
                  isRequired={true}
                  label={i18n.t('Country')}
                  placeholder={i18n.t('Select a country')}
                  labelClassName="mb-0"
                  rootClassName="space-y-2"
                  hasError={
                    !!form.formState.errors?.addressInformation?.country?.id
                  }
                  onValueChange={handleCountryChange}
                />
              </FormControl>
              <FormMessage>
                {form.formState.errors?.addressInformation?.country && (
                  <span className="text-destructive">
                    {
                      form.formState.errors?.addressInformation?.country
                        ?.message
                    }
                  </span>
                )}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="addressInformation.streetName"
          render={({field}) => (
            <FormItem>
              <FormLabel>
                {i18n.t('Street name and number')}
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={i18n.t('Enter street name and number')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="addressInformation.addressAddition"
          render={({field}) => (
            <FormItem>
              <FormLabel>{i18n.t('Address addition')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={i18n.t('Enter address addition')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="addressInformation.zip"
            render={({field}) => (
              <FormItem>
                <FormLabel>
                  {i18n.t('Zip code')}
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder={i18n.t('Enter zip code')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="addressInformation.city.id"
            render={({field}) => (
              <FormItem className="md:col-span-2">
                <FormControl>
                  <DropdownSelector
                    options={cities || []}
                    selectedValue={field.value}
                    isRequired={true}
                    label={i18n.t('City')}
                    placeholder={i18n.t('Select city')}
                    labelClassName="mb-0"
                    rootClassName="space-y-2"
                    disabled={!country.id}
                    hasError={
                      !!form.formState.errors?.addressInformation?.city?.id
                    }
                    onValueChange={handleCityChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="addressInformation.multipletype"
          render={({field}) => (
            <FormItem>
              <div className="flex items-center space-x-2">
                <Checkbox
                  onCheckedChange={checked => field.onChange(checked)}
                  checked={field.value}
                  className={`${field.value ? '!bg-success !border-success' : ''}`}
                />
                <Label className="ml-2">
                  {i18n.t('Use this address for both invoicing and delivery')}
                </Label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

export default AddressInformation;
