'use client';

// ---- CORE IMPORTS ---- //
import {Button} from '@/ui/components';
import {i18n} from '@/locale';

type StripeProps = {
  onPay: () => void;
};

export function Stripe({onPay}: StripeProps) {
  return (
    <Button
      className="h-[50px] bg-[#635bff] text-lg font-medium"
      onClick={onPay}>
      {i18n.t('Pay with Stripe')}
    </Button>
  );
}

export default Stripe;
