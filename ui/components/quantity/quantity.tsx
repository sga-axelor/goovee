"use client";
import { MaterialIcon } from "@axelor/ui/icons/material-icon";

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
    <div className="flex items-center gap-5" >
      <h5
      className="mb-0 !p-2 border rounded text-center inline-flex"
       
      >
        {value}
      </h5>
      <div className="border rounded">
        <MaterialIcon
          className="courser-pointer block p-2"
          icon="remove"
          onClick={onDecrement}
          disabled={disabled}
          {...({ fontSize: 32 } as any)}
        />
      </div>
      <div className="border rounded">
        <MaterialIcon
          className="courser-pointer block p-2"
          icon="add"
          onClick={onIncrement}
          disabled={disabled}
          {...({ fontSize: 32 } as any)}
        />
      </div>
    </div>
  );
}

export default Quantity;
