import * as React from "react"

import { cn } from "@/lib/utils"


interface IconProps {
  icon: string;
  onClick: () => void;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icons?: IconProps[];
}

const TextField = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type,label,icons, ...props }, ref) => {
    return (
      <>
      <label className="text-base font-medium text-primary mb-1">{label}</label>
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mb-4",
          className
        )}
        ref={ref}
        {...props}
      />
      
      </>
    )
  }
)
TextField.displayName = "TextField"

export { TextField }
