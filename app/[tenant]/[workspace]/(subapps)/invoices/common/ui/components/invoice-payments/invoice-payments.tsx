'use client';

import {useCallback, useMemo} from 'react';
import {useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {ID, PaymentOption} from '@/types';
import {Payments} from '@/ui/components/payment';
import {PREFIX_INVOICE_KEY, SUBAPP_CODES, SUBAPP_PAGE} from '@/constants';
import {getitem, setitem} from '@/storage/local';
import {useToast} from '@/ui/hooks';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {i18n} from '@/locale';
import {ErrorResponse, SuccessResponse} from '@/types/action';

// ---- LOCAL IMPORTS ---- //
import {
  createStripeCheckoutSession,
  payboxCreateOrder,
  paypalCaptureOrder,
  paypalCreateOrder,
  validatePayboxPayment,
  validateStripePayment,
} from '@/subapps/invoices/common/actions';
import {Invoice, PaymentType} from '@/subapps/invoices/common/types/invoices';

export function InvoicePayments({
  workspace,
  invoice,
  amount,
  paymentType,
}: {
  workspace: any;
  invoice: Invoice;
  amount: string;
  paymentType: PaymentType;
}) {
  const workspaceURL = workspace?.url;

  const invoiceKey = useMemo(
    () => PREFIX_INVOICE_KEY + '-' + workspaceURL,
    [workspaceURL],
  );
  const router = useRouter();
  const {workspaceURI} = useWorkspace();
  const {toast} = useToast();

  const redirectToInvoice = useCallback(
    async (result: any) => {
      if (result) {
        const {data} = result;
        if (paymentType === PaymentType.IsPartial) {
          router.replace(
            `${workspaceURI}/${SUBAPP_CODES.invoices}/${SUBAPP_PAGE.invoices}/${data.id}`,
          );
        } else {
          router.replace(
            `${workspaceURI}/${SUBAPP_CODES.invoices}/${SUBAPP_PAGE.archived}/${data.id}`,
          );
        }
      }
    },
    [paymentType, router, workspaceURI],
  );
  const handleInvoiceValidation = async ({
    paymentOption,
  }: {
    paymentOption?: PaymentOption;
  } = {}) => {
    if (!Number(amount)) {
      toast({
        variant: 'destructive',
        title: i18n.t('Amount must be greater than 0'),
      });
      return false;
    }
    try {
      if (
        paymentOption &&
        [PaymentOption.stripe, PaymentOption.paybox].includes(paymentOption)
      ) {
        await setitem(invoiceKey, amount).catch(() => {});
      }
      return true;
    } catch (error) {
      console.error('validation error:', error);
      return false;
    }
  };

  const handleStripeValidations = async ({
    stripeSessionId,
  }: {
    stripeSessionId: string;
  }): Promise<ErrorResponse | SuccessResponse<{id: ID; version: number}>> => {
    try {
      const response: any = await validateStripePayment({
        stripeSessionId,
        workspaceURL,
      });

      return response;
    } catch (error) {
      return {
        error: true,
        message: i18n.t('Unexpected error occurred'),
      };
    }
  };

  const handlePayboxValidations = async ({
    params,
  }: {
    params: any;
  }): Promise<ErrorResponse | SuccessResponse<{id: ID; version: number}>> => {
    try {
      const response: any = await validatePayboxPayment({
        params,
        workspaceURL,
      });
      return response;
    } catch (error) {
      return {
        error: true,
        message: i18n.t(
          'Unexpected error occurred while validating paybox payment',
        ),
      };
    }
  };

  return (
    <Payments
      disabled={!Number(amount)}
      workspace={workspace}
      onValidate={async paymentOption => {
        const isValid = await handleInvoiceValidation({paymentOption});

        return !!isValid;
      }}
      onPaypalCreatedOrder={async () => {
        return await paypalCreateOrder({
          invoice: {
            id: invoice.id,
          },
          amount,
          workspaceURL,
        });
      }}
      onPaypalCaptureOrder={async orderID => {
        return await paypalCaptureOrder({
          orderID,
          workspaceURL,
        });
      }}
      onApprove={redirectToInvoice}
      shouldValidateData={async () => {
        try {
          const $amount: any = await getitem(invoiceKey).catch(() => {});
          return $amount;
        } catch {
          return false;
        }
      }}
      onStripeCreateCheckOutSession={async () => {
        const $amount: any = await getitem(invoiceKey).catch(() => {});
        return await createStripeCheckoutSession({
          invoice: {
            id: invoice.id,
          },
          amount: $amount,
          workspaceURL,
        });
      }}
      onStripeValidateSession={handleStripeValidations}
      onPaymentSuccess={async () => await setitem(invoiceKey, null)}
      onPayboxCreateOrder={async ({uri}) => {
        const $amount: any = await getitem(invoiceKey).catch(() => {});
        return await payboxCreateOrder({
          invoice: {
            id: invoice.id,
          },
          amount: $amount,
          workspaceURL,
          uri,
        });
      }}
      onPayboxValidatePayment={handlePayboxValidations}
      successMessage="Invoice payment completed successfully."
      errorMessage="Failed to process invoice payment."
    />
  );
}

export default InvoicePayments;
