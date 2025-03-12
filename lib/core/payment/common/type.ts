export type PaymentOrder = {
  amount: number;
  context: PaymentContext;
};

export type PaymentContext = {
  id: string;
  version: number;
  data: any;
};
