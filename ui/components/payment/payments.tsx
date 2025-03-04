'use client';

// ---- CORE IMPPRTS ---- //
import {ID, PaymentOption, PortalWorkspace} from '@/types';
import {ErrorResponse, SuccessResponse} from '@/types/action';
import {Paybox, Paypal, Stripe} from '@/ui/components/payment';
import {isPaymentOptionAvailable} from '@/utils/payment';

export function Payments({
  workspace,
  disabled,
  onValidate,
  onPaypalCreatedOrder,
  onPaypalCaptureOrder,
  onApprove,
  onStripeCreateCheckOutSession,
  shouldValidateData,
  onStripeValidateSession,
  onPaymentSuccess,
  onPayboxCreateOrder,
  onPayboxValidatePayment,
  successMessage = '',
  errorMessage = '',
}: {
  workspace: PortalWorkspace;
  disabled?: boolean;
  onValidate: (paymentOption?: PaymentOption) => Promise<boolean>;
  onPaypalCreatedOrder: () => Promise<any>;
  onPaypalCaptureOrder: (orderID: string) => Promise<any>;
  onApprove: (result: any) => Promise<void>;
  onStripeCreateCheckOutSession: () => Promise<any>;
  shouldValidateData: () => Promise<boolean>;
  onStripeValidateSession: (params: {
    stripeSessionId: string;
  }) => Promise<ErrorResponse | SuccessResponse<{id: ID; version: number}>>;
  onPaymentSuccess?: () => Promise<void> | void;
  onPayboxCreateOrder: ({uri}: {uri: string}) => Promise<any>;
  onPayboxValidatePayment: (params: {
    params: any;
  }) => Promise<ErrorResponse | SuccessResponse<{id: ID; version: number}>>;
  successMessage?: string;
  errorMessage?: string;
}) {
  const config = workspace?.config;
  const allowOnlinePayment = config?.allowOnlinePaymentForEcommerce;
  const paymentOptionSet = config?.paymentOptionSet;

  const allowStripe = isPaymentOptionAvailable(
    paymentOptionSet,
    PaymentOption.stripe,
  );

  const allowPaypal = isPaymentOptionAvailable(
    paymentOptionSet,
    PaymentOption.paypal,
  );

  const allowPaybox = isPaymentOptionAvailable(
    paymentOptionSet,
    PaymentOption.paybox,
  );

  if (!allowOnlinePayment) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2.5">
      {allowPaypal && (
        <Paypal
          disabled={disabled}
          onValidate={() => onValidate()}
          createOrder={onPaypalCreatedOrder}
          captureOrder={onPaypalCaptureOrder}
          onApprove={onApprove}
          successMessage={successMessage}
          errorMessage={errorMessage}
        />
      )}
      {allowStripe && (
        <Stripe
          disabled={disabled}
          onValidate={() => onValidate(PaymentOption.stripe)}
          onCreateCheckOutSession={onStripeCreateCheckOutSession}
          shouldValidateData={shouldValidateData}
          onValidateSession={stripeSessionId =>
            onStripeValidateSession(stripeSessionId)
          }
          onPaymentSuccess={onPaymentSuccess}
          onApprove={onApprove}
          successMessage={successMessage}
          errorMessage={errorMessage}
        />
      )}
      {allowPaybox && (
        <Paybox
          disabled={disabled}
          onValidate={() => onValidate(PaymentOption.paybox)}
          onCreateOrder={onPayboxCreateOrder}
          shouldValidateData={shouldValidateData}
          onValidatePayment={onPayboxValidatePayment}
          onPaymentSuccess={onPaymentSuccess}
          onApprove={onApprove}
        />
      )}
    </div>
  );
}

export default Payments;
