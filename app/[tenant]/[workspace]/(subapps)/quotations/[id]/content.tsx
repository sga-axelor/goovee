'use client';

import React, {useState} from 'react';
import {MdOutlineRefresh} from 'react-icons/md';
import {useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {useToast} from '@/ui/hooks';
import {Container, Dialog, DialogTitle, DialogContent} from '@/ui/components';
import {i18n} from '@/lib/i18n';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {SUBAPP_CODES} from '@/constants';
import type {PortalWorkspace} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {
  Comments,
  History,
  Informations,
  Total,
  Contacts,
} from '@/subapps/quotations/common/ui/components';
import {QUOTATION_STATUS} from '@/subapps/quotations/common/constants/quotations';
import type {
  CommentsProps,
  Quotation,
} from '@/subapps/quotations/common/types/quotations';
import {confirmQuotation} from './action';

type Props = {
  quotation: Quotation;
  comments: CommentsProps[];
  workspace: PortalWorkspace;
  orderSubapp?: boolean;
};

const Content = ({quotation, comments, workspace, orderSubapp}: Props) => {
  const {
    saleOrderSeq,
    exTaxTotal,
    inTaxTotal,
    endOfValidityDate,
    clientPartner,
    mainInvoicingAddress,
    deliveryAddress,
    company,
    saleOrderLineList,
    totalDiscount,
    statusSelect,
  } = quotation;

  const [confirmingQuotation, setConfirmingQuotation] = useState(false);
  const {toast} = useToast();
  const router = useRouter();
  const {workspaceURL, workspaceURI} = useWorkspace();

  const handleConfirmQuotation = async () => {
    setConfirmingQuotation(true);

    try {
      const result = await confirmQuotation({
        workspaceURL,
        quotationId: quotation.id as string,
      });

      setConfirmingQuotation(false);

      if (result.error) {
        toast({
          title: result.message,
          variant: 'destructive',
        });

        return;
      }

      toast({
        title: i18n.get('Quotation confirmed'),
        variant: 'success',
      });

      if (orderSubapp) {
        router.replace(
          `${workspaceURI}/${SUBAPP_CODES.quotations}/${result?.order?.id}`,
        );
      } else {
        router.replace(`${workspaceURI}/shop`);
      }
    } catch (err) {
      toast({
        title: i18n.get('Error confirming quotation'),
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Container title={`${i18n.get('Quotation')} ${saleOrderSeq}`}>
        <Informations
          endOfValidityDate={endOfValidityDate}
          statusSelect={statusSelect}
        />
        <div className="flex flex-col-reverse xl:flex-row gap-6 xl:gap-4">
          <div
            className={`${statusSelect !== QUOTATION_STATUS.DRAFT_QUOTATION ? 'lg:basis-3/4' : 'lg:basis-full'} flex flex-col gap-6 basis-full`}>
            <Contacts
              clientPartner={clientPartner}
              company={company}
              mainInvoicingAddress={mainInvoicingAddress}
              deliveryAddress={deliveryAddress}
              saleOrderLineList={saleOrderLineList}
            />
            <History />
            <Comments comments={comments} />
          </div>
          {/* {statusSelect !== QUOTATION_STATUS.DRAFT_QUOTATION && ( */}
          <div className="flex flex-col gap-6 basis-full lg:basis-1/4">
            <Total
              exTaxTotal={exTaxTotal}
              inTaxTotal={inTaxTotal}
              statusSelect={statusSelect}
              totalDiscount={totalDiscount}
              workspace={workspace}
              onConfirmQuotation={handleConfirmQuotation}
            />
          </div>
          {/* )} */}
        </div>
      </Container>
      <Dialog open={confirmingQuotation}>
        <DialogTitle></DialogTitle>
        <DialogContent className="w-40 flex items-center justify-center">
          <MdOutlineRefresh className="h-6 w-6 animate-spin" />
        </DialogContent>
      </Dialog>
    </>
  );
};
export default Content;
