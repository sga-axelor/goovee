'use client';
import {useCallback, useEffect, useRef} from 'react';

// ---- CORE IMPORTS ---- //
import {Button} from '@/ui/components';
import {i18n} from '@/locale';
import {useSearchParams, useToast} from '@/ui/hooks';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {getitem, setitem} from '@/storage/local';

// ---- LOCAL IMPORTS ---- //
import {
  createStripeCheckoutSession,
  validateStripePayment,
} from '@/app/[tenant]/[workspace]/(subapps)/events/common/actions/payments';

type StripeProps = {
  record: {
    id: string | number;
  };
  disabled?: boolean;
  amount: number;
  onApprove: (result: any) => void;
  onValidate: () => Promise<boolean>;
};

export function Stripe({
  record,
  amount,
  disabled,
  onApprove,
  onValidate,
}: StripeProps) {
  const {toast} = useToast();
  const {workspaceURL} = useWorkspace();
  const {searchParams} = useSearchParams();
  const validateRef = useRef(false);

  const handleCreateCheckoutSession = async (event: any) => {
    event.preventDefault();

    try {
      const isValid = await onValidate();
      if (!isValid) {
        return;
      }
      const formValues: any = await getitem('values').catch(() => {});
      const result = await createStripeCheckoutSession({
        record,
        amount,
        workspaceURL,
        email: formValues.emailAddress,
      });

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
      toast({
        variant: 'destructive',
        title: i18n.t('Error processing stripe payment, try again.'),
      });
    }
  };

  const handleValidateStripePayment = useCallback(
    async ({stripeSessionId}: {stripeSessionId: string}) => {
      const formValues: any = await getitem('values').catch(() => {});

      if (!(stripeSessionId && formValues)) {
        return;
      }
      try {
        const result: any = await validateStripePayment({
          stripeSessionId,
          workspaceURL,
          values: formValues,
          record,
        });
        if (result.error) {
          toast({
            variant: 'destructive',
            title: i18n.t(
              result.message || 'Event resgitration is not successfull!',
            ),
          });
        } else {
          toast({
            variant: 'success',
            title: i18n.t('Event Registration is successfull!'),
          });
          await setitem('values', null);
          onApprove?.(result);
        }
      } catch (err) {
        toast({
          variant: 'destructive',
          title: i18n.t('Error processing Stripe payment, try again.'),
        });
      }
    },
    [workspaceURL, record, toast, onApprove],
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
