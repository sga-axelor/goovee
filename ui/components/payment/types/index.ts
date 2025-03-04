export type PaypalProps = {
  disabled?: boolean;
  onApprove: (result: any) => void;
  onValidate?: (paymentOption: string) => Promise<boolean>;
  createOrder: () => Promise<{
    order?: {id: string};
    error?: any;
    message?: string;
  }>;
  captureOrder: (orderID: string) => Promise<any>;
  successMessage?: string;
  errorMessage?: string;
};

export type StripeProps = {
  disabled?: boolean;
  successMessage?: string;
  errorMessage?: string;
  onValidate?: (paymentOption: string) => Promise<boolean>;
  onCreateCheckOutSession: () => Promise<{
    url?: string | null;
    error?: boolean;
    message?: string;
    client_secret?: string | null;
  }>;
  shouldValidateData: () => Promise<boolean>;
  onValidateSession: (params: {stripeSessionId: string}) => Promise<any>;
  onApprove?: (result: any) => void;
  onPaymentSuccess?: () => any;
};

export type PayboxProps = {
  disabled?: boolean;
  successMessage?: string;
  errorMessage?: string;
  onValidate?: (paymentOption: string) => Promise<boolean>;
  onCreateOrder: ({uri}: {uri: string}) => Promise<any>;
  shouldValidateData: () => Promise<boolean>;
  onValidatePayment: ({
    params,
  }: {
    params: Record<string, string>;
  }) => Promise<any>;
  onPaymentSuccess?: () => void;
  onApprove: (result: any) => void;
};
