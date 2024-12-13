'use client';

import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';

// ---- CORE IMPORTS ---- //
import {capitalise} from '@/utils';
import {ADDRESS_TYPE} from '@/constants';
import {i18n} from '@/lib/core/i18n';
import {Button, Form} from '@/ui/components';
import {UserType} from '@/lib/core/auth/types';
import {Country} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {
  AddressInformation,
  PersonalInformation,
} from '@/subapps/quotations/common/ui/components';

const personalInformationSchema = z
  .object({
    type: z.nativeEnum(UserType),
    firstName: z.string().min(1, 'First name is required'),
    name: z.string(),
    companyName: z.string(),
    emailAddress: z
      .string()
      .optional()
      .refine(
        val =>
          val === '' ||
          (val !== undefined && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)),
        {
          message: 'Invalid email address format',
        },
      ),
    fixedPhone: z.string().optional(),
  })
  .refine(
    data => {
      if (data.type === UserType.company) {
        if (!data.companyName) return false;
      }
      return true;
    },
    {
      message: i18n.get('Company name is required'),
      path: ['companyName'],
    },
  )
  .refine(
    data => {
      if (data.type === UserType.individual) {
        if (!data.name) return false;
      }
      return true;
    },
    {
      message: i18n.get('Name is required'),
      path: ['name'],
    },
  );

const addressInformationSchema = z.object({
  country: z.string().min(1, 'Country is required'),
  streetName: z.string().min(1, 'Street name is required'),
  countrySubDivision: z.string().min(1, 'State is required'),
  zip: z.string().min(1, 'Zip code is required'),
  city: z.string().min(1, 'City is required'),
  multipletype: z.boolean().default(false),
});

const formSchema = z.object({
  personalInformation: personalInformationSchema,
  addressInformation: addressInformationSchema,
});

function Content({
  type,
  userType,
  countries = [],
}: {
  type: ADDRESS_TYPE;
  userType: UserType;
  countries?: Country[];
}) {
  const title = `${capitalise(type)} Address`;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personalInformation: {
        type: userType,
        companyName: '',
        firstName: '',
        name: '',
        emailAddress: '',
        fixedPhone: '',
      },
      addressInformation: {
        country: '',
        streetName: '',
        countrySubDivision: '',
        zip: '',
        city: '',
        multipletype: false,
      },
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('Submitted Values:', values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4">
        <div className="font-medium text-xl">{title}</div>
        <div className="flex flex-col gap-4">
          <PersonalInformation userType={userType} form={form} />
          <AddressInformation countries={countries} form={form} />
        </div>

        <Button
          onClick={e => {
            e.preventDefault();
            form.handleSubmit(onSubmit)();
          }}
          className="w-full bg-success hover:bg-success-dark py-1.5">
          {i18n.get('Create address')}
        </Button>
      </form>
    </Form>
  );
}

export default Content;
