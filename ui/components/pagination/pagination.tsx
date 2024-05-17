import { Box, Button } from "@axelor/ui";
import { MaterialIcon } from "@axelor/ui/icons/material-icon";

type PaginationProps = {
  page?: string | number;
  pages?: string | number;
  disablePrev?: boolean;
  disableNext?: boolean;
  onPage?: any;
  onPrev?: any;
  onNext?: any;
};

function RoundButton({ children, onClick, disabled, rounded, ...rest }: any) {
  return (
    <Button
      variant="primary"
      size="sm"
      onClick={onClick}
      me={1}
      disabled={disabled}
      outline
      {...(rounded ? { rounded: "circle" } : {})}
      {...rest}
    >
      {children}
    </Button>
  );
}

export function Pagination({
  page,
  pages,
  disableNext,
  disablePrev,
  onPrev,
  onNext,
  onPage,
}: PaginationProps) {
  return (
    <Box d="flex" alignItems="center" gap="0.25rem" flexWrap="wrap">
      <RoundButton onClick={onPrev} disabled={disablePrev} rounded p={2}>
        <Box d="flex">
          <MaterialIcon icon="chevron_left" fontSize={16} />
        </Box>
      </RoundButton>
      {Array.from({ length: Number(pages) }, (_, i) => {
        const current = i + 1;

        return (
          <RoundButton
            key={i}
            p={3}
            py={2}
            onClick={() => onPage?.(current)}
            outline={Number(page) !== current}
          >
            {current}
          </RoundButton>
        );
      })}
      <RoundButton onClick={onNext} disabled={disableNext} rounded p={2}>
        <Box d="flex">
          <MaterialIcon icon="chevron_right" fontSize={16} />
        </Box>
      </RoundButton>
    </Box>
  );
}

export default Pagination;
