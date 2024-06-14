import {Button} from '@ui/components/button';
import {LuChevronLeft} from 'react-icons/lu';
import {LuChevronRight} from 'react-icons/lu';

type PaginationProps = {
  page?: string | number;
  pages?: string | number;
  disablePrev?: boolean;
  disableNext?: boolean;
  onPage?: any;
  onPrev?: any;
  onNext?: any;
};

function RoundButton({
  children,
  onClick,
  disabled,
  active,
  className = '',
  ...rest
}: any) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      {...rest}
      className={`${active ? 'text-primary bg-success-light' : 'text-primary-forground bg-success-dark'} mr-1 ${className}`}>
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
  pages = pages === 0 ? 1 : pages;

  return (
    <div className="flex items-center gap-1 flex-wrap">
      <RoundButton
        onClick={onPrev}
        disabled={disablePrev}
        className="p-2 bg-transparent border-0">
        <div className="flex">
          <LuChevronLeft className="h-4 w-4 text-base" />
        </div>
      </RoundButton>
      {Array.from({length: Number(pages)}, (_, i) => {
        const current = i + 1;
        return (
          <RoundButton
            key={i}
            onClick={() => onPage?.(current)}
            outline={String(page !== current)}
            className="p-4 py-2 pointer-events-none border-0 rounded-full !opacity-100"
            active={Number(page) === current}>
            {current}
          </RoundButton>
        );
      })}
      <RoundButton
        onClick={onNext}
        disabled={disableNext}
        className="p-2 bg-transparent border-0">
        <div className="flex">
          <LuChevronRight className="h-4 w-4 text-base " />
        </div>
      </RoundButton>
    </div>
  );
}

export default Pagination;
