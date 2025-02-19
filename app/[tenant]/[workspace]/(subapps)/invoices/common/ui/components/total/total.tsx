'use client';

import {MdArrowBack} from 'react-icons/md';
import React, {useEffect, useState} from 'react';
import {z} from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/locale';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Separator,
} from '@/ui/components';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {formatNumber} from '@/locale/formatters';

// ---- LOCAL IMPORTS ---- //
import {TotalProps} from '@/subapps/invoices/common/types/invoices';
import {INVOICE_PAYMENT_OPTIONS} from '@/subapps/invoices/common/constants/invoices';

export function Total({
  exTaxTotal,
  inTaxTotal,
  isUnpaid,
  workspace,
  invoicePaymentList,
  taxTotal,
  amountRemaining,
  currency,
}: TotalProps) {
  const [show, setShow] = useState(true);

  const config = workspace?.config;
  const allowOnlinePayment = config?.allowOnlinePaymentForEcommerce;
  const canPayInvoice = config?.canPayInvoice;
  const paymentOptionSet = config?.paymentOptionSet;

  const allowInvoicePayment =
    isUnpaid &&
    allowOnlinePayment &&
    canPayInvoice !== INVOICE_PAYMENT_OPTIONS.NO &&
    Boolean(paymentOptionSet?.length);
  const canPayPartialInvoice =
    canPayInvoice === INVOICE_PAYMENT_OPTIONS.PARTIAL;

  const remainingAmountValue = parseFloat(amountRemaining?.value || '0');

  const formSchema = z.object({
    amount: z
      .number()
      .min(1, i18n.t('Amount must be at least 1'))
      .max(
        remainingAmountValue,
        i18n.t(`Amount cannot exceed ${amountRemaining?.formattedValue}`),
      ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: {onChange: (value: string) => void},
  ) => {
    const value = e.target.value;

    if (value === '') {
      field.onChange('');
      return;
    }

    if (
      /^\d*\.?\d*$/.test(value) &&
      parseFloat(value) <= remainingAmountValue
    ) {
      field.onChange(value);
    }
  };

  const onSubmit = async () => {
    setShow(true);
  };

  useEffect(() => {
    if (canPayPartialInvoice) {
      setShow(false);
    }
  }, [canPayPartialInvoice]);

  const currentAmount = form.watch('amount');

  return (
    <div
      className="flex basis-full md:basis-1/4 flex-col bg-card text-card-foreground p-4 md:p-6 border rounded-lg border-card-foreground mt-6 md:mt-0"
      style={{height: 'fit-content'}}>
      <h4 className="text-xl font-medium mb-0">{i18n.t('Total')}</h4>
      <Separator className="my-3" />
      <div className="flex flex-col gap-4 mb-3">
        <div className="flex flex-col gap-[0.5rem] text-base">
          <div className="flex items-center justify-between">
            <p>{i18n.t('Total WT')}:</p>
            <p>{exTaxTotal}</p>
          </div>
          <div className="flex items-center justify-between">
            <p>{i18n.t('Taxes')}:</p>
            <p>{taxTotal}</p>
          </div>
          <div className="flex items-center justify-between">
            <h6 className="font-medium">{i18n.t('Total ATI')}:</h6>
            <h6 className="font-medium">{inTaxTotal}</h6>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-base">
          {invoicePaymentList?.map(list => (
            <div key={list.id} className="flex justify-between gap-2">
              <div>
                {i18n.t('Paid on')} {list.paymentDate}:{' '}
              </div>
              {list.amount}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-4 font-medium text-xl">
          <div>{i18n.t('Remaining to pay')}:</div>
          <div className="ml-auto">{amountRemaining?.formattedValue}</div>
        </div>
      </div>
      {allowInvoicePayment && canPayPartialInvoice && !show && (
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-col gap-4">
            <Button
              variant={'success'}
              className="text-white font-medium"
              onClick={() => {
                form.setValue('amount', remainingAmountValue);
                form.handleSubmit(onSubmit)();
              }}>
              {i18n.t('Pay all')}
            </Button>
            <Button
              variant={'success'}
              className="text-white font-medium"
              onClick={form.handleSubmit(onSubmit)}>
              {i18n.t('Partially pay')}
            </Button>
          </div>
          <Form {...form}>
            <form className="space-y-4">
              <FormField
                control={form.control}
                name="amount"
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={i18n.t('Enter the amount to pay')}
                        value={field.value}
                        onChange={e => handleChange(e, field)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      )}
      {allowInvoicePayment && show && (
        <div className="flex flex-col gap-2.5">
          {canPayPartialInvoice && (
            <>
              <div className="flex items-center gap-2.5">
                <MdArrowBack
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => setShow(false)}
                />
                <span className="text-xl font-medium">
                  {`${i18n.t('Pay partially')}: ${formatNumber(
                    currentAmount || 0,
                    {currency: currency.symbol},
                  )}`}
                </span>
              </div>
              <Separator />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Total;
