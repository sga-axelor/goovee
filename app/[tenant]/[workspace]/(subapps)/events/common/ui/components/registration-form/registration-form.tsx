'use client';

import {useMemo} from 'react';
import {useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/components/card';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {i18n} from '@/locale';
import {
  FormView,
  ArrayComponent,
  extractCustomData,
  formatStudioFields,
} from '@/ui/form';
import {useToast} from '@/ui/hooks/use-toast';
import {SUBAPP_CODES} from '@/constants';
import {BadgeList} from '@/ui/components';

// ---- LOCAL IMPORTS ---- //
import {
  CustomSelect,
  EventDateCard,
  FacilitiesPriceView,
  FacilitiesView,
} from '@/subapps/events/common/ui/components';
import type {EventPageCardProps} from '@/subapps/events/common/ui/components';
import {register} from '@/subapps/events/common/actions/actions';
import {SUCCESS_REGISTER_MESSAGE} from '@/subapps/events/common/constants';

export const RegistrationForm = ({
  eventDetails,
  metaFields = [],
  workspace,
  user,
}: EventPageCardProps) => {
  const {
    defaultPrice = null,
    formattedDefaultPrice = null,
    displayAtiPrice = null,
    facilityList = [],
    eventTitle = '',
    eventStartDateTime,
    eventEndDateTime,
    eventAllDay = false,
    eventCategorySet = [],
    eventAllowMultipleRegistrations = false,
    id: eventId,
    eventProduct = null,
  } = eventDetails || {};

  const router = useRouter();
  const {workspaceURI} = useWorkspace();
  const {toast} = useToast();

  const isLoggedIn = !!user?.emailAddress;
  const showContactsList = isLoggedIn && !user.isContact;

  const buttonTitle = i18n.t(
    `Register${defaultPrice || !facilityList?.length ? ' and pay' : ''}`,
  );

  const basicPerson = useMemo(
    () => [
      {
        name: 'name',
        title: i18n.t('Name'),
        type: 'string',
        widget: null,
        helper: i18n.t('Enter name'),
        hidden: false,
        required: true,
        readonly: false,
        order: 1,
        defaultValue: user.firstName || '',
      },
      {
        name: 'surname',
        title: i18n.t('Surname'),
        type: 'string',
        widget: null,
        helper: i18n.t('Enter surname'),
        hidden: false,
        required: true,
        readonly: false,
        order: 2,
        defaultValue: user?.name || '',
      },
      {
        name: 'company',
        title: i18n.t('Company'),
        type: 'string',
        widget: null,
        helper: i18n.t('Enter company name'),
        hidden: false,
        required: false,
        readonly: false,
        order: 3,
        defaultValue: '',
      },
      {
        name: 'emailAddress',
        title: i18n.t('Email'),
        type: 'string',
        widget: 'email',
        helper: i18n.t('Enter email'),
        hidden: false,
        required: true,
        readonly: isLoggedIn,
        order: 4,
        defaultValue: user?.emailAddress?.address || '',
      },
      {
        name: 'phone',
        title: i18n.t('Phone'),
        type: 'string',
        widget: 'phone',
        helper: i18n.t('Enter phone number'),
        hidden: false,
        required: true,
        readonly: false,
        order: 5,
        defaultValue: user?.fixedPhone || '',
      },
      {
        name: 'facilities',
        title: null,
        type: 'array',
        widget: 'custom',
        hidden: !facilityList.length,
        order: 6,
        customComponent: (props: any) => (
          <FacilitiesView
            {...props}
            list={facilityList}
            onFacilityChange={(selectedFacilities: any) => {
              props.form.setValue('facilities', selectedFacilities);
            }}
          />
        ),
      },
    ],
    [
      isLoggedIn,
      user?.emailAddress?.address,
      user.firstName,
      user?.fixedPhone,
      user?.name,
      facilityList,
    ],
  );

  const participantForm = useMemo(
    () => [...basicPerson, ...formatStudioFields(metaFields)],
    [basicPerson, metaFields],
  );

  const externalParticipantForm = useMemo(
    () => [
      ...participantForm,
      {
        name: 'valueId',
        title: null,
        type: 'number',
        hidden: true,
      },
      {
        name: 'fromParticipant',
        title: null,
        type: 'boolean',
        hidden: true,
      },
    ],
    [participantForm],
  );

  const multipleRegistrationForm = useMemo(
    () => [
      ...participantForm,
      {
        name: 'addOtherPeople',
        title: i18n.t('Register other people to this event'),
        type: 'boolean',
        widget: null,
        helper: null,
        hidden: false,
        required: false,
        readonly: false,
        order: 100,
      },
      ...(showContactsList
        ? [
            {
              name: 'users',
              title: null,
              type: 'array',
              widget: 'custom',
              helper: null,
              hidden: false,
              hideIf: (formState: any) => !formState?.addOtherPeople,
              required: false,
              readonly: false,
              order: 110,
              customComponent: (props: any) =>
                CustomSelect({
                  ...props,
                  arrayName: 'otherPeople',
                  subSchema: externalParticipantForm,
                }),
            },
          ]
        : []),
      {
        name: 'otherPeople',
        title: 'Other people',
        type: 'array',
        widget: 'custom',
        helper: null,
        hidden: false,
        hideIf: (formState: any) => !formState?.addOtherPeople,
        required: false,
        readonly: false,
        order: 120,
        customComponent: (props: any) =>
          ArrayComponent({
            ...props,
            addTitle: 'Add a new person that does not have an account',
          }),
        subSchema: externalParticipantForm.map(field =>
          field.name === 'emailAddress'
            ? {...field, readonly: false}
            : field.name === 'facilities'
              ? {
                  ...field,
                  customComponent: (props: any) => (
                    <FacilitiesView
                      {...props}
                      list={facilityList}
                      isSecondary
                    />
                  ),
                }
              : field,
        ),
      },
    ],
    [participantForm, showContactsList, externalParticipantForm, facilityList],
  );

  const onSubmit = async (values: any) => {
    try {
      const result = extractCustomData(values, 'contactAttrs', metaFields);

      if (isLoggedIn) result.emailAddress = user?.emailAddress?.address;
      if (!result.addOtherPeople) {
        result.otherPeople = [];
      } else {
        result.otherPeople = result.otherPeople.map((_i: any) =>
          extractCustomData(_i, 'contactAttrs', metaFields),
        );
      }

      const response = await register({
        eventId,
        values: result,
        workspace,
      });

      if (response.success) {
        toast({
          variant: 'success',
          title: i18n.t(SUCCESS_REGISTER_MESSAGE),
        });
        router.push(`${workspaceURI}/${SUBAPP_CODES.events}/${eventId}`);
      } else {
        toast({
          variant: 'destructive',
          title: i18n.t(response.message),
        });
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: i18n.t('Error while adding comment'),
      });
    }
  };

  return (
    <Card className="w-full rounded-2xl border-none shadow-none">
      <CardHeader className="p-4 flex flex-col gap-4 space-y-0">
        <CardTitle>
          <p className="text-xl font-semibold">{eventTitle}</p>
        </CardTitle>
        <EventDateCard
          startDate={eventStartDateTime}
          endDate={eventEndDateTime}
          eventAllDay={eventAllDay}
        />
        <BadgeList items={eventCategorySet} />
        {eventProduct && (
          <CardDescription className="my-6 text-xl font-semibold text-black">
            <div>
              <p className="text-xl font-semibold text-black">
                {i18n.t('Price')}:{' '}
                <span className="text-success">{formattedDefaultPrice}</span>
              </p>
              <p className="text-xs font-medium text-black">
                {i18n.t('Price with tax')}:{' '}
                <span className="text-success">{displayAtiPrice}</span>
              </p>
            </div>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-2 space-y-6">
        <FormView
          fields={[
            ...(eventAllowMultipleRegistrations
              ? multipleRegistrationForm
              : participantForm),
            {
              name: 'facilitiesPrice',
              title: null,
              type: 'array',
              widget: 'custom',
              hidden: !facilityList.length,
              customComponent: (props: any) => (
                <FacilitiesPriceView
                  {...props}
                  list={facilityList}
                  eventPrice={eventProduct ? defaultPrice : 0}
                  currency={eventProduct?.saleCurrency}
                />
              ),
            },
          ]}
          onSubmit={onSubmit}
          submitTitle={buttonTitle}
        />
      </CardContent>
    </Card>
  );
};
