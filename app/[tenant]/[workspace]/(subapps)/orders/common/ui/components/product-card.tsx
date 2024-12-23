import React from 'react';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/i18n';
import {
  TableCell,
  TableRow,
  Collapsible,
  CollapsibleContent,
  Avatar,
  AvatarImage,
} from '@/ui/components';
import {getImageURL} from '@/utils/files';

// ---- LOCAL IMPORTS ---- //
import MdUpDownIcon from './MdUpDownIcon';

export const ProductCard = ({
  saleOrder,
  tenant,
}: {
  saleOrder: any;
  tenant: any;
}) => {
  const [show, setShow] = React.useState(false);

  const getProductImage = (product: any) => {
    return getImageURL(product?.picture?.id, tenant, {noimage: true});
  };

  return (
    <>
      <TableRow key={saleOrder.id} className="text-base">
        <TableCell className="py-4 px-6">
          <div className="flex gap-2">
            <Avatar className="rounded-sm h-6 w-6">
              <AvatarImage src={getProductImage(saleOrder.product)} />
            </Avatar>
            <p className="font-semibold mb-0">{saleOrder.productName}</p>
          </div>
        </TableCell>
        <TableCell className="p-4 ">{saleOrder.qty}</TableCell>
        <TableCell className="p-4 font-semibold">
          {saleOrder.inTaxTotal}
        </TableCell>
        <TableCell>
          <MdUpDownIcon show={show} onClick={() => setShow(!show)} />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={4} className={`${show ? 'border-b' : ''}`}>
          <Collapsible open={show}>
            <CollapsibleContent>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between px-4">
                  <p className="text-base font-semibold mb-0">
                    {i18n.get('Unit')}
                  </p>
                  <p className="text-base mb-0">{saleOrder?.unit?.name}</p>
                </div>
                <div className="flex justify-between px-4">
                  <p className="text-base font-semibold mb-0">
                    {i18n.get('Unit power WT')}
                  </p>
                  <p className="text-base mb-0">{saleOrder?.price}</p>
                </div>
                <div className="flex justify-between px-4">
                  <p className="text-base font-semibold mb-0">
                    {i18n.get('Total WT')}
                  </p>
                  <p className="text-base mb-0">{saleOrder?.price}</p>
                </div>
                <div className="flex justify-between px-4">
                  <p className="text-base font-semibold mb-0">
                    {i18n.get('Tax')}
                  </p>
                  <p className="text-base mb-0">
                    {saleOrder?.taxLineSet[0]?.value} %
                  </p>
                </div>
                <div className="flex justify-between px-4">
                  <p className="text-base font-semibold mb-0">
                    {i18n.get('Discount')}
                  </p>
                  <p className="text-base mb-0">{saleOrder?.discountAmount}%</p>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </TableCell>
      </TableRow>
    </>
  );
};
