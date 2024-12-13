'use client';

import {MdAdd, MdOutlineEdit} from 'react-icons/md';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Pagination} from 'swiper/modules';
import {useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {Button, Separator} from '@/ui/components';
import {i18n} from '@/i18n';
import {cn} from '@/utils/css';
import {ADDRESS_TYPE, SUBAPP_CODES, SUBAPP_PAGE} from '@/constants';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {getCityName} from '@/utils';

interface ContentProps {
  quotation: {
    saleOrderSeq: string | number;
    id: number;
    mainInvoicingAddress: {
      id: string | number;
    };
    deliveryAddress: {
      id: string | number;
    };
  };
  invoicingAddresses: any;
  deliveryAddresses: any;
}

const AddressBlock = ({
  id,
  isSelected,
  type,
  address,
  onEdit,
}: {
  id: string | number;
  isSelected: boolean;
  type: ADDRESS_TYPE;
  address: any;
  onEdit: (type: ADDRESS_TYPE, id: string | number) => void;
}) => {
  const cityName = getCityName(address?.addressl6);

  return (
    <div
      key={id}
      className={cn(
        'min-h-56 flex flex-col justify-between gap-4 rounded-lg p-4 border cursor-pointer hover:bg-success-light',
        isSelected ? 'bg-success-light border-black' : 'border-gray-800',
      )}>
      <div className="flex flex-col gap-4">
        {/* <div className="font-semibold text-base">{name}</div> */}
        <div className="font-semibold text-base">Axel Blaze, AB Co.</div>
        <div className="text-sm leading-[1.313rem] font-normal">
          <p>{address?.addressl4}</p>
          <p>{cityName}</p>
          <p>{address?.zip}</p>
          <p>{address?.country?.name}</p>
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          className="h-9 flex gap-2 bg-white hover:bg-success hover:text-white border border-success text-success rounded-md font-base font-medium px-3 py-1.5"
          onClick={() => onEdit(type, id)}>
          <MdOutlineEdit className="w-6 h-6" />
          {i18n.get('Edit')}
        </Button>
      </div>
    </div>
  );
};

const AddressesBlock = ({
  currentAddress,
  addresses,
  type,
  onEdit,
  onCreate,
}: {
  currentAddress: any;
  addresses: any[];
  type: ADDRESS_TYPE;
  onCreate: (type: ADDRESS_TYPE) => void;
  onEdit: (type: ADDRESS_TYPE, id: string | number) => void;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="gap-4">
        <Swiper
          slidesPerView={'auto'}
          spaceBetween={30}
          modules={[Pagination]}
          pagination={{
            dynamicBullets: true,
            horizontalClass: '!bottom-1',
          }}
          className="min-h-[15.5rem]">
          {addresses.map(({address}) => {
            const isSelected = currentAddress.id === address.id;
            return (
              <SwiperSlide key={address.id} className="!w-[17.563rem]">
                <AddressBlock
                  id={address.id}
                  address={address}
                  type={type}
                  isSelected={isSelected}
                  onEdit={onEdit}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
      <Button
        className="w-fit h-9 bg-success hover:bg-success-dark flex items-center gap-2 rounded-md font-base font-medium px-3 py-1.5"
        onClick={() => onCreate(type)}>
        <MdAdd className="w-6 h-6" /> {i18n.get('Create address')}
      </Button>
    </div>
  );
};

function Content({
  quotation,
  invoicingAddresses,
  deliveryAddresses,
}: ContentProps) {
  const {id: quotationId, mainInvoicingAddress, deliveryAddress} = quotation;

  const {workspaceURI} = useWorkspace();
  const router = useRouter();

  const handleCreate = (type: ADDRESS_TYPE) => {
    router.replace(
      `${workspaceURI}/${SUBAPP_CODES.quotations}/${quotationId}/${SUBAPP_PAGE.address}/${type}/${SUBAPP_PAGE.create}`,
    );
  };

  const handleEdit = (type: ADDRESS_TYPE, id: string | number) => {
    router.replace(
      `${workspaceURI}/${SUBAPP_CODES.quotations}/${quotationId}/${SUBAPP_PAGE.address}/${type}/${SUBAPP_PAGE.edit}/${id}`,
    );
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg flex flex-col gap-4">
        <h4 className="text-xl font-medium mb-0">
          {i18n.get('Choose your address')}
        </h4>
        <Separator className="my-2" />

        <div className="border border-gray-400 p-4 rounded-lg flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <div className="font-semibold text-xl">
              {i18n.get('Invoicing address')}
            </div>

            <AddressesBlock
              currentAddress={mainInvoicingAddress}
              addresses={invoicingAddresses}
              type={ADDRESS_TYPE.invoicing}
              onCreate={handleCreate}
              onEdit={handleEdit}
            />
          </div>

          <Separator className="my-2" />
          <div className="flex flex-col gap-4">
            <div className="font-semibold text-xl">
              {i18n.get('Delivery address')}
            </div>
            <AddressesBlock
              currentAddress={deliveryAddress}
              addresses={deliveryAddresses}
              type={ADDRESS_TYPE.delivery}
              onCreate={handleCreate}
              onEdit={handleEdit}
            />
          </div>
        </div>
      </div>
      <Button className="w-full bg-success hover:bg-success-dark py-1.5">
        {i18n.get('Confirm address')}
      </Button>
    </>
  );
}

export default Content;
