'use client';

import {useMemo} from 'react';
import {useRouter} from 'next/navigation';
import {MdAdd} from 'react-icons/md';

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
import {BadgeList, Button} from '@/ui/components';

// ---- LOCAL IMPORTS ---- //
import {
  CustomSelect,
  EventDateCard,
  SubscriptionsPriceView,
  SubscriptionsView,
  EmailFormField,
  EventPayments,
} from '@/subapps/events/common/ui/components';
import type {EventPageCardProps} from '@/subapps/events/common/ui/components';
import {
  isValidParticipant,
  register,
} from '@/subapps/events/common/actions/actions';
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
    formattedDefaultPriceAti = null,
    displayAti,
    facilityList = [],
    eventTitle = '',
    eventStartDateTime,
    eventEndDateTime,
    eventAllDay = false,
    eventCategorySet = [],
    eventAllowMultipleRegistrations = false,
    id: eventId,
    eventProduct = null,
    slug,
    isPrivate = false,
    maxParticipantPerRegistration,
  } = eventDetails || {};

  const router = useRouter();
  const {workspaceURI} = useWorkspace();
  const {toast} = useToast();

  const isLoggedIn = !!user?.emailAddress;
  const showContactsList = isLoggedIn && !user.isContact;
  const canPay = defaultPrice || facilityList?.length;
  const buttonTitle = i18n.t(`Register${canPay ? ' and pay' : ''}`);

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
        name: 'companyName',
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
        type: 'string',
        widget: 'custom',
        order: 4,
        defaultValue: user?.emailAddress?.address || '',
        required: true,
        customComponent: getEmailFieldComponent({
          isDisabled: isLoggedIn,
          eventId,
          workspaceURL: workspace.url,
        }),
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
        name: 'subscriptionSet',
        title: null,
        type: 'array',
        widget: 'custom',
        hidden: !facilityList.length,
        order: 6,
        customComponent: (props: any) => (
          <SubscriptionsView
            {...props}
            list={facilityList}
            eventPrice={defaultPrice ? formattedDefaultPriceAti : 0}
          />
        ),
      },
    ],
    [
      user.firstName,
      user?.name,
      user?.emailAddress?.address,
      user?.fixedPhone,
      facilityList,
      isLoggedIn,
      eventId,
      workspace.url,
      formattedDefaultPriceAti,
      defaultPrice,
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
                  eventId,
                  maxSelections: maxParticipantPerRegistration,
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
            renderAddMore: ({addItem}) => {
              if (isPrivate) return null;
              return (
                <Button
                  type="button"
                  className={`bg-success-light hover:bg-success p-2 flex whitespace-normal items-center gap-2 h-fit max-w-full group`}
                  onClick={() => {
                    const current =
                      props.form.getValues(props.field.name)?.length || 0;
                    const max = maxParticipantPerRegistration;
                    if (max && max <= current + 1) {
                      toast({
                        variant: 'destructive',
                        title: i18n.t(
                          'Registrations are limited to {0} participants only.',
                          String(max),
                        ),
                      });
                      return;
                    }
                    addItem();
                  }}>
                  <MdAdd className="w-6 h-6 text-success group-hover:text-white" />
                  <p className="text-sm font-normal text-center text-black">
                    {i18n.t('Add a new person that does not have an account')}
                  </p>
                </Button>
              );
            },
          }),
        subSchema: externalParticipantForm.map(field =>
          field.name === 'emailAddress'
            ? {
                ...field,
                customComponent: getEmailFieldComponent({
                  eventId,
                  workspaceURL: workspace.url,
                }),
              }
            : field.name === 'subscriptionSet'
              ? {
                  ...field,
                  customComponent: (props: any) => (
                    <SubscriptionsView
                      {...props}
                      list={facilityList}
                      isSecondary
                      eventPrice={defaultPrice ? formattedDefaultPriceAti : 0}
                    />
                  ),
                }
              : field,
        ),
      },
    ],
    [
      participantForm,
      showContactsList,
      externalParticipantForm,
      eventId,
      workspace.url,
      facilityList,
      defaultPrice,
      formattedDefaultPriceAti,
      isPrivate,
      maxParticipantPerRegistration,
      toast,
    ],
  );

  const onSubmit = async (values: any) => {
    try {
      const result = extractCustomData(values, 'contactAttrs', metaFields);

      result.sequence = 0;

      if (!result.addOtherPeople) {
        result.otherPeople = [];
      } else {
        result.otherPeople = result.otherPeople.map(
          (person: any, index: number) => ({
            ...extractCustomData(person, 'contactAttrs', metaFields),
            sequence: index + 1,
          }),
        );
      }

      const response = await register({
        eventId,
        values: result,
        workspace: {url: workspace.url},
      });

      if (response.success) {
        toast({
          variant: 'success',
          title: i18n.t(SUCCESS_REGISTER_MESSAGE),
        });
        router.push(`${workspaceURI}/${SUBAPP_CODES.events}/${slug}`);
      } else {
        toast({
          variant: 'destructive',
          title: i18n.t(response.message),
        });
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: i18n.t('Error while register to event'),
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
        {defaultPrice ? (
          <CardDescription className="my-6 text-xl font-semibold text-black">
            <div>
              <p className="text-xl font-semibold text-black">
                {i18n.t('Price')}:{' '}
                <span className="text-success">{formattedDefaultPrice}</span>
              </p>
              <p className="text-xs font-medium text-black">
                {i18n.t('Price with tax')}:{' '}
                <span className="text-success font-semibold">
                  {formattedDefaultPriceAti}
                </span>
              </p>
            </div>
          </CardDescription>
        ) : null}
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
                <SubscriptionsPriceView
                  {...props}
                  list={facilityList}
                  eventPrice={Number(displayAti) ?? 0}
                  currency={eventProduct?.saleCurrency}
                />
              ),
            },
          ]}
          submitTitle={buttonTitle}
          mode={'onChange'}
          onSubmit={onSubmit}
          submitButton={
            canPay
              ? ({form}: any) => (
                  <EventPayments
                    workspace={workspace}
                    eventId={eventId}
                    form={form}
                    metaFields={metaFields}
                  />
                )
              : null
          }
        />
      </CardContent>
    </Card>
  );
};

const getEmailFieldComponent = ({
  isDisabled = false,
  eventId,
  workspaceURL,
}: {
  isDisabled?: boolean;
  eventId: string | number;
  workspaceURL: string;
}) => {
  const EmailComponent = (props: any) => (
    <EmailFormField
      {...props}
      title={i18n.t('Email')}
      placeholder={i18n.t('Enter email')}
      disabled={isDisabled}
      onValidation={(email: string) => {
        return isValidParticipant({
          email,
          eventId,
          workspaceURL,
        });
      }}
    />
  );

  EmailComponent.displayName = 'EmailFieldComponent';
  return EmailComponent;
};
