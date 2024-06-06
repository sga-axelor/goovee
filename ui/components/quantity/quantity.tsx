'use client';
import {MaterialIcon} from '@axelor/ui/icons/material-icon';

export function Quantity({
  value,
  disabled,
  onIncrement,
  onDecrement,
}: {
  value: number | string;
  disabled?: boolean;
  onIncrement?: () => void;
  onDecrement?: () => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <div
        className="mb-0 !p-1 border rounded-lg flex items-center justify-center h-10"
        style={{width: '55px'}}>
        <span className="text-primary text-base">{value}</span>
      </div>
      <div className="border rounded-lg h-10 flex items-center justify-center cursor-pointer">
        <MaterialIcon
          className="courser-pointer block p-2"
          icon="remove"
          onClick={onDecrement}
          disabled={disabled}
          {...({fontSize: 32} as any)}
        />
      </div>
      <div className="border rounded-lg h-10 flex items-center justify-center cursor-pointer">
        <MaterialIcon
          className="courser-pointer block p-2"
          icon="add"
          onClick={onIncrement}
          disabled={disabled}
          {...({fontSize: 32} as any)}
        />
      </div>
    </div>
  );
}

export default Quantity;
