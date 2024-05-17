"use client";

import { Box } from "@axelor/ui";
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
    <Box d="flex" alignItems="center" gap={4}>
      <Box
        as="h5"
        mb={0}
        p={2}
        border
        rounded
        textAlign="center"
        style={{ minWidth: "3rem" }}
      >
        <b>{value}</b>
      </Box>
      <Box border rounded>
        <Box
          as={MaterialIcon}
          d="block"
          className="pointer"
          icon="remove"
          p={2}
          onClick={onDecrement}
          disabled={disabled}
          {...({ fontSize: 32 } as any)}
        />
      </Box>
      <Box border rounded>
        <Box
          as={MaterialIcon}
          d="block"
          className="pointer"
          icon="add"
          p={2}
          onClick={onIncrement}
          disabled={disabled}
          {...({ fontSize: 32 } as any)}
        />
      </Box>
    </Box>
  );
}

export default Quantity;
