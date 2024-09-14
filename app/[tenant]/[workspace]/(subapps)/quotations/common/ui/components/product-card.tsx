import React from 'react';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {
  TableCell,
  TableRow,
  Collapsible,
  CollapsibleContent,
} from '@/ui/components';

// ---- LOCAL IMPORTS ---- //
import styles from './styles.module.scss';
import Image from 'next/image';
import MdUpDownIcon from '../../../../orders/common/ui/components/MdUpDownIcon';

export const ProductCard = (props: any) => {
  const {product} = props;
  const [show, setShow] = React.useState(false);
  return (
    <>
      <TableRow key={product.id}>
        <TableCell className="py-4 px-6">
          <div className="flex">
            <div className="flex items-center">
              <Image src="" alt="product" className={styles['product-image']} />
            </div>
            <p className="text-sm mb-0">{product.productName}</p>
          </div>
        </TableCell>
        <TableCell className="p-4 text-sm">{product.qty}</TableCell>
        <TableCell className="p-4 text-sm">{product.inTaxTotal}</TableCell>
        <TableCell>
          <MdUpDownIcon show={show} onClick={() => setShow(!show)} />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={4} className={`${show ? 'border-b' : ''}`}>
          <Collapsible open={show}>
            <CollapsibleContent>
              <div>
                <div className="flex justify-between px-4">
                  <p className="text-sm font-semibold mb-0">
                    {i18n.get('Unit')}
                  </p>
                  <p className="text-sm mb-0">{product?.unit?.name}</p>
                </div>
                <div className="flex justify-between px-4">
                  <p className="text-sm font-semibold mb-0">
                    {i18n.get('Unit power WT')}
                  </p>
                  <p className="text-sm mb-0">{product?.price}</p>
                </div>
                <div className="flex justify-between px-4">
                  <p className="text-sm font-semibold mb-0">
                    {i18n.get('Total WT')}
                  </p>
                  <p className="text-sm mb-0">{product?.price}</p>
                </div>
                <div className="flex justify-between px-4">
                  <p className="text-sm font-semibold mb-0">
                    {i18n.get('Tax')}
                  </p>
                  <p className="text-sm mb-0">
                    {product?.taxLineSet[0]?.value} %
                  </p>
                </div>
                <div className="flex justify-between px-4">
                  <p className="text-sm font-semibold mb-0">
                    {i18n.get('Discount')}
                  </p>
                  <p className="text-sm mb-0">{product?.discountAmount}%</p>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </TableCell>
      </TableRow>
    </>
  );
};
