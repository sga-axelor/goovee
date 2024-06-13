'use client';

import React, {useState, useEffect} from 'react';
import {Alert, AlertTitle, AlertDescription} from '@ui/components/alert';
import { MdClose } from "react-icons/md";

type Variant = 'success' | 'error' | 'warning' | 'primary';

type ToastProps = {
  show: boolean;
  variant: Variant;
  heading: string;
  description?: string;
};

type IconType = 'MdOutlineWarningAmber' | 'MdErrorOutline' | 'MdOutlineCheckCircle' | 'info';

export const Toast = ({
  show,
  heading,
  description = '',
  variant = 'error',
}: ToastProps) => {
  const [visible, setVisible] = useState<boolean>(show);

  useEffect(() => {
    setVisible(show);
  }, [show]);

  const handleClose = () => {
    setVisible(false);
  };

  const alertType: Record<
    Variant,
    {
      styles: string;
      icon: IconType;
    }
  > = {
    success: {
      styles: 'border-success-dark text-success-dark bg-success-light [&>svg]:text-success-dark',
      icon: 'MdOutlineCheckCircle',
    },
    error: {
      styles:
        'border-error-dark text-error-dark bg-error-light dark:border-destructive [&>svg]:text-error-dark',
      icon: 'MdErrorOutline',
    },
    warning: {
      styles: 'bg-warning-light border-warning-dark text-warning-dark [&>svg]:text-warning-dark',
      icon: 'MdOutlineWarningAmber',
    },
    primary: {
      styles: 'bg-primary-dark border-primary-dark text-primary-dark [&>svg]:text-primary-dark',
      icon: 'MdErrorOutline',
    },
  };

  if (!visible) {
    return null;
  }

  return (
    <Alert
      className={`${alertType[variant].styles} border relative flex items-start justify-between py-4 px-8`}>
      <div className="flex items-start">
        {/* <DynamicIcon icon={alertType[variant].icon as IconName} className="mr-4" /> */}
        <div className="flex-1">
          <AlertTitle className="text-base font-medium">{heading}</AlertTitle>
          <AlertDescription className="text-sm">{description}</AlertDescription>
        </div>
      </div>
      <MdClose className="cursor-pointer ml-2 text-2xl right-4" style={{left:"unset"}}  onClick={handleClose} />
    </Alert>
  );
};

export default Toast;
