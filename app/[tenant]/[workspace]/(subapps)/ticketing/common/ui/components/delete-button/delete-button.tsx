import {cn} from '@/utils/css';
import {ComponentPropsWithoutRef} from 'react';
import {MdRemoveCircleOutline} from 'react-icons/md';

export function Button(props: ComponentPropsWithoutRef<'button'>) {
  const {className, ...rest} = props;
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap p-1 text-destructive hover:scale-110 active:scale-95 rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 pointer-events-auto disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...rest}>
      <MdRemoveCircleOutline className="w-5 h-5" />
    </button>
  );
}
