'use client';

import React from 'react';

// ---- CORE IMPORTS ---- //
import {Container} from '@/ui/components';
import {i18n} from '@/i18n';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {download} from '@/utils/files';
import {RELATED_MODELS} from '@/constants/models';
import {useToast} from '@/ui/hooks';
import {SUBAPP_CODES} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import {
  Contact,
  ContactUs,
  History,
  Informations,
  Total,
  PaymentMethod,
  ProductsList,
} from '@/subapps/orders/common/ui/components';
import {getStatus} from '@/subapps/orders/common/utils/orders';
import {ORDER_TYPE} from '@/subapps/orders/common/constants/orders';
import {getFile} from '@/subapps/orders/common/actions/file';

const Content = ({order}: {order: any}) => {
  const {
    saleOrderSeq,
    exTaxTotal,
    inTaxTotal,
    createdOn,
    shipmentMode,
    statusSelect,
    deliveryState,
    clientPartner,
    mainInvoicingAddress,
    deliveryAddress,
    company,
    saleOrderLineList,
    totalDiscount,
    id,
  } = order;
  const {status, variant} = getStatus(statusSelect, deliveryState);
  const showContactUs = ![ORDER_TYPE.CLOSED].includes(status);

  const {workspaceURL, tenant} = useWorkspace();
  const {toast} = useToast();

  const handleInvoiceDownload = async () => {
    try {
      const result = await getFile({
        modelId: id,
        workspaceURL,
        modelName: RELATED_MODELS.SALE_ORDER_MODEL,
        subapp: SUBAPP_CODES.orders,
      });

      if (result?.error) {
        toast({
          variant: 'destructive',
          description: i18n.get(result.message),
        });
        return;
      }

      download(result, tenant);
    } catch (error) {
      console.error('Unexpected error during invoice download:', error);
    }
  };

  return (
    <>
      <Container title={`${i18n.get('Order number')} ${saleOrderSeq}`}>
        <Informations
          createdOn={createdOn}
          shipmentMode={shipmentMode}
          status={status}
          variant={variant}
          onDownload={handleInvoiceDownload}
        />
        <div className="flex flex-col-reverse lg:flex-row gap-6 lg:gap-4">
          <div className="flex flex-col gap-6 basis-full md:basis-3/4">
            <div className="flex flex-col gap-4  bg-card text-card-foreground p-6 rounded-lg">
              <Contact
                clientPartner={clientPartner}
                company={company}
                mainInvoicingAddress={mainInvoicingAddress}
                deliveryAddress={deliveryAddress}
                saleOrderLineList={saleOrderLineList}
              />
              <ProductsList
                saleOrderLineList={saleOrderLineList}
                tenant={tenant}
              />
              {false && <PaymentMethod />}
            </div>
            {false && <History />}
            {showContactUs && <ContactUs />}
          </div>
          <Total
            exTaxTotal={exTaxTotal}
            inTaxTotal={inTaxTotal}
            totalDiscount={totalDiscount}
          />
        </div>
      </Container>
    </>
  );
};
export default Content;
