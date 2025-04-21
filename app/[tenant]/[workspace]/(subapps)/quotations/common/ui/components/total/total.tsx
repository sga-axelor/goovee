'use client';

import React, {useState} from 'react';
import {MdCheckCircleOutline, MdOutlineDisabledByDefault} from 'react-icons/md';
import {LiaLongArrowAltRightSolid} from 'react-icons/lia';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/locale';
import {
  Separator,
  Button,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/ui/components';

// ---- LOCAL IMPORTS ---- //
import {QUOTATION_STATUS} from '@/subapps/quotations/common/constants/quotations';
import type {TotalProps} from '@/subapps/quotations/common/types/quotations';

export const Total = ({
  exTaxTotal,
  inTaxTotal,
  totalDiscount,
  statusSelect,
  workspace,
  hideDiscount,
  onConfirmQuotation,
  renderPaymentOptions,
}: TotalProps) => {
  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const [paymentSelectionDialog, setPaymentSelectionDialog] = useState(false);

  const config = workspace?.config;

  const allowOnlinePayment = config?.allowOnlinePaymentForEcommerce;

  const canConfirmQuotation = config?.canConfirmQuotation;
  const payQuotationToConfirm = config?.payQuotationToConfirm;

  const openConfirmation = () => {
    setConfirmationDialog(true);
  };

  const closeConfirmation = () => {
    setConfirmationDialog(false);
  };

  const openPaymentSelectionDialog = () => {
    setPaymentSelectionDialog(true);
  };

  const closePaymentSelectionDialog = () => {
    setPaymentSelectionDialog(false);
  };

  const handleConfirmQuotation = () => {
    closeConfirmation();

    if (onConfirmQuotation) {
      onConfirmQuotation();
    }
  };

  return (
    <>
      <div className="flex flex-col bg-card text-card-foreground px-6 py-4 rounded-lg">
        <h4 className="text-xl font-medium mb-0">{i18n.t('Offered price')}</h4>
        <Separator className="my-2.5" />
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p>{i18n.t('Total WT')}:</p>
              <p className="whitespace-nowrap">{exTaxTotal}</p>
            </div>
            <div className="flex items-center justify-between">
              <p>{i18n.t('Total ATI')}:</p>
              <p className="whitespace-nowrap">{inTaxTotal}</p>
            </div>
            {!hideDiscount && (
              <div className="flex items-center justify-between">
                <p>{i18n.t('Discount')}:</p>
                <p className="whitespace-nowrap">{totalDiscount}%</p>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <h6 className="font-medium">{i18n.t('Total price')}:</h6>
            <h4 className="text-xl font-medium whitespace-nowrap">
              {inTaxTotal}
            </h4>
          </div>
          {statusSelect !== QUOTATION_STATUS.CANCELED_QUOTATION &&
            canConfirmQuotation && (
              <>
                {allowOnlinePayment && payQuotationToConfirm ? (
                  <div className="flex justify-center">
                    <Button
                      className="flex items-center justify-center gap-3 rounded-full w-full font-normal"
                      onClick={openPaymentSelectionDialog}>
                      {i18n.t('Pay')}{' '}
                      <LiaLongArrowAltRightSolid className="text-2xl" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <Button
                      className="text-success-foreground bg-success hover:bg-success-dark flex items-center justify-center gap-3 rounded-full w-full"
                      onClick={openConfirmation}>
                      <MdCheckCircleOutline className="text-2xl" />
                      {i18n.t('Accept and sign')}
                    </Button>
                  </div>
                )}
                {false && (
                  <div className="flex justify-center">
                    <Button className="text-destructive-foreground bg-destructive hover:bg-error-dark flex items-center justify-center gap-3 rounded-full w-full font-normal">
                      <MdOutlineDisabledByDefault className="text-2xl" />
                      {i18n.t('Reject')}
                    </Button>
                  </div>
                )}
              </>
            )}
        </div>
      </div>
      <AlertDialog open={Boolean(confirmationDialog)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {i18n.t('Do you want to confirm quotation?')}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeConfirmation}>
              {i18n.t('Cancel')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmQuotation}>
              {i18n.t('Continue')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={Boolean(paymentSelectionDialog)}
        onOpenChange={closePaymentSelectionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{i18n.t('Quotation Payment')}</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="p-4 flex flex-col gap-2">
            {renderPaymentOptions && renderPaymentOptions()}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeConfirmation}>
              {i18n.t('Cancel')}
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Total;
