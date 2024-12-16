'use client';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/core/i18n';
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
import {Country} from '@/types';

interface AddressInformationProps {
  countries: Country[];
  form: any;
}

export function AddressInformation({countries, form}: AddressInformationProps) {
  const handleCountryChange = (selectedOption: {id: string; name: string}) => {
    form.setValue('addressInformation.country', selectedOption);
  };

  return (
    <div className="bg-white py-4 px-6 rounded-lg">
      <h4 className="font-medium text-xl mb-0">
        {i18n.get('Address information')}
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
                  onValueChange={handleCountryChange}
                  isRequired={true}
                  label={i18n.get('Country')}
                  placeholder={i18n.get('Select a country')}
                  labelClassName="mb-0"
                  rootClassName="space-y-2"
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
                {i18n.get('Street name and number')}
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={i18n.get('Enter street name and number')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="addressInformation.state"
          render={({field}) => (
            <FormItem>
              <FormLabel>
                {i18n.get('State')}
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder={i18n.get('Enter state')} {...field} />
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
                  {i18n.get('Zip code')}
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder={i18n.get('Enter zip code')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="addressInformation.city"
            render={({field}) => (
              <FormItem className="md:col-span-2">
                <FormLabel>
                  {i18n.get('City')}
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder={i18n.get('Enter city')} {...field} />
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
                  {i18n.get('Use this address for both invoicing and delivery')}
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
