'use client';

import React, {useCallback, useMemo} from 'react';
import {usePathname, useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {ID, PaymentOption, PortalWorkspace} from '@/types';
import {useToast} from '@/ui/hooks';
import {i18n} from '@/locale';
import {getitem, setitem} from '@/storage/local';
import {PREFIX_EVENT_FORM_KEY, SUBAPP_CODES, SUBAPP_PAGE} from '@/constants';
import {isPaymentOptionAvailable} from '@/utils/payment';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {Paybox, Paypal, Stripe} from '@/ui/components/payment';

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
  const config = workspace?.config;
  const allowOnlinePayment = config?.allowOnlinePaymentForEcommerce;
  const paymentOptionSet = config?.paymentOptionSet;
  const workspaceURL = workspace?.url;

  const isValid =
    form.formState.isValid && !Object.keys(form.formState.errors || {}).length;

  const {toast} = useToast();
  const router = useRouter();
  const {workspaceURI} = useWorkspace();
  const pathname = usePathname();

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

  const allowPaybox = isPaymentOptionAvailable(
    paymentOptionSet,
    PaymentOption.paybox,
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

  if (!allowOnlinePayment) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2.5">
      {allowPaypal && (
        <Paypal
          disabled={!isValid}
          onValidate={async () => {
            const isValid = await handleFormValidation({
              form,
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
            });
          }}
          captureOrder={async orderID => {
            const formValues = getMappedParticipants(form, metaFields);

            return await register({
              payment: {data: {id: orderID}, mode: PaymentOption.paypal},
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
          onApprove={redirectToEvents}
          successMessage="Event registration successful!"
          errorMessage="Failed to process payment. Please try again."
        />
      )}

      {allowPaybox && (
        <Paybox
          disabled={!isValid}
          onValidate={async () => {
            const isValid = await handleFormValidation({
              form,
              metaFields,
              paymentOption: PaymentOption.paybox,
            });
            return !!isValid;
          }}
          onCreateOrder={async () => {
            const formValues: any = await getitem(eventFormKey).catch(() => {});
            return await payboxCreateOrder({
              event: {
                id: event.id,
              },
              workspaceURL,
              values: formValues,
              uri: pathname,
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
          onValidatePayment={async ({params}: {params: any}) => {
            const formValues: any = await getitem(eventFormKey).catch(() => {});

            return await register({
              payment: {
                mode: PaymentOption.paybox,
                data: {
                  params,
                },
              },
              workspace: {url: workspaceURL},
              values: formValues,
              eventId: event.id,
            });
          }}
          onPaymentSuccess={async () => await setitem(eventFormKey, null)}
          onApprove={redirectToEvents}
        />
      )}
    </div>
  );
}

export default EventPayments;
