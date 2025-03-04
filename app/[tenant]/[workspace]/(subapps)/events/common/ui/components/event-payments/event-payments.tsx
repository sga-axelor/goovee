'use client';

import React, {useCallback, useMemo} from 'react';
import {useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {PaymentOption, PortalWorkspace} from '@/types';
import {useToast} from '@/ui/hooks';
import {i18n} from '@/locale';
import {getitem, setitem} from '@/storage/local';
import {PREFIX_EVENT_FORM_KEY, SUBAPP_CODES, SUBAPP_PAGE} from '@/constants';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {Payments} from '@/ui/components/payment';

// ---- LOCAL IMPORTS ---- //
import {register} from '@/subapps/events/common/actions/actions';
import {
  createStripeCheckoutSession,
  payboxCreateOrder,
  paypalCreateOrder,
} from '@/app/[tenant]/[workspace]/(subapps)/events/common/actions/payments';
import {mapParticipants} from '@/subapps/events/common/utils';
import {getCalculatedTotalPrice} from '@/subapps/events/common/utils/payments';
import type {EventPayments} from '@/subapps/events/common/types';
import {URL_PARAMS} from '@/subapps/events/common/constants';

export function EventPayments({
  workspace,
  event,
  form,
  metaFields,
}: {
  workspace: PortalWorkspace;
  event: EventPayments;
  form: any;
  metaFields: any;
}) {
  const workspaceURL = workspace?.url;

  const isValid =
    form.formState.isValid && !Object.keys(form.formState.errors || {}).length;

  const {toast} = useToast();
  const router = useRouter();
  const {workspaceURI} = useWorkspace();

  const eventFormKey = useMemo(
    () => PREFIX_EVENT_FORM_KEY + '-' + workspaceURL,
    [workspaceURL],
  );

  const redirectToEvents = useCallback(
    async (result: any) => {
      if (result) {
        const {data} = result;
        router.replace(
          `${workspaceURI}/${SUBAPP_CODES.events}/${data.event.slug}/${SUBAPP_PAGE.register}/${SUBAPP_PAGE.confirmation}?${URL_PARAMS.isPaid}=true`,
        );
      }
    },
    [workspaceURI, router],
  );

  function getMappedParticipants(form: any, metaFields: any) {
    const values = form.getValues();
    return mapParticipants(values, metaFields);
  }

  async function handleFormValidation({
    form,
    metaFields,
    paymentOption,
  }: {
    form: any;
    metaFields: any;
    paymentOption?: PaymentOption;
  }): Promise<boolean> {
    try {
      const isValidForm = await form.trigger();
      const isEmailValid = await form.trigger('emailAddress');
      if (!isEmailValid) {
        return false;
      }

      if (!isValidForm) {
        return false;
      }

      const result = getMappedParticipants(form, metaFields);
      const {total} = getCalculatedTotalPrice(result, event);
      if (!total || total <= 0) {
        toast({
          variant: 'destructive',
          title: i18n.t('Total price must be greater than zero.'),
        });
        return false;
      }
      if (
        paymentOption &&
        [PaymentOption.stripe, PaymentOption.paybox].includes(paymentOption)
      ) {
        await setitem(eventFormKey, result).catch(() => {});
      }
      return true;
    } catch (error) {
      console.error('validation error:', error);
      return false;
    }
  }

  return (
    <>
      <Payments
        workspace={workspace}
        disabled={!isValid}
        onValidate={async paymentOption => {
          return await handleFormValidation({
            form,
            metaFields,
            paymentOption,
          });
        }}
        onPaypalCreatedOrder={async () => {
          const formValues = getMappedParticipants(form, metaFields);
          return await paypalCreateOrder({
            workspaceURL,
            values: formValues,
            event: {
              id: event.id,
            },
          });
        }}
        onPaypalCaptureOrder={async (orderID: string) => {
          const formValues = getMappedParticipants(form, metaFields);
          return await register({
            payment: {data: {id: orderID}, mode: PaymentOption.paypal},
            workspace: {url: workspaceURL},
            values: formValues,
            eventId: event.id,
          });
        }}
        onApprove={redirectToEvents}
        onStripeCreateCheckOutSession={async () => {
          const formValues: any = await getitem(eventFormKey).catch(() => {});
          return await createStripeCheckoutSession({
            event: {
              id: event.id,
            },
            workspaceURL,
            values: formValues,
          });
        }}
        shouldValidateData={async () => {
          try {
            const formValues: any = await getitem(eventFormKey).catch(() => {});
            return formValues && Object.keys(formValues).length > 0;
          } catch {
            return false;
          }
        }}
        onStripeValidateSession={async ({
          stripeSessionId,
        }: {
          stripeSessionId: string;
        }) => {
          const formValues: any = await getitem(eventFormKey).catch(() => {});
          return await register({
            payment: {
              data: {id: stripeSessionId},
              mode: PaymentOption.stripe,
            },
            workspace: {url: workspaceURL},
            values: formValues,
            eventId: event.id,
          });
        }}
        onPaymentSuccess={async () => await setitem(eventFormKey, null)}
        onPayboxCreateOrder={async ({uri}) => {
          const formValues: any = await getitem(eventFormKey).catch(() => {});
          return await payboxCreateOrder({
            event: {
              id: event.id,
            },
            workspaceURL,
            values: formValues,
            uri,
          });
        }}
        onPayboxValidatePayment={async ({params}) => {
          const formValues: any = await getitem(eventFormKey).catch(() => {});
          return await register({
            payment: {
              mode: PaymentOption.paybox,
              data: {params},
            },
            workspace: {url: workspaceURL},
            values: formValues,
            eventId: event.id,
          });
        }}
        successMessage="Event registration completed successfully."
        errorMessage="Failed to process event registration."
      />
    </>
  );
}

export default EventPayments;
