'use client';
import {useCallback, useEffect, useRef} from 'react';

// ---- CORE IMPORTS ---- //
import {useSearchParams, useToast} from '@/ui/hooks';
import {PaymentOption} from '@/types';
import {isPaymentOptionAvailable} from '@/utils/payment';
import {i18n} from '@/locale';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {Paypal} from './paypal';
import {Stripe} from './stripe';

type PaymentProps = {
  paymentOptions: any;
  record: any;
  amount: any;
  onApprove: (result: any) => void;
  onStripeValidation: (result: any) => Promise<any>;
  onCreateStripeCheckoutSession: (result: any) => Promise<any>;
  onPayPalCreateOrder: (result: any) => Promise<any>;
  onPayPalCaptureOrder: (result: any) => Promise<any>;
};

export function Payment({
  paymentOptions,
  record,
  amount,
  onApprove,
  onStripeValidation,
  onCreateStripeCheckoutSession,
  onPayPalCreateOrder,
  onPayPalCaptureOrder,
}: PaymentProps) {
  const allowPaypal = isPaymentOptionAvailable(
    paymentOptions,
    PaymentOption.paypal,
  );
  const allowStripe = isPaymentOptionAvailable(
    paymentOptions,
    PaymentOption.stripe,
  );

  const {toast} = useToast();
  const {workspaceURL} = useWorkspace();
  const {searchParams} = useSearchParams();
  const validateRef = useRef(false);

  const handlePaypalCreateOrder = async () => {
    if (!record) {
      toast({
        variant: 'destructive',
        title: i18n.t('Invalid record'),
      });
      return;
    }

    const result: any = await onPayPalCreateOrder({
      record,
      amount,
      workspaceURL,
    });

    if (result.error) {
      toast({
        variant: 'destructive',
        title: result.message,
      });
    } else {
      return result?.order?.id;
    }
  };

  const handlePaypalApprove = async (data: any, actions: any) => {
    const result: any = await onPayPalCaptureOrder({
      orderId: data.orderID,
      workspaceURL,
      record,
    });
    if (result?.error) {
      toast({
        variant: 'destructive',
        title: result.message,
      });
      return;
    } else {
      toast({
        variant: 'success',
        title: i18n.t('Order requested successfully'),
      });
      onApprove?.(result);
    }
  };

  const handleStripePay = async () => {
    try {
      const result: any = await onCreateStripeCheckoutSession({
        record,
        amount,
        workspaceURL,
      });

      if (result?.error) {
        toast({
          variant: 'destructive',
          title: result.message,
        });
        return;
      }

      const {url} = result;
      window.location.assign(url as string);
    } catch (err) {
      toast({
        variant: 'destructive',
        title: i18n.t('Error processing stripe payment, try again.'),
      });
    }
  };

  const handleValidateStripePayment = useCallback(
    async ({stripeSessionId}: {stripeSessionId: string}) => {
      if (!stripeSessionId) {
        return;
      }
      try {
        const result: any = await onStripeValidation({
          stripeSessionId,
          record,
          workspaceURL,
          amount,
        });

        if (result.error) {
          toast({
            variant: 'destructive',
            title: result.message,
          });
        } else {
          toast({
            variant: 'success',
            title: i18n.t('Invoice paid successfully'),
          });

          onApprove?.(result);
        }
      } catch (err) {
        console.log('handle err >>>', err);
        toast({
          variant: 'destructive',
          title: i18n.t('Error processing stripe payment, try again.'),
        });
      }
    },
    [onStripeValidation, record, workspaceURL, amount, toast, onApprove],
  );

  useEffect(() => {
    if (validateRef.current) {
      return;
    }

    const stripeSessionId = searchParams.get('stripe_session_id');
    const stripeError = searchParams.get('stripe_error');

    if (stripeError) {
      toast({
        variant: 'destructive',
        title: i18n.t('Error processing stripe payment, try again.'),
      });
    } else if (stripeSessionId) {
      handleValidateStripePayment({stripeSessionId});
    }
    validateRef.current = true;
  }, [searchParams, toast, handleValidateStripePayment]);

  return (
    <div className="flex flex-col gap-2">
      {allowPaypal && (
        <Paypal
          clientId={process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!}
          onCreateOrder={handlePaypalCreateOrder}
          onApprove={handlePaypalApprove}
        />
      )}
      {allowStripe && <Stripe onPay={handleStripePay} />}
    </div>
  );
}

export default Payment;
