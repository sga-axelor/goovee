'use client';

import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {capitalise} from '@/utils';
import {ADDRESS_TYPE, SUBAPP_CODES, SUBAPP_PAGE} from '@/constants';
import {i18n} from '@/lib/core/i18n';
import {Button, Form} from '@/ui/components';
import {Country} from '@/types';
import {useToast} from '@/ui/hooks';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

// ---- LOCAL IMPORTS ---- //
import {
  AddressInformation,
  PersonalInformation,
} from '@/subapps/quotations/common/ui/components';
import {createAddress} from '@/app/[tenant]/[workspace]/account/addresses/[type]/create/actions';
import {updateAddress} from '@/app/[tenant]/[workspace]/account/addresses/edit/[id]/actions';

const personalInformationSchema = z.object({
  addressName: z.string().optional(),
  firstName: z.string().min(1, i18n.get('First name is required')),
  lastName: z.string(),
  companyName: z.string(),
});

const addressInformationSchema = z.object({
  country: z.object({
    id: z.string().min(1, 'Country ID is required'),
    name: z.string().min(1, i18n.get('Country name is required')),
  }),
  streetName: z.string().min(1, i18n.get('Street name is required')),
  state: z.string().min(1, i18n.get('State is required')),
  zip: z.string().min(1, i18n.get('Zip code is required')),
  city: z.string().min(1, i18n.get('City is required')),
  multipletype: z.boolean().default(false),
});

const formSchema = z.object({
  personalInformation: personalInformationSchema,
  addressInformation: addressInformationSchema,
});
export const AddressForm = ({
  quotation,
  type,
  countries = [],
  address = null,
}: {
  quotation: any;
  type: ADDRESS_TYPE;
  countries?: Country[];
  address?: any;
}) => {
  const title = i18n.get(`${capitalise(type)} Address`);

  const {toast} = useToast();
  const router = useRouter();
  const {workspaceURI} = useWorkspace();

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
        state: address?.countrySubDivision ?? '',
        zip: address?.zip ?? '',
        city: address?.addressl6 ?? '',
        multipletype: false,
      },
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const {addressInformation, personalInformation} = values;
    const {multipletype, city, country, state, streetName, zip} =
      addressInformation;
    const {addressName, firstName, lastName, companyName} = personalInformation;

    const isDeliveryAddr = multipletype || type === ADDRESS_TYPE.delivery;
    const isInvoicingAddr = multipletype || type === ADDRESS_TYPE.invoicing;

    const computeFullName = () => {
      return [streetName, state, zip, city]
        .filter(Boolean)
        .join(' ')
        .toUpperCase();
    };

    const formattedFullName = () => {
      return [streetName, state, zip, city, country?.name]
        .filter(Boolean)
        .join('\n')
        .toUpperCase();
    };

    const addressBody = {
      ...(address ? {id: address.id} : {}),
      country: country.id,
      addressl2: addressName,
      addressl4: streetName,
      addressl3: state,
      addressl6: city,
      zip,
      streetName,
      countrySubDivision: state,
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
        router.push(
          `${workspaceURI}/${SUBAPP_CODES.quotations}/${quotation.id}/${SUBAPP_PAGE.address}`,
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

  console.log('address >>>', address);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4">
        <div className="font-medium text-xl">{title}</div>
        <div className="flex flex-col gap-4">
          <PersonalInformation form={form} />
          <AddressInformation countries={countries} form={form} />
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
