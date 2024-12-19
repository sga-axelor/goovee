'use client';

import {MdAdd} from 'react-icons/md';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Pagination} from 'swiper/modules';

// ---- CORE IMPORTS ---- //
import {Button} from '@/ui/components';
import {i18n} from '@/i18n';
import {ADDRESS_TYPE} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import {AddressCard} from '@/app/[tenant]/[workspace]/account/addresses/common/ui/components';

export const AddressesList = ({
  isFromQuotation,
  currentAddress,
  addresses,
  type,
  onEdit,
  onCreate,
  onSelect,
}: {
  isFromQuotation?: boolean;
  currentAddress?: {id: string | number} | null;
  addresses: {id: string | number; address: any}[];
  type: ADDRESS_TYPE;
  onCreate: (type: ADDRESS_TYPE) => void;
  onEdit: (type: ADDRESS_TYPE, id: string | number) => void;
  onSelect?: (type: ADDRESS_TYPE, address: any) => void;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="">
        <Swiper
          slidesPerView="auto"
          spaceBetween={30}
          modules={[Pagination]}
          pagination={{
            dynamicBullets: true,
            horizontalClass: '!bottom-0',
          }}
          className="min-h-[15.5rem] flex">
          {addresses.map(({id, address}) => {
            const isSelected = isFromQuotation
              ? currentAddress?.id === address.id
              : currentAddress?.id === id;

            return (
              <SwiperSlide key={address.id} className="!w-[17.563rem] !h-auto">
                <AddressCard
                  id={id}
                  address={address}
                  type={type}
                  isSelected={isSelected}
                  onEdit={onEdit}
                  onSelect={() => onSelect?.(type, {id, address})}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      <Button
        className="w-fit h-9 bg-success hover:bg-success-dark flex items-center gap-2 rounded-md font-medium px-3 py-1.5"
        onClick={() => onCreate(type)}>
        <MdAdd className="w-6 h-6" />
        {i18n.get('Create address')}
      </Button>
    </div>
  );
};

export default AddressesList;
