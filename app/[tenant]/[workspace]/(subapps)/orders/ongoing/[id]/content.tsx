'use client';

import React, {useState} from 'react';

// ---- CORE IMPORTS ---- //
import {Container} from '@/ui/components';
import {i18n} from '@/locale';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {download} from '@/utils/files';
import {useToast} from '@/ui/hooks';
import {SUBAPP_CODES, RELATED_MODELS} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import {
  Contact,
  ContactUs,
  History,
  Informations,
  Total,
  PaymentMethod,
  ProductsList,
  ExpandableCard,
} from '@/subapps/orders/common/ui/components';
import {getStatus} from '@/subapps/orders/common/utils/orders';
import {
  ORDER_TYPE,
  INVOICE_TYPE,
} from '@/subapps/orders/common/constants/orders';
import {getFile} from '@/subapps/orders/common/actions/file';

const Content = ({order}: {order: any}) => {
  const [loading, setLoading] = useState<{[key: string]: boolean}>({});

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
    invoices,
    customerDeliveries,
  } = order;

  const {status, variant} = getStatus(statusSelect, deliveryState);
  const showContactUs = ![ORDER_TYPE.CLOSED].includes(status);

  const {workspaceURL, tenant} = useWorkspace();
  const {toast} = useToast();

  const handleDownload = async (
    params: any,
    uniqueKey: string,
    errorMessage: string,
  ) => {
    setLoading(prev => ({...prev, [uniqueKey]: true}));
    try {
      const result: any = await getFile(params);

      if (result?.error) {
        toast({
          variant: 'destructive',
          description: i18n.t(result.message),
        });
        return;
      }

      download(result, tenant);
    } catch (error) {
      console.error(errorMessage, error);
      toast({
        variant: 'destructive',
        description: i18n.t(
          'An unexpected error occurred. Please try again later.',
        ),
      });
    } finally {
      setLoading(prev => ({...prev, [uniqueKey]: false}));
    }
  };

  const handleOrderInvoiceDownload = async () =>
    await handleDownload(
      {
        id,
        workspaceURL,
        modelName: RELATED_MODELS.SALE_ORDER,
        subapp: SUBAPP_CODES.orders,
        type: INVOICE_TYPE.order,
      },
      `orderInvoice-${id}`,
      'Unexpected error during order invoice download:',
    );

  const handleInvoiceDownload = async (record: any) =>
    await handleDownload(
      {
        id: record.id,
        workspaceURL,
        modelName: RELATED_MODELS.INVOICE,
        subapp: SUBAPP_CODES.orders,
        type: INVOICE_TYPE.invoice,
      },
      `invoice-${record.id}`,
      'Unexpected error during invoice download:',
    );

  const handleCustomerDeliveryPDFDownload = async (record: any) =>
    await handleDownload(
      {
        id: record.id,
        workspaceURL,
        modelName: RELATED_MODELS.STOCK_MOVE,
        subapp: SUBAPP_CODES.orders,
        type: INVOICE_TYPE.customers_delivery,
      },
      `customerDelivery-${record.id}`,
      'Unexpected error during customer delivery download:',
    );

  return (
    <Container title={`${i18n.t('Order number')} ${saleOrderSeq}`}>
      <Informations
        createdOn={createdOn}
        shipmentMode={shipmentMode}
        status={status}
        variant={variant}
        onDownload={handleOrderInvoiceDownload}
        isDisabled={loading[`orderInvoice-${id}`] || false}
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
        <div className="flex flex-col gap-6 basis-full md:basis-1/4">
          <Total
            exTaxTotal={exTaxTotal}
            inTaxTotal={inTaxTotal}
            totalDiscount={totalDiscount}
          />
          <ExpandableCard
            title={i18n.t('Invoice')}
            records={invoices}
            isDisabled={record => loading[`invoice-${record.id}`] || false}
            onDownload={handleInvoiceDownload}
          />
          <ExpandableCard
            title={i18n.t('Customer delivery')}
            records={customerDeliveries}
            isDisabled={record =>
              loading[`customerDelivery-${record.id}`] || false
            }
            onDownload={handleCustomerDeliveryPDFDownload}
          />
        </div>
      </div>
    </Container>
  );
};

export default Content;
