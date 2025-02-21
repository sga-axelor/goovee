'use client';

import React, {useState} from 'react';

// ---- CORE IMPORTS ---- //
import {Container} from '@/ui/components';
import {i18n} from '@/locale';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {download} from '@/utils/files';
import {useToast} from '@/ui/hooks';
import {SUBAPP_CODES, RELATED_MODELS, INVOICE_ENTITY_TYPE} from '@/constants';
import {getFile} from '@/app/actions/file';

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
  DownlaodButton,
} from '@/subapps/orders/common/ui/components';
import {getStatus} from '@/subapps/orders/common/utils/orders';
import {
  ORDER_TYPE,
  ORDER_NUMBER,
  INVOICE,
  CUSTOMER_DELIVERY,
  DOWNLOAD_PDF,
} from '@/subapps/orders/common/constants/orders';

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

      download(result.data, tenant);
    } catch (error) {
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
        id: id,
        workspaceURL,
        modelName: RELATED_MODELS.SALE_ORDER,
        subapp: SUBAPP_CODES.orders,
        type: INVOICE_ENTITY_TYPE.ORDER,
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
        type: INVOICE_ENTITY_TYPE.INVOICE,
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
        type: INVOICE_ENTITY_TYPE.CUSTOMER_DELIVERY,
      },
      `customerDelivery-${record.id}`,
      'Unexpected error during customer delivery download:',
    );

  return (
    <>
      <Container title={`${i18n.t(ORDER_NUMBER)} ${saleOrderSeq}`}>
        <Informations
          createdOn={createdOn}
          shipmentMode={shipmentMode}
          status={status}
          variant={variant}
          onDownload={handleOrderInvoiceDownload}
          isDisabled={loading[`orderInvoice-${id}`] || false}
        />
        <div className="flex flex-col-reverse xl:flex-row gap-6 xl:gap-4">
          <div className="flex flex-col gap-6 basis-full md:basis-3/4">
            <div className="flex flex-col gap-4  bg-card text-card-foreground p-6 rounded-lg">
              <Contact
                clientPartner={clientPartner}
                company={company}
                mainInvoicingAddress={mainInvoicingAddress}
                deliveryAddress={deliveryAddress}
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

            {invoices?.length ? (
              <ExpandableCard title={i18n.t(INVOICE)}>
                {invoices.map((record: any) => {
                  const isDisabled = loading[`invoice-${record.id}`] || false;

                  return (
                    <div key={record.id} className="flex flex-col gap-4 mb-4">
                      <div className="flex flex-col gap-2 text-sm">
                        <div className="flex gap-4 justify-between">
                          <div className="font-medium">{i18n.t('Number')}:</div>
                          <div>{record.invoiceId}</div>
                        </div>
                        <div className="flex gap-4 justify-between">
                          <div className="font-medium">
                            {i18n.t('Created on')}:
                          </div>
                          <div>{record.createdOn}</div>
                        </div>
                      </div>

                      <DownlaodButton
                        disabled={isDisabled}
                        record={record}
                        title={i18n.t(DOWNLOAD_PDF)}
                        onDownload={handleInvoiceDownload}
                      />
                    </div>
                  );
                })}
              </ExpandableCard>
            ) : null}

            {customerDeliveries.length ? (
              <ExpandableCard title={i18n.t(CUSTOMER_DELIVERY)}>
                {customerDeliveries.map((record: any) => {
                  const isDisabled =
                    loading[`customerDelivery-${record.id}`] || false;

                  return (
                    <div key={record.id} className="flex flex-col gap-4 mb-4">
                      <div className="flex flex-col gap-2 text-sm">
                        <div className="flex gap-4 justify-between">
                          <div className="font-medium">{i18n.t('Number')}:</div>
                          <div>{record.stockMoveSeq}</div>
                        </div>
                        <div className="flex gap-4 justify-between">
                          <div className="font-medium">
                            {i18n.t('Created on')}:
                          </div>
                          <div>{record.createdOn}</div>
                        </div>
                      </div>
                      <DownlaodButton
                        disabled={isDisabled}
                        record={record}
                        title={i18n.t(DOWNLOAD_PDF)}
                        onDownload={handleCustomerDeliveryPDFDownload}
                      />
                    </div>
                  );
                })}
              </ExpandableCard>
            ) : null}
          </div>
        </div>
      </Container>
    </>
  );
};

export default Content;
