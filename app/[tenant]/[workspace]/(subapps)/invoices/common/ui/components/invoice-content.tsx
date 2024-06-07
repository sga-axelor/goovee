'use client';
// ---- CORE IMPORTS ---- //
import { parseDate } from '@/utils';
import { i18n } from '@/lib/i18n';
// ---- LOCAL IMPORTS ---- //
import { InvoiceTable } from '.';
export function InvoiceContent({ invoice }: { invoice: any }) {
  const {
    invoiceId,
    dueDate,
    invoiceDate,
    amountRemaining,
    note,
    invoiceLineList,
    exTaxTotal,
    inTaxTotal,
    taxTotal,
    company,
    partner,
    paymentCondition,
  } = invoice;
  const {
    address: {
      addressl4,
      addressl6,
      addressl7country: { name: countryName },
      zip,
    },
    name,
  } = company;
  const companyPartnerNumber = company.partner.fixedPhone.replace(/\./g, '-');
  const companyCityName = addressl6.split(' ').pop();
  const { simpleFullName, mainAddress } = partner;
  const partnerNumber = partner.fixedPhone.replace(/\./g, '-');
  const partnerCityName = mainAddress.addressl6.split(' ').pop();

  return (
    <>
      <div className="rounded-lg border shadow px-12 py-12 w-full overflow-auto">
        <div className="min-w-[837px] lg:min-w-[100%] overflow-x-auto">
          <div className="flex justify-between mb-12">
            <h2 style={{ fontSize: "48px" }} className="uppercase">
              {i18n.get('Invoice')}
            </h2>
            <div className='text-right'>
              <h6 className="font-bold">{name}</h6>
              <p className="mb-0">{addressl4}</p>
              <p className="mb-0">{companyCityName}</p>
              <p className="mb-0">{zip}</p>
              <p className="mb-0">{countryName}</p>
              <p className="mb-0">{companyPartnerNumber}</p>
            </div>
          </div>
          <div
            className="flex w-full gap-12 mb-6 pb-[64px] border-b-[3px] border-solid border-[#2924BF]">
            <div className="flex-1">
              <h6 className="text-[#7441C4] font-medium">
                {i18n.get('Billed To')}
              </h6>
              <p className="mb-0">{simpleFullName}</p>
              <p className="mb-0">{mainAddress.addressl4}</p>
              <p className="mb-0">{partnerCityName}</p>
              <p className="mb-0">{mainAddress.zip}</p>
              <p className="mb-0">{mainAddress.addressl7country.name}</p>
              <p className="mb-0">{partnerNumber}</p>
            </div>
            <div className="flex-1 flex flex-col gap-8">
              <div className="flex justify-between">
                <div>
                  <h6 className="text-[#7441C4] font-medium">
                    {i18n.get('Date Issued')}
                  </h6>
                  <p className="mb-0">{parseDate(invoiceDate)}</p>
                </div>
                <div>
                  <h6 className="text-[#7441C4] font-medium">
                    {i18n.get('Invoice Number')}
                  </h6>
                  <p className="mb-0">{invoiceId}</p>
                </div>
                <div>
                  <h6 className="text-[#7441C4] font-medium">
                    {i18n.get('Amount Due')}
                  </h6>
                  <p className="mb-0 font-bold">
                    {amountRemaining.value} {amountRemaining.symbol}
                  </p>
                </div>
              </div>
              <div className="flex">
                <div>
                  <h6 className="text-[#7441C4] font-medium">
                    {i18n.get('Due Date')}
                  </h6>
                  <p className="mb-0">{parseDate(dueDate)}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <InvoiceTable
              invoiceLineList={invoiceLineList}
              exTaxTotal={exTaxTotal}
              inTaxTotal={inTaxTotal}
              amountRemaining={amountRemaining}
              taxTotal={taxTotal}
            />
          </div>
          <div className="mb-4">
            <h6 className="text-[#7441C4] font-medium">
              {i18n.get('Notes')}
            </h6>
            <p className="mb-0">{note}</p>
          </div>
          <div>
            <h6 className="text-[#7441C4] font-medium">
              {i18n.get('Terms')}
            </h6>
            <p className="mb-0">{paymentCondition.name}</p>
          </div>
        </div>
      </div>
    </>
  );
}
export default InvoiceContent;