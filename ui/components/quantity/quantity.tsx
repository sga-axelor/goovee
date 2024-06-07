'use client';
import {IoAdd, IoRemove} from 'react-icons/io5';

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
        <IoAdd
          className="courser-pointer block p-2"
          size={32}
          onClick={() => !disabled && onDecrement?.()}
        />
      </div>
      <div className="border rounded-lg h-10 flex items-center justify-center cursor-pointer">
        <IoRemove
          className="courser-pointer block p-2"
          onClick={() => !disabled && onIncrement?.()}
          size={32}
        />
      </div>
    </div>
  );
}

export default Quantity;
