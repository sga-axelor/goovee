'use client';

import {useCallback, useEffect, useRef} from 'react';
import {useRouter, usePathname} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {Button} from '@/ui/components';
import {useSearchParams, useToast} from '@/ui/hooks';
import {i18n} from '@/locale';
import {PayboxProps} from '@/ui/components/payment/types';
import {PaymentOption} from '@/types';

export function Paybox({
  disabled,
  onPaymentSuccess,
  onApprove,
  shouldValidateData,
  onValidate,
  onCreateOrder,
  onValidatePayment,
}: PayboxProps) {
  const {toast} = useToast();

  const {searchParams} = useSearchParams();
  const router = useRouter();
  const validateRef = useRef(false);
  const pathname = usePathname();

  const handleCreatePayboxOrder = async (event: any) => {
    event.preventDefault();
    if (onValidate) {
      const isValid = await onValidate(PaymentOption.paybox);
      if (!isValid) {
        return;
      }
    }

    const result: any = await onCreateOrder({uri: pathname});

    if (result.error) {
      toast({
        variant: 'destructive',
        title: result.message,
      });
    } else {
      if (result?.order?.url) {
        router.push(result?.order?.url);
      } else {
        toast({
          variant: 'destructive',
          title: i18n.t('Error processing payment. Try again.'),
        });
      }
    }
  };

  const handleValidatePayboxPayment = useCallback(async () => {
    try {
      const isValid = shouldValidateData ? await shouldValidateData() : true;
      if (!isValid) {
        return;
      }

      const result = await onValidatePayment({
        params: Object.fromEntries(searchParams.entries()),
      });

      if (result.error) {
        toast({
          variant: 'destructive',
          title: result.message,
        });
      } else {
        toast({
          variant: 'success',
          title: i18n.t('Order requested successfully'),
        });

        if (onPaymentSuccess) {
          onPaymentSuccess();
        }
        onApprove?.(result);
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: i18n.t('Error processing paybox payment, try again.'),
      });
    }
  }, [
    shouldValidateData,
    onValidatePayment,
    searchParams,
    toast,
    onPaymentSuccess,
    onApprove,
  ]);

  useEffect(() => {
    if (validateRef.current) {
      return;
    }

    const validate = async () => {
      const isValid = shouldValidateData ? await shouldValidateData() : true;

      if (!isValid) {
        return;
      }

      const payboxResponse = searchParams.get('paybox_response');
      const payboxError = searchParams.get('paybox_error');

      if (payboxError) {
        toast({
          variant: 'destructive',
          title: i18n.t('Error processing paybox payment, try again.'),
        });
      } else if (payboxResponse) {
        handleValidatePayboxPayment();
      }

      validateRef.current = true;
    };

    validate();
  }, [shouldValidateData, searchParams, toast, handleValidatePayboxPayment]);

  return (
    <Button
      className="h-[50px] text-lg font-medium w-full"
      disabled={disabled}
      onClick={handleCreatePayboxOrder}>
      {i18n.t('Pay using Paybox')}
    </Button>
  );
}

export default Paybox;
