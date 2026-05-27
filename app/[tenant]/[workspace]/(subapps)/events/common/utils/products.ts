// ---- CORE IMPORTS ---- //
import {DEFAULT_TAX_VALUE} from '@/constants';
import {ComputedProduct} from '@/types';

type PriceEntry = {type: string; price: number | string | null};
type WsProduct = {prices?: PriceEntry[] | null};
type TaxLine = {activeTaxLine: {value: number | null} | null};
type Account = {saleTaxSet?: TaxLine[] | null};
type ProductCompany = {company?: unknown};

export const getTax = ({
  ws,
  wsProduct,
  account,
  productcompany,
}: {
  ws: boolean;
  wsProduct: WsProduct | null | undefined;
  account: Account | null | undefined;
  productcompany: ProductCompany | null | undefined;
}): ComputedProduct['tax'] => {
  if (ws) {
    const wt = Number(
      wsProduct?.prices?.find((p: PriceEntry) => p.type === 'WT')?.price || 0,
    );
    const ati = Number(
      wsProduct?.prices?.find((p: PriceEntry) => p.type === 'ATI')?.price || 0,
    );

    return {
      value: wt && ati ? Number(((ati - wt) / wt) * 100) : DEFAULT_TAX_VALUE,
    };
  }

  const activeTax = account?.saleTaxSet?.find((t: TaxLine) => t.activeTaxLine);

  const activeTaxLineValue =
    activeTax?.activeTaxLine?.value || DEFAULT_TAX_VALUE;

  return {
    value: productcompany?.company ? activeTaxLineValue : DEFAULT_TAX_VALUE,
  };
};
