import {cn} from '@/utils/css';
import {Fragment} from 'react';

export type StepperProps = {
  steps: {
    id: string | number;
    name?: string;
  }[];
  current?: string | number;
  className?: string;
};

export function Stepper(props: StepperProps) {
  const {steps, current, className} = props;
  const progress = current ? steps.findIndex(s => s.id === current) : 0;
  return (
    <div className={cn('flex items-center pt-4 pb-8 px-8 gap-2', className)}>
      {steps.map((step, i, steps) => {
        return (
          <Fragment key={step.id}>
            <div
              className={cn(
                'w-[10px] h-[10px] rounded-full bg-gray-400 relative',
                {
                  ['bg-success']: i <= progress,
                },
              )}>
              <p className="mt-1 text-sm absolute top-4 w-max right-1/2 translate-x-1/2">
                {step.name}
              </p>
            </div>
            {steps.length - 1 !== i && (
              <div
                className={cn('h-[1px] flex-grow bg-gray-400', {
                  ['bg-success']: i < progress,
                })}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
