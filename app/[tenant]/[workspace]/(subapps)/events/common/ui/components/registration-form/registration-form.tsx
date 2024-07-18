'use client';

import {useMemo, useState} from 'react';
import {useRouter} from 'next/navigation';
import {MdCheckCircleOutline, MdClose} from 'react-icons/md';
import {z} from 'zod';

// ---- CORE IMPORTS ---- //
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/components/card';
import FormView from '@/ui/form/form-view';
import ArrayComponent from '@/ui/form/array-component';
import {
  extractCustomData,
  formatStudioFields,
} from '@/ui/form/studio/display.helpers';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

// ---- LOCAL IMPORTS ---- //
import {
  EventCardBadges,
  CustomSelect,
} from '@/subapps/events/common/ui/components';
import type {EventPageCardProps} from '@/subapps/events/common/ui/components';
import {eventRegistration} from '@/subapps/events/common/actions/actions';

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
  metaFields,
}: EventPageCardProps) => {
  const [tempError, setTempError] = useState<boolean>(false);
  const router = useRouter();
  const {workspaceURI} = useWorkspace();

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
        hideIf: formState => !formState?.addOtherPeople,
        required: false,
        readonly: false,
        order: 110,
        customComponent: props =>
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
        hideIf: formState => !formState?.addOtherPeople,
        required: false,
        readonly: false,
        order: 120,
        customComponent: props =>
          ArrayComponent({
            ...props,
            addTitle: 'Add a new person that does not have an account',
          }),
        subSchema: externalParticipantForm,
      },
    ],
    [participantForm, externalParticipantForm],
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const result = extractCustomData(values, 'contactAttrs', metaFields);

      if (!result.addOtherPeople) {
        result.otherPeople = [];
      } else {
        result.otherPeople = result.otherPeople.map(_i =>
          extractCustomData(_i, 'contactAttrs', metaFields),
        );
      }

      await eventRegistration(eventDetails?.id, result);
      router.push(`${workspaceURI}/events/${eventDetails?.id}?success=true`);
    } catch (err) {
      setTempError(true);
    }
  };

  return (
    <Card className="max-w-screen-lg  order-2 lg:order-1 p-4 shadow-nonemin-w-full lg:min-w-[50rem] xl:min-w-[57.75rem] xl:max-w-[57.75rem]  w-full rounded-2xl border-none shadow-none">
      <CardHeader className="p-0 space-y-4">
        <CardTitle>
          <p className="text-xl font-semibold">{eventDetails?.eventTitle}</p>
        </CardTitle>
        <EventCardBadges categories={eventDetails?.eventCategorySet} />
        {eventDetails?.eventProduct?.salePrice && (
          <CardDescription className="my-6 text-xl font-semibold">
            {`Price : ${parseFloat(eventDetails?.eventProduct?.salePrice).toFixed(2)}€`}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-0 pt-4">
        <FormView
          fields={
            eventDetails?.eventAllowMultipleRegistrations
              ? multipleRegistrationForm
              : participantForm
          }
          onSubmit={onSubmit}
          submitTitle={
            'Register' +
            (parseFloat(eventDetails?.eventProduct?.salePrice) > 0
              ? ' and pay'
              : '')
          }
        />
        {tempError && (
          <div className="flex lg:items-center justify-between text-red-1 bg-red-2 rounded-[0.313rem] py-4 px-8 border border-red-1 text-base font-normal leading-7 tracking-[0.031rem] w-full h-fit">
            <p className="gap-x-4 flex lg:items-center">
              <MdCheckCircleOutline className="shrink-0 w-6 h-6" />
              Sorry there has been a problem with your registration. Please try
              again.
            </p>
            <MdClose className="cursor-pointer shrink-0 w-6 h-6" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
