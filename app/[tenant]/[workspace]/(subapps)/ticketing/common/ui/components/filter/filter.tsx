import {
  Badge,
  PopoverContentResponsive,
  PopoverResponsive,
  PopoverTriggerResponsive,
} from '@/ui/components';
import {Button} from '@/ui/components/button';
import {useResponsive} from '@/ui/hooks';
import {cn} from '@/utils/css';
import {FaFilter} from 'react-icons/fa';
import {ReactNode, useMemo, useState} from 'react';

type FilterProps = {
  filter: unknown;
  title: string;
  contentRenderer: (props: {close: () => void; filter: unknown}) => ReactNode;
};

export function Filter({filter, title, contentRenderer}: FilterProps) {
  const [open, setOpen] = useState(false);

  const filterCount = useMemo(
    () => (filter ? Object.keys(filter).length : 0),
    [filter],
  );

  const res = useResponsive();
  const small = (['xs', 'sm', 'md'] as const).some(x => res[x]);

  return (
    <div className={cn('relative', {'mt-5': small})}>
      <PopoverResponsive open={open} onOpenChange={setOpen} isSmall={small}>
        <PopoverTriggerResponsive asChild>
          <Button
            variant={filterCount ? 'success' : 'outline'}
            className={cn('flex justify-between', {
              ['w-[400px]']: !small,
              ['w-full']: small,
            })}>
            <div className="flex items-center space-x-2">
              <FaFilter className="size-4" />
              <span>{title}</span>
            </div>
            {filterCount > 0 && (
              <Badge
                className="ms-auto ps-[0.45rem] pe-2"
                variant="success-inverse">
                {filterCount}
              </Badge>
            )}
          </Button>
        </PopoverTriggerResponsive>

        <PopoverContentResponsive
          className={
            small
              ? 'px-5 pb-5 max-h-full'
              : 'w-[--radix-popper-anchor-width] p-0'
          }>
          {small && (
            <>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <hr className="mb-2" />
            </>
          )}
          {contentRenderer({close: () => setOpen(false), filter})}
        </PopoverContentResponsive>
      </PopoverResponsive>
    </div>
  );
}
