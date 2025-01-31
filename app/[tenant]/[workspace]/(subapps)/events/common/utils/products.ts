// ---- CORE IMPORTS ---- //
import {DEFAULT_TAX_VALUE} from '@/constants';
import {ComputedProduct} from '@/types';

export const getTax = ({
  ws,
  wsProduct,
  account,
  productcompany,
}: {
  ws: boolean;
  wsProduct: any;
  account: any;
  productcompany: any;
}): ComputedProduct['tax'] => {
  if (ws) {
    const wt = Number(wsProduct?.prices.find(p => p.type === 'WT')?.price || 0);
    const ati = Number(
      wsProduct?.prices.find(p => p.type === 'ATI')?.price || 0,
    );

    return {
      value: wt && ati ? Number(((ati - wt) / wt) * 100) : DEFAULT_TAX_VALUE,
    };
  }

  const activeTax = account?.saleTaxSet?.find((t: any) => t.activeTaxLine);

  const activeTaxLineValue =
    activeTax?.activeTaxLine?.value || DEFAULT_TAX_VALUE;

  return {
    value: productcompany?.company ? activeTaxLineValue : DEFAULT_TAX_VALUE,
  };
};
