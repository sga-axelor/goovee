'use client';

// ---- CORE IMPORTS ---- //
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {SUBAPP_CODES} from '@/constants';
import {i18n} from '@/locale';
import {Container} from '@/ui/components';

// ---- LOCAL IMPORTS ---- //
import {
  CUSTOMER_DELIVERY,
  DOWNLOAD_PDF,
  INVOICE,
  ORDER_NUMBER,
  ORDER_TYPE,
} from '@/subapps/orders/common/constants/orders';
import {
  Contact,
  ContactUs,
  DownloadButton,
  ExpandableCard,
  History,
  Informations,
  PaymentMethod,
  ProductsList,
  Total,
} from '@/subapps/orders/common/ui/components';
import {getStatus} from '@/subapps/orders/common/utils/orders';

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
    invoices,
    customerDeliveries,
  } = order;
  const {status, variant} = getStatus(statusSelect, deliveryState);
  const showContactUs = ![ORDER_TYPE.CLOSED].includes(status);

  const {workspaceURL, tenant} = useWorkspace();

  return (
    <>
      <Container title={`${i18n.t(ORDER_NUMBER)} ${saleOrderSeq}`}>
        <Informations
          createdOn={createdOn}
          shipmentMode={shipmentMode}
          status={status}
          variant={variant}
          orderId={id}
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

                      <DownloadButton
                        downloadURL={`${workspaceURL}/${SUBAPP_CODES.orders}/api/order/${id}/invoice/${record.id}`}
                        title={i18n.t(DOWNLOAD_PDF)}
                      />
                    </div>
                  );
                })}
              </ExpandableCard>
            ) : null}

            {customerDeliveries.length ? (
              <ExpandableCard title={i18n.t(CUSTOMER_DELIVERY)}>
                {customerDeliveries.map((record: any) => {
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
                      <DownloadButton
                        title={i18n.t(DOWNLOAD_PDF)}
                        downloadURL={`${workspaceURL}/${SUBAPP_CODES.orders}/api/order/${id}/customer-delivery/${record.id}`}
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
