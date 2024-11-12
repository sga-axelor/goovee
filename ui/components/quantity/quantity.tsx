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
    <div className="flex items-center gap-2">
      <div className="border rounded-lg w-10 h-10 flex items-center justify-center cursor-pointer">
        <IoRemove
          className="courser-pointer block p-2 text-4xl"
          onClick={() => !disabled && onDecrement?.()}
        />
      </div>
      <div
        className="mb-0 !p-1 border rounded-lg flex items-center justify-center h-10"
        style={{width: '3.5rem'}}>
        <span>{value}</span>
      </div>
      <div className="border rounded-lg w-10 h-10 flex items-center justify-center cursor-pointer">
        <IoAdd
          className="courser-pointer block p-2 text-4xl"
          onClick={() => !disabled && onIncrement?.()}
        />
      </div>
    </div>
  );
}

export default Quantity;
