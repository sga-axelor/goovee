'use client';

import {MdAdd, MdOutlineEdit} from 'react-icons/md';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Pagination} from 'swiper/modules';
import {useRouter} from 'next/navigation';
import {useState, useTransition} from 'react';

// ---- CORE IMPORTS ---- //
import {Button, Separator} from '@/ui/components';
import {i18n} from '@/i18n';
import {cn} from '@/utils/css';
import {ADDRESS_TYPE, SUBAPP_CODES, SUBAPP_PAGE} from '@/constants';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {useToast} from '@/ui/hooks';

// ---- LOCAL IMPORTS ---- //
import {confirmAddresses} from '@/subapps/quotations/[id]/action';

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

const AddressCard = ({
  id,
  isSelected,
  type,
  address,
  onSelect,
  onEdit,
}: {
  id: string | number;
  isSelected: boolean;
  type: ADDRESS_TYPE;
  address: {
    firstName?: string;
    lastName?: string;
    companyName?: string;
    addressl4?: string;
    addressl6?: string;
    zip?: string;
    country?: {name: string};
  };
  onSelect: (type: ADDRESS_TYPE, address: any) => void;
  onEdit: (type: ADDRESS_TYPE, id: string | number) => void;
}) => {
  const {
    firstName = '',
    lastName = '',
    companyName = '',
    addressl4 = '',
    addressl6 = '',
    zip = '',
    country,
  } = address;

  const handleSelect = () => onSelect(type, address);
  const handleEdit = () => onEdit(type, id);
  const formatAddressHeader = (
    firstName: string,
    lastName: string,
    companyName: string,
  ) => {
    const nameParts = [firstName, lastName].filter(Boolean).join(' ');
    return [nameParts, companyName].filter(Boolean).join(', ');
  };

  return (
    <div
      onClick={handleSelect}
      className={cn(
        'min-h-56 flex flex-col justify-between gap-4 rounded-lg p-4 border cursor-pointer hover:bg-success-light h-full',
        isSelected ? 'bg-success-light border-black' : 'border-gray-800',
      )}>
      <div className="flex flex-col gap-4">
        <div className="font-semibold text-base line-clamp-2">
          {formatAddressHeader(firstName, lastName, companyName)}
        </div>
        <div className="text-sm leading-[1.313rem] font-normal">
          {[addressl4, addressl6, zip, country?.name].map(
            (line, index) => line && <p key={index}>{line}</p>,
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          className="h-9 flex items-center gap-2 bg-white hover:bg-success hover:text-white border border-success text-success rounded-md font-medium px-3 py-1.5"
          onClick={e => {
            e.stopPropagation();
            handleEdit();
          }}>
          <MdOutlineEdit className="w-6 h-6" />
          {i18n.get('Edit')}
        </Button>
      </div>
    </div>
  );
};

const AddressesList = ({
  currentAddress,
  addresses,
  type,
  onEdit,
  onCreate,
  onSelect,
}: {
  currentAddress: any;
  addresses: any[];
  type: ADDRESS_TYPE;
  onCreate: (type: ADDRESS_TYPE) => void;
  onEdit: (type: ADDRESS_TYPE, id: string | number) => void;
  onSelect: (type: ADDRESS_TYPE, id: string | number) => void;
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
            horizontalClass: '!bottom-0',
          }}
          className="min-h-[15.5rem]">
          {addresses.map(({address}) => {
            const isSelected = currentAddress?.id === address.id;
            return (
              <SwiperSlide key={address.id} className="!w-[17.563rem] !h-auto">
                <AddressCard
                  id={address.id}
                  address={address}
                  type={type}
                  isSelected={isSelected}
                  onEdit={onEdit}
                  onSelect={onSelect}
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
  const [selectedAddresses, setSelectedAddresses] = useState({
    invoicing: quotation.mainInvoicingAddress || null,
    delivery: quotation.deliveryAddress || null,
  });

  const [isPending, startTransition] = useTransition();

  const {id: quotationId} = quotation;
  const {workspaceURI, workspaceURL} = useWorkspace();
  const router = useRouter();
  const {toast} = useToast();

  const handleCreate = (type: ADDRESS_TYPE) => {
    router.push(
      `${workspaceURI}/${SUBAPP_CODES.quotations}/${quotationId}/${SUBAPP_PAGE.address}/${type}/${SUBAPP_PAGE.create}`,
    );
  };

  const handleEdit = (type: ADDRESS_TYPE, id: string | number) => {
    router.push(
      `${workspaceURI}/${SUBAPP_CODES.quotations}/${quotationId}/${SUBAPP_PAGE.address}/${type}/${SUBAPP_PAGE.edit}/${id}`,
    );
  };

  const handleAddressSelection = (type: ADDRESS_TYPE, address: any) => {
    setSelectedAddresses(prev => ({...prev, [type]: address}));
  };

  const handleConfirm = () => {
    startTransition(async () => {
      const payload = {
        invoicingAddress: selectedAddresses.invoicing,
        deliveryAddress: selectedAddresses.delivery,
      };

      try {
        const result = await confirmAddresses({
          workspaceURL,
          subAppCode: SUBAPP_CODES.quotations,
          record: {
            ...quotation,
            deliveryAddress: payload.deliveryAddress,
            mainInvoicingAddress: payload.invoicingAddress,
          },
        });

        if (result.error) {
          toast({
            variant: 'destructive',
            description: i18n.get(result?.message || ''),
          });
        } else {
          toast({
            variant: 'success',
            title: i18n.get('Address changes saved successfully!'),
          });
          router.push(
            `${workspaceURI}/${SUBAPP_CODES.quotations}/${quotationId}`,
          );
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: i18n.get('Something went wrong while saving address!'),
        });
      }
    });
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
            <AddressesList
              currentAddress={selectedAddresses.invoicing}
              addresses={invoicingAddresses}
              type={ADDRESS_TYPE.invoicing}
              onCreate={handleCreate}
              onEdit={handleEdit}
              onSelect={handleAddressSelection}
            />
          </div>

          <Separator className="my-2" />
          <div className="flex flex-col gap-4">
            <div className="font-semibold text-xl">
              {i18n.get('Delivery address')}
            </div>
            <AddressesList
              currentAddress={selectedAddresses.delivery}
              addresses={deliveryAddresses}
              type={ADDRESS_TYPE.delivery}
              onCreate={handleCreate}
              onEdit={handleEdit}
              onSelect={handleAddressSelection}
            />
          </div>
        </div>
      </div>
      <Button
        className="w-full bg-success hover:bg-success-dark py-1.5"
        onClick={handleConfirm}
        disabled={isPending}>
        {isPending ? i18n.get('Processing...') : i18n.get('Confirm address')}
      </Button>
    </>
  );
}

export default Content;
