// ---- CORE IMPORTS ---- //
import {PortalWorkspace} from '@/orm/workspace';
import {calculateAdvanceAmount} from '@/utils/payment';
import type {Cloned} from '@/types/util';

export const formatNumber = (n: number | string) => n;

export function computeExpectedAmount({
  total,
  workspace,
}: {
  total: number | string;
  workspace: PortalWorkspace | Cloned<PortalWorkspace>;
}): string {
  const payInAdvance = workspace.config?.payInAdvance;
  const advancePaymentPercentage = workspace.config?.advancePaymentPercentage;

  if (
    payInAdvance &&
    advancePaymentPercentage &&
    Number(advancePaymentPercentage) > 0
  ) {
    return calculateAdvanceAmount({
      amount: Number(total),
      percentage: Number(advancePaymentPercentage),
      payInAdvance,
    }).toString();
  }

  return total.toString();
}
