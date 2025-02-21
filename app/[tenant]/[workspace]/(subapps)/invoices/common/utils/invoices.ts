export function extractAmount(amount: string | number): number {
  const amountStr = String(amount);
  const numericValue = parseFloat(amountStr.replace(/[^0-9.-]+/g, ''));

  return isNaN(numericValue) ? 0 : numericValue;
}
