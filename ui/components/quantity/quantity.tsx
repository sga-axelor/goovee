'use client';
import {useCallback} from 'react';
import {IoAdd, IoRemove} from 'react-icons/io5';

export function Quantity({
  value,
  disabled,
  onIncrement,
  onDecrement,
  onChange,
}: {
  value: number | string;
  disabled?: boolean;
  onIncrement?: () => void;
  onDecrement?: () => void;
  onChange?: (newValue: string | number) => void;
}) {
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      const value = e.target.value;

      if (value === '') {
        onChange?.(value);
        return;
      }

      const number = Number(value);

      if (!isNaN(number) && number > 0) {
        onChange?.(Math.trunc(number));
      }
    },
    [onChange, disabled],
  );

  return (
    <div className="flex items-center gap-2">
      <div className="border rounded-lg w-10 h-10 flex items-center justify-center cursor-pointer">
        <IoRemove
          className="block p-2 text-4xl"
          onClick={() => !disabled && onDecrement?.()}
        />
      </div>
      <div
        className="mb-0 !p-1 border rounded-lg flex items-center justify-center h-10"
        style={{width: '7.5rem'}}>
        <input
          type="number"
          value={value !== 0 ? value : ''}
          onChange={handleInputChange}
          className="w-full h-full text-center border-none outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
      <div className="border rounded-lg w-10 h-10 flex items-center justify-center cursor-pointer">
        <IoAdd
          className="block p-2 text-4xl"
          onClick={() => !disabled && onIncrement?.()}
        />
      </div>
    </div>
  );
}

export default Quantity;
