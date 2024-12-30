'use client';

import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';

// ---- CORE IMPORTS ---- //
import {capitalise} from '@/utils';
import {ADDRESS_TYPE, SUBAPP_PAGE} from '@/constants';
import {i18n} from '@/lib/core/i18n';
import {Button, Form} from '@/ui/components';
import {Country} from '@/types';
import {useSearchParams, useToast} from '@/ui/hooks';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {UserType} from '@/lib/core/auth/types';
import {useCart} from '@/app/[tenant]/[workspace]/cart-context';

// ---- LOCAL IMPORTS ---- //
import {
  AddressInformation,
  PersonalInformation,
} from '@/app/[tenant]/[workspace]/account/addresses/common/ui/components';
import {
  fetchCities,
  createAddress,
  updateAddress,
} from '@/app/[tenant]/[workspace]/account/addresses/common/actions/action';

const personalInformationSchema = z.object({
  addressName: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string(),
  companyName: z.string(),
});

const addressInformationSchema = z.object({
  country: z.object({
    id: z.string().min(1, 'Country is required'),
    name: z.string().min(1, i18n.get('Country name is required')),
  }),
  streetName: z.string().min(1, i18n.get('Street name is required')),
  addressAddition: z.string().optional(),
  zip: z
    .string()
    .min(1, i18n.get('Zip code is required'))
    .regex(/^\d+$/, i18n.get('Zip code must contain only numbers')),
  city: z.object({
    id: z.string().min(1, 'City is required'),
    name: z.string().min(1, i18n.get('City name is required')),
  }),
  multipletype: z.boolean().default(false),
});

const formSchema = z.object({
  personalInformation: personalInformationSchema,
  addressInformation: addressInformationSchema,
});

export const AddressForm = ({
  type,
  countries = [],
  address = null,
  userType,
}: {
  type: ADDRESS_TYPE;
  countries?: Country[];
  address?: any;
  userType: UserType;
}) => {
  const [cities, setCities] = useState([]);
  const title = i18n.get(`${capitalise(type)} Address`);
  const isCompany = userType === UserType.company;

  const {toast} = useToast();
  const router = useRouter();
  const {updateAddress: updateCartAddress} = useCart();
  
  const {searchParams} = useSearchParams();
  const queryString = new URLSearchParams(searchParams).toString();

  const checkout = searchParams.get('checkout') === 'true';
  const quotation = searchParams.get('quotation') ?? '';

  const {workspaceURI, workspaceURL} = useWorkspace();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personalInformation: {
        addressName: address?.addressl2 ?? '',
        firstName: address?.firstName ?? '',
        lastName: address?.lastName ?? '',
        companyName: address?.companyName ?? '',
      },
      addressInformation: {
        country: {
          id: address?.country?.id ?? '',
          name: address?.country?.name ?? '',
        },
        streetName: address?.streetName ?? '',
        addressAddition: address?.countrySubDivision ?? '',
        zip: address?.zip ?? '',
        city: {
          id: address?.city?.id ?? '',
          name: address?.city?.id ?? '',
        },
        multipletype: false,
      },
    },
  });

  const country = form.watch('addressInformation.country');

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const {addressInformation, personalInformation} = values;
    const {multipletype, city, country, addressAddition, streetName, zip} =
      addressInformation;
    const {addressName, firstName, lastName, companyName} = personalInformation;

    const isDeliveryAddr = multipletype || type === ADDRESS_TYPE.delivery;
    const isInvoicingAddr = multipletype || type === ADDRESS_TYPE.invoicing;

    const computeFullName = () => {
      return [streetName, addressAddition, zip, city?.name]
        .filter(Boolean)
        .join(' ')
        .toUpperCase();
    };

    const formattedFullName = () => {
      return [streetName, addressAddition, zip, city?.name, country?.name]
        .filter(Boolean)
        .join('\n')
        .toUpperCase();
    };

    const addressBody = {
      ...(address ? {id: address.id} : {}),
      country: country.id,
      addressl2: addressName,
      addressl4: streetName,
      addressl3: addressAddition,
      addressl6: city.name,
      zip,
      city: city.id,
      streetName,
      countrySubDivision: addressAddition,
      department: addressName,
      fullName: computeFullName(),
      formattedFullName: formattedFullName(),
      firstName,
      lastName,
      companyName,
    };

    try {
      const action = address ? updateAddress : createAddress;
      const result = await action({
        address: addressBody as any,
        isInvoicingAddr,
        isDeliveryAddr,
      });

      if (result) {
        if (checkout) {
          updateCartAddress({
            addressType: type,
            address: result?.id,
          });
        }
        router.push(
          `${workspaceURI}/${SUBAPP_PAGE.account}/${SUBAPP_PAGE.addresses}?${queryString}`,
        );
      }

      toast({
        variant: result ? 'success' : 'destructive',
        title: result
          ? i18n.get(`Address information saved successfully!`)
          : i18n.get(
              `Something went wrong while ${address ? 'saving' : 'creating'} the address!`,
            ),
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: 'destructive',
        title: i18n.get(
          `Error while ${address ? 'saving' : 'creating'} address`,
        ),
      });
    }
  };

  useEffect(() => {
    const getCities = async () => {
      if (!country.id) {
        return;
      }

      try {
        const response: any = await fetchCities({
          countryId: country.id,
          workspaceURL,
        });
        if (response.success) {
          setCities(response.data);
        } else {
          setCities([]);
        }
      } catch (error) {
        console.error('Unexpected error while fetching cities:', error);
        setCities([]);
      }
    };

    getCities();
  }, [country, workspaceURL]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="font-medium text-xl">{title}</div>
          <PersonalInformation form={form} isCompany={isCompany} />
          <AddressInformation
            countries={countries}
            form={form}
            cities={cities}
            country={country}
          />
        </div>

        <Button
          className="w-full bg-success hover:bg-success-dark py-1.5"
          disabled={form.formState.isSubmitting}
          onClick={e => {
            e.preventDefault();
            form.handleSubmit(onSubmit)();
          }}>
          {address ? i18n.get('Save changes') : i18n.get('Create address')}
        </Button>
      </form>
    </Form>
  );
};

export default AddressForm;
