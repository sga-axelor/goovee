'use client';

import React, {useCallback, useEffect, useState} from 'react';
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

// ---- LOCAL IMPORTS ---- //
import {validateRegistration} from '@/subapps/events/common/actions/actions';

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
    (result: any) => {
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

  async function handleFormValidation({
    form,
    eventId,
    metaFields,
    workspace,
  }: {
    form: any;
    eventId: ID;
    metaFields: any;
    workspace: any;
  }): Promise<boolean> {
    try {
      const isValidForm = await form.trigger();

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
      await setitem('values', result).catch(() => {});
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
    <>
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
            })
          }
          onApprove={redirectToEvents}
        />
      )}
    </>
  );
}

export default EventPayments;
