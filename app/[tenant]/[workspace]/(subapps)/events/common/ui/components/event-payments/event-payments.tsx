'use client';

import React, {useCallback} from 'react';
import {useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {ID, PaymentOption, PortalWorkspace} from '@/types';
import {extractCustomData} from '@/ui/form';
import {useToast} from '@/ui/hooks';
import {i18n} from '@/locale';
import {setitem} from '@/storage/local';
import {Stripe} from '@/ui/components/payment/stripe';
import {SUBAPP_CODES} from '@/constants';
import {isPaymentOptionAvailable} from '@/utils/payment';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {Paypal} from '@/ui/components/payment/paypal';

// ---- LOCAL IMPORTS ---- //
import {validateRegistration} from '@/subapps/events/common/actions/actions';
import {
  paypalCaptureOrder,
  paypalCreateOrder,
} from '@/app/[tenant]/[workspace]/(subapps)/events/common/actions/payments';

export function EventPayments({
  workspace,
  eventId,
  form,
  metaFields,
}: {
  workspace: PortalWorkspace;
  eventId: ID;
  form: any;
  metaFields: any;
}) {
  const config = workspace?.config;
  const allowOnlinePayment = config?.allowOnlinePaymentForEcommerce;
  const paymentOptionSet = config?.paymentOptionSet;

  const total = form.watch('totalPrice');

  const {toast} = useToast();
  const router = useRouter();
  const {workspaceURI} = useWorkspace();

  const redirectToEvents = useCallback(
    async (result: any) => {
      if (result) {
        router.replace(`${workspaceURI}/${SUBAPP_CODES.events}`);
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

  async function handleFormValidation({
    form,
    eventId,
    metaFields,
    workspace,
    paymentOption,
  }: {
    form: any;
    eventId: ID;
    metaFields: any;
    workspace: any;
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

      const values = form.getValues();
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

      const validationResult = await validateRegistration({
        eventId,
        values: result,
        workspaceURL: workspace.url,
      });

      if (validationResult.error) {
        toast({
          variant: 'destructive',
          title: i18n.t(validationResult.message),
        });
        return false;
      }
      if (paymentOption === PaymentOption.stripe) {
        // TODO: use keys as per cart here too
        await setitem('values', result).catch(() => {});
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
    <div>
      {allowPaypal && (
        <Paypal
          onValidate={async () => {
            const isValid = await handleFormValidation({
              form,
              eventId,
              metaFields,
              workspace,
            });
            return isValid ? true : false;
          }}
          createOrder={async () => {
            const formValues: any = form.getValues();
            return await paypalCreateOrder({
              workspaceURL: workspace.url,
              values: formValues,
              record: {
                id: eventId,
              },
              amount: total,
              email: formValues.emailAddress,
            });
          }}
          captureOrder={async order => {
            const formValues: any = form.getValues();
            return await paypalCaptureOrder({
              orderId: order.id,
              workspaceURL: workspace.url,
              values: formValues,
              record: {
                id: eventId,
              },
              amount: total,
            });
          }}
          onApprove={redirectToEvents}
          successMessage="Event registration completed successfully."
          errorMessage="Failed to process event registration."
        />
      )}
      {allowStripe && (
        <Stripe
          amount={total}
          record={{id: eventId}}
          onValidate={async () =>
            await handleFormValidation({
              form,
              eventId,
              metaFields,
              workspace,
              paymentOption: PaymentOption.stripe,
            })
          }
          onApprove={redirectToEvents}
        />
      )}
    </div>
  );
}

export default EventPayments;
