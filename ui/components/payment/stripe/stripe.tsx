'use client';

import {useCallback, useEffect, useRef} from 'react';

// ---- CORE IMPORTS ---- //
import {Button} from '@/ui/components';
import {i18n} from '@/locale';
import {useSearchParams, useToast} from '@/ui/hooks';
import {StripeProps} from '@/ui/components/payment/types';
import {PaymentOption} from '@/types';

export function Stripe({
  disabled,
  successMessage = 'Payment successful!',
  errorMessage = 'Error processing payment, try again.',
  onValidate,
  onCreateCheckOutSession,
  shouldValidateData,
  onValidateSession,
  onPaymentSuccess,
  onApprove,
}: StripeProps) {
  const {toast} = useToast();
  const {searchParams} = useSearchParams();
  const validateRef = useRef(false);

  const handleCreateCheckoutSession = async (event: any) => {
    event.preventDefault();

    if (onValidate) {
      const isValid = await onValidate(PaymentOption.stripe);
      if (!isValid) {
        return;
      }
    }
    try {
      const result = await onCreateCheckOutSession();

      if (result.error) {
        toast({
          variant: 'destructive',
          title: result.message,
        });
        return;
      }

      const {url} = result;
      window.location.assign(url as string);
    } catch (err) {
      console.error('Error while creating checkout session:', err);
      toast({
        variant: 'destructive',
        title: i18n.t('Error processing stripe payment, try again.'),
      });
    }
  };

  const handleValidateStripePayment = useCallback(
    async ({stripeSessionId}: {stripeSessionId: string}) => {
      const isValid = shouldValidateData ? await shouldValidateData() : true;

      if (!(stripeSessionId && isValid)) {
        return;
      }

      try {
        const result: any = await onValidateSession({
          stripeSessionId,
        });
        if (result.error) {
          toast({
            variant: 'destructive',
            title: i18n.t(result.message || errorMessage),
          });
        } else {
          toast({
            variant: 'success',
            title: i18n.t(successMessage),
          });
          if (onPaymentSuccess) {
            onPaymentSuccess();
          }

          onApprove?.(result);
        }
      } catch (err) {
        toast({
          variant: 'destructive',
          title: i18n.t('Error processing Stripe payment, try again.'),
        });
      }
    },
    [
      errorMessage,
      successMessage,
      shouldValidateData,
      onValidateSession,
      toast,
      onPaymentSuccess,
      onApprove,
    ],
  );

  useEffect(() => {
    if (validateRef.current) {
      return;
    }

    validateRef.current = true;

    const stripeSessionId = searchParams.get('stripe_session_id');
    const stripeError = searchParams.get('stripe_error');

    if (stripeError) {
      toast({
        variant: 'destructive',
        title: i18n.t('Error processing Stripe payment, try again.'),
      });
    } else if (stripeSessionId) {
      handleValidateStripePayment({stripeSessionId});
    }
  }, [searchParams, toast, handleValidateStripePayment]);

  return (
    <Button
      className="h-[50px] w-full bg-[#635bff] text-lg font-medium"
      disabled={disabled}
      onClick={handleCreateCheckoutSession}>
      {i18n.t('Pay with Stripe')}
    </Button>
  );
}

export default Stripe;
