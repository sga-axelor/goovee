'use client';

import {MdOutlineEdit} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {Button} from '@/ui/components';
import {i18n} from '@/i18n';
import {cn} from '@/utils/css';
import {ADDRESS_TYPE} from '@/constants';

export const AddressCard = ({
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
  onSelect?: (type: ADDRESS_TYPE, address: any) => void;
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
  } = address || {};

  const handleSelect = () => onSelect && onSelect(type, address);
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

export default AddressCard;
