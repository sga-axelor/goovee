'use client';

import React, {useState} from 'react';
import {MdCheckCircleOutline, MdOutlineDisabledByDefault} from 'react-icons/md';
import {LiaLongArrowAltRightSolid} from 'react-icons/lia';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
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
  onConfirmQuotation,
}: TotalProps) => {
  const [confirmationDialog, setConfirmationDialog] = useState(false);

  const config = workspace?.config;
  const canConfirmQuotation = true; //config?.canConfirmQuotation;
  const payQuotationToConfirm = config?.payQuotationToConfirm;

  const openConfirmation = () => {
    setConfirmationDialog(true);
  };

  const closeConfirmation = () => {
    setConfirmationDialog(false);
  };

  const handleConfirmQuotation = () => {
    closeConfirmation();

    if (onConfirmQuotation) {
      onConfirmQuotation();
    }
  };

  return (
    <>
      <div className="flex flex-col bg-card text-card-foreground px-6 py-4 rounded-lg border border-card-foreground">
        <h4 className="text-xl font-medium mb-0">
          {i18n.get('Offered price')}
        </h4>
        <Separator className="my-3" />
        <div className="flex flex-col gap-4 mb-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p>{i18n.get('Total WT')}:</p>
              <p>{exTaxTotal}</p>
            </div>
            <div className="flex items-center justify-between">
              <p>{i18n.get('Total ATI')}:</p>
              <p>{inTaxTotal}</p>
            </div>
            <div className="flex items-center justify-between">
              <p>{i18n.get('Discount')}:</p>
              <p>{totalDiscount}%</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <h6 className="font-medium">{i18n.get('Total price')}:</h6>
            <h4 className="text-xl font-medium">{inTaxTotal}</h4>
          </div>
          {statusSelect !== QUOTATION_STATUS.CANCELED_QUOTATION &&
            canConfirmQuotation && (
              <>
                {payQuotationToConfirm ? (
                  <div className="flex justify-center">
                    <Button className="flex items-center justify-center gap-3 rounded-full w-full font-normal">
                      {i18n.get('Pay')}{' '}
                      <LiaLongArrowAltRightSolid className="text-2xl" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <Button
                      className="text-success-foreground bg-success hover:bg-success-dark flex items-center justify-center gap-3 rounded-full w-full"
                      onClick={openConfirmation}>
                      <MdCheckCircleOutline className="text-2xl" />
                      {i18n.get('Accept and sign')}
                    </Button>
                  </div>
                )}
                {false && (
                  <div className="flex justify-center">
                    <Button className="text-destructive-foreground bg-destructive hover:bg-error-dark flex items-center justify-center gap-3 rounded-full w-full font-normal">
                      <MdOutlineDisabledByDefault className="text-2xl" />
                      {i18n.get('Reject')}
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
              {i18n.get('Do you want to confirm quotation?')}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeConfirmation}>
              {i18n.get('Cancel')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmQuotation}>
              {i18n.get('Continue')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
export default Total;
