'use client';

import React, {useCallback, useMemo} from 'react';
import {useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {ID, PaymentOption, PortalWorkspace} from '@/types';
import {useToast} from '@/ui/hooks';
import {i18n} from '@/locale';
import {getitem, setitem} from '@/storage/local';
import {PREFIX_EVENT_FORM_KEY, SUBAPP_CODES, SUBAPP_PAGE} from '@/constants';
import {isPaymentOptionAvailable} from '@/utils/payment';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {Paypal, Stripe} from '@/ui/components/payment';

// ---- LOCAL IMPORTS ---- //
import {
  register,
  validateRegistration,
} from '@/subapps/events/common/actions/actions';
import {
  createStripeCheckoutSession,
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
  const config = workspace?.config;
  const allowOnlinePayment = config?.allowOnlinePaymentForEcommerce;
  const paymentOptionSet = config?.paymentOptionSet;
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

  const allowStripe = isPaymentOptionAvailable(
    paymentOptionSet,
    PaymentOption.stripe,
  );

  const allowPaypal = isPaymentOptionAvailable(
    paymentOptionSet,
    PaymentOption.paypal,
  );

  function getMappedParticipants(form: any, metaFields: any) {
    const values = form.getValues();
    return mapParticipants(values, metaFields);
  }

  async function handleFormValidation({
    form,
    eventId,
    metaFields,
    paymentOption,
  }: {
    form: any;
    eventId: ID;
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

      const validationResult = await validateRegistration({
        eventId,
        values: result,
        workspaceURL,
      });

      if (validationResult.error) {
        toast({
          variant: 'destructive',
          title: i18n.t(validationResult.message),
        });
        return false;
      }
      if (paymentOption === PaymentOption.stripe) {
        await setitem(eventFormKey, result).catch(() => {});
      }
      return true;
    } catch (error) {
      console.error('validation error:', error);
      return false;
    }
  }

  if (!allowOnlinePayment) {
    return null;
  }

  return (
    <div className="flex flex-col">
      {allowPaypal && (
        <Paypal
          disabled={!isValid}
          onValidate={async () => {
            const isValid = await handleFormValidation({
              form,
              eventId: event.id,
              metaFields,
            });
            return !!isValid;
          }}
          createOrder={async () => {
            const formValues = getMappedParticipants(form, metaFields);

            return await paypalCreateOrder({
              workspaceURL,
              values: formValues,
              event: {
                id: event.id,
              },
              email: formValues.emailAddress,
            });
          }}
          captureOrder={async orderID => {
            const formValues = getMappedParticipants(form, metaFields);

            return await register({
              payment: {id: orderID, mode: PaymentOption.paypal},
              workspace: {url: workspaceURL},
              values: formValues,
              eventId: event.id,
            });
          }}
          onApprove={redirectToEvents}
          successMessage="Event registration completed successfully."
          errorMessage="Failed to process event registration."
        />
      )}
      {allowStripe && (
        <Stripe
          disabled={!isValid}
          onValidate={async () => {
            const isValid = await handleFormValidation({
              form,
              eventId: event.id,
              metaFields,
              paymentOption: PaymentOption.stripe,
            });

            return !!isValid;
          }}
          onCreateCheckOutSession={async () => {
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
              const formValues: any = await getitem(eventFormKey).catch(
                () => {},
              );
              return formValues && Object.keys(formValues).length > 0;
            } catch {
              return false;
            }
          }}
          onValidateSession={async ({stripeSessionId}) => {
            const formValues: any = await getitem(eventFormKey).catch(() => {});

            return await register({
              payment: {id: stripeSessionId, mode: PaymentOption.stripe},
              workspace: {url: workspaceURL},
              values: formValues,
              eventId: event.id,
            });
          }}
          onPaymentSuccess={async () => await setitem(eventFormKey, null)}
          onApprove={redirectToEvents}
          successMessage="Event registration successful!"
          errorMessage="Failed to process payment. Please try again."
        />
      )}
    </div>
  );
}

export default EventPayments;
