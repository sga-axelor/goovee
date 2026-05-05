'use client';

import {useCallback} from 'react';
import type {Cloned} from '@/types/util';
import {useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {PaymentOption} from '@/types';
import {PortalWorkspace} from '@/orm/workspace';
import {useToast} from '@/ui/hooks';
import {i18n} from '@/locale';
import {SUBAPP_CODES, SUBAPP_PAGE} from '@/constants';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {Payments} from '@/ui/components/payment';
import {scale} from '@/utils';

// ---- LOCAL IMPORTS ---- //
import {register} from '@/subapps/events/common/actions/actions';
import {
  createStripeCheckoutSession,
  payboxCreateOrder,
  paypalCreateOrder,
} from '@/app/[tenant]/[workspace]/(subapps)/events/common/actions/payments';
import {mapParticipants} from '@/subapps/events/common/utils';
import {getCalculatedTotalPrice} from '@/subapps/events/common/utils/payments';
import type {FullEvent} from '../../../orm/event';
import type {ModelField} from '@/orm/model-fields';
import {URL_PARAMS} from '@/subapps/events/common/constants';
export function EventPayments({
  workspace,
  event,
  form,
  metaFields,
  metaFieldsFacilities,
  additionalFieldSet,
}: {
  workspace: PortalWorkspace | Cloned<PortalWorkspace>;
  event: Pick<
    Cloned<FullEvent>,
    'id' | 'displayAti' | 'facilityList' | 'priceScale'
  >;
  form: any;
  metaFields: ModelField[];
  metaFieldsFacilities: ModelField[];
  additionalFieldSet: ModelField[] | null | undefined;
}) {
  const workspaceURL = workspace?.url;

  const isValid =
    form.formState.isValid && !Object.keys(form.formState.errors || {}).length;

  const {toast} = useToast();
  const router = useRouter();
  const {workspaceURI} = useWorkspace();

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

  function getMappedParticipants(form: any, metaFields: ModelField[]) {
    const values = form.getValues();
    return mapParticipants(
      values,
      metaFields,
      metaFieldsFacilities,
      additionalFieldSet ?? [],
    );
  }

  async function handleFormValidation({
    form,
    metaFields,
  }: {
    form: any;
    metaFields: ModelField[];
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
      const $total = Number(scale(total, event.priceScale));

      if (!$total || $total <= 0) {
        toast({
          variant: 'destructive',
          title: i18n.t('Total price must be greater than zero.'),
        });
        return false;
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
        onValidate={async () => {
          return await handleFormValidation({
            form,
            metaFields,
          });
        }}
        onPaypalCreatedOrder={async () => {
          const formValues = getMappedParticipants(form, metaFields);
          return await paypalCreateOrder({
            workspaceURL,
            values: formValues,
            eventId: event.id,
          });
        }}
        onPaypalCaptureOrder={async orderID => {
          return await register({
            payment: {data: {id: orderID}, mode: PaymentOption.paypal},
            workspaceURL,
            eventId: event.id,
          });
        }}
        onApprove={redirectToEvents}
        onStripeCreateCheckOutSession={async () => {
          const formValues = getMappedParticipants(form, metaFields);
          return await createStripeCheckoutSession({
            eventId: event.id,
            workspaceURL,
            values: formValues,
          });
        }}
        onStripeValidateSession={async ({
          stripeSessionId,
        }: {
          stripeSessionId: string;
        }) => {
          return await register({
            payment: {
              data: {id: stripeSessionId},
              mode: PaymentOption.stripe,
            },
            workspaceURL,
            eventId: event.id,
          });
        }}
        onPayboxCreateOrder={async ({uri}) => {
          const formValues = getMappedParticipants(form, metaFields);
          return await payboxCreateOrder({
            eventId: event.id,
            workspaceURL,
            values: formValues,
            uri,
          });
        }}
        onPayboxValidatePayment={async ({params}) => {
          return await register({
            payment: {
              mode: PaymentOption.paybox,
              data: {params},
            },
            workspaceURL,
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
