'use client';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/core/i18n';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Separator,
} from '@/ui/components';
import {UserType} from '@/lib/core/auth/types';

interface PersonalInformationProps {
  userType: UserType;
  form: any;
}

export function PersonalInformation({
  userType,
  form,
}: PersonalInformationProps) {
  const isCompany = userType === UserType.company;

  return (
    <div className="bg-white py-4 px-6 rounded-lg">
      <h4 className="font-medium text-xl mb-0">
        {i18n.get('Personal information')}
      </h4>
      <Separator className="my-2" />
      <div className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="personalInformation.addressName"
          render={({field}) => (
            <FormItem>
              <FormLabel>{i18n.get('Address name')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={i18n.get('Enter address name')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="personalInformation.firstName"
          render={({field}) => (
            <FormItem>
              <FormLabel>
                {i18n.get('First name')}
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder={i18n.get('Enter first name')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="personalInformation.lastName"
          render={({field}) => (
            <FormItem>
              <FormLabel>
                {i18n.get('Last name')}
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder={i18n.get('Enter last name')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isCompany && (
          <FormField
            control={form.control}
            name="personalInformation.companyName"
            render={({field}) => (
              <FormItem>
                <FormLabel>{i18n.get('Company name')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={i18n.get('Enter company name')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  );
}

export default PersonalInformation;
