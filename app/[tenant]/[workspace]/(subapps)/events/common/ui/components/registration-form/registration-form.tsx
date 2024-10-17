'use client';

import {useMemo, useState} from 'react';
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
import {i18n} from '@/i18n';
import {
  FormView,
  ArrayComponent,
  extractCustomData,
  formatStudioFields,
} from '@/ui/form';
import {useToast} from '@/ui/hooks/use-toast';
import {DATE_FORMATS} from '@/constants';
import {parseDate} from '@/utils/date';

// ---- LOCAL IMPORTS ---- //
import {
  EventCardBadges,
  CustomSelect,
  EventDateCard,
} from '@/subapps/events/common/ui/components';
import type {EventPageCardProps} from '@/subapps/events/common/ui/components';
import {register} from '@/subapps/events/common/actions/actions';

const basicPerson = [
  {
    name: 'name',
    title: 'Name',
    type: 'string',
    widget: null,
    helper: 'Enter name',
    hidden: false,
    required: true,
    readonly: false,
    order: 1,
  },
  {
    name: 'surname',
    title: 'Surname',
    type: 'string',
    widget: null,
    helper: 'Enter surname',
    hidden: false,
    required: true,
    readonly: false,
    order: 2,
  },
  {
    name: 'emailAddress',
    title: 'Email',
    type: 'string',
    widget: 'email',
    helper: 'Enter email',
    hidden: false,
    required: true,
    readonly: false,
    order: 3,
  },
  {
    name: 'phone',
    title: 'Phone',
    type: 'string',
    widget: 'phone',
    helper: 'Enter phone number',
    hidden: false,
    required: true,
    readonly: false,
    order: 4,
  },
];

export const RegistrationForm = ({
  eventDetails,
  metaFields = [],
  workspace,
}: EventPageCardProps) => {
  const [tempError, setTempError] = useState<boolean>(false);
  const router = useRouter();
  const {workspaceURI, workspaceURL} = useWorkspace();
  const {toast} = useToast();

  const participantForm = useMemo(
    () => [...basicPerson, ...formatStudioFields(metaFields)],
    [metaFields],
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
        title: 'Register other people to this event',
        type: 'boolean',
        widget: null,
        helper: null,
        hidden: false,
        required: false,
        readonly: false,
        order: 100,
      },
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
        subSchema: externalParticipantForm,
      },
    ],
    [participantForm, externalParticipantForm],
  );

  const onSubmit = async (values: any) => {
    try {
      const result = extractCustomData(values, 'contactAttrs', metaFields);

      if (!result.addOtherPeople) {
        result.otherPeople = [];
      } else {
        result.otherPeople = result.otherPeople.map((_i: any) =>
          extractCustomData(_i, 'contactAttrs', metaFields),
        );
      }

      const response = await register({
        eventId: eventDetails?.id,
        values: result,
        workspace,
      });

      if (response.success) {
        router.push(`${workspaceURI}/events/${eventDetails?.id}?success=true`);
      } else {
        toast({
          variant: 'destructive',
          title: i18n.get(response.message),
        });
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: i18n.get('Error while adding comment'),
      });
      setTempError(true);
    }
  };

  return (
    <Card className="w-full rounded-2xl border-none shadow-none">
      <CardHeader className="p-4 flex flex-col gap-4 space-y-0">
        <CardTitle>
          <p className="text-xl font-semibold">{eventDetails?.eventTitle}</p>
        </CardTitle>
        <EventDateCard
          startDate={parseDate(
            eventDetails?.eventStartDateTime,
            DATE_FORMATS.full_month_day_year_12_hour,
          )}
          endDate={parseDate(
            eventDetails?.eventEndDateTime,
            DATE_FORMATS.full_month_day_year_12_hour,
          )}
          registered={eventDetails?.eventAllowRegistration}
        />
        <EventCardBadges categories={eventDetails?.eventCategorySet} />
        {eventDetails?.eventProduct?.salePrice && (
          <CardDescription className="my-6 text-xl font-semibold">
            {`${i18n.get('Price')} : ${parseFloat(eventDetails?.eventProduct?.salePrice).toFixed(2)}€`}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-2">
        <FormView
          fields={
            eventDetails?.eventAllowMultipleRegistrations
              ? multipleRegistrationForm
              : participantForm
          }
          onSubmit={onSubmit}
          submitTitle={
            'Register' +
            (parseFloat(eventDetails?.eventProduct?.salePrice ?? '0') > 0
              ? ' and pay'
              : '')
          }
        />
      </CardContent>
    </Card>
  );
};
