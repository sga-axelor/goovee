'use client';

import {useCallback, useMemo} from 'react';
import {useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {PaymentOption} from '@/types';
import {Stripe} from '@/ui/components/payment';
import {isPaymentOptionAvailable} from '@/utils/payment';
import {PREFIX_INVOICE_KEY, SUBAPP_CODES, SUBAPP_PAGE} from '@/constants';
import {getitem, setitem} from '@/storage/local';
import {useToast} from '@/ui/hooks';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {i18n} from '@/locale';

// ---- LOCAL IMPORTS ---- //
import {
  createStripeCheckoutSession,
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
  const config = workspace?.config;
  const allowOnlinePayment = config?.allowOnlinePaymentForEcommerce;
  const paymentOptionSet = config?.paymentOptionSet;
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
  }) => {
    if (!amount) {
      return false;
    }
    try {
      if (!Number(amount)) {
        toast({
          variant: 'destructive',
          title: i18n.t('Amount must be greater than 0'),
        });
        return false;
      }
      if (paymentOption === PaymentOption.stripe) {
        await setitem(invoiceKey, amount).catch(() => {});
      }
      return true;
    } catch (error) {
      console.error('validation error:', error);
      return false;
    }
  };

  const allowStripe = isPaymentOptionAvailable(
    paymentOptionSet,
    PaymentOption.stripe,
  );

  if (!allowOnlinePayment) {
    return null;
  }

  return (
    <div className="flex flex-col">
      {allowStripe && (
        <Stripe
          onValidate={async () => {
            const isValid = await handleInvoiceValidation({
              paymentOption: PaymentOption.stripe,
            });

            return !!isValid;
          }}
          onCreateCheckOutSession={async () => {
            const $amount: any = await getitem(invoiceKey).catch(() => {});

            return await createStripeCheckoutSession({
              invoice: {
                id: invoice.id,
              },
              amount: $amount,
              workspaceURL,
            });
          }}
          shouldValidateData={async () => {
            try {
              const $amount: any = await getitem(invoiceKey).catch(() => {});
              return $amount;
            } catch {
              return false;
            }
          }}
          onValidateSession={async ({stripeSessionId}) => {
            const $amount: any = await getitem(invoiceKey).catch(() => {});

            return await validateStripePayment({
              stripeSessionId,
              workspaceURL,
              invoice: {
                id: invoice.id,
              },
              amount: $amount,
            });
          }}
          onPaymentSuccess={async () => await setitem(invoiceKey, null)}
          onApprove={redirectToInvoice}
          successMessage="Invoice Amount paid successfully!"
          errorMessage="Failed to process payment. Please try again."
        />
      )}
    </div>
  );
}

export default InvoicePayments;
