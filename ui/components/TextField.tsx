import * as React from 'react';
import {cn} from '@/lib/utils';
import Icons from '@/utils/Icons';

interface IconProps {
  icon: string;
  onClick: () => void;
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icons?: IconProps[];
}

const TextField = React.forwardRef<HTMLInputElement, InputProps>(
  ({className, type, label, icons, value, ...props}, ref) => {
    const inputValue = value !== undefined && value !== null ? value : '';

    return (
      <>
        {label && (
          <label className="text-base font-medium text-primary mb-1">
            {label}
          </label>
        )}
        <div className="relative block w-full">
          <input
            type={type}
            style={{
              paddingRight:
                Array.isArray(icons) && icons?.length ? '3rem' : '1rem',
            }}
            className={cn(
              `flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mb-4`,
              className,
            )}
            ref={ref}
            value={inputValue}
            {...props}
          />
          {Array.isArray(icons) &&
            icons?.map((ic, i) => (
              <Icons
                className="absolute right-4 top-2"
                key={i}
                name={ic.icon}
                onClick={ic.onClick}
              />
            ))}
        </div>
      </>
    );
  },
);
TextField.displayName = 'TextField';

export {TextField};
