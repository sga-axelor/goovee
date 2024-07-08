'use client';

import React, {useState, useEffect} from 'react';
import {MdClose} from 'react-icons/md';
import Icons from '@/utils/Icons';
import {Alert, AlertTitle, AlertDescription} from './alert';

type Variant = 'success' | 'error' | 'warning' | 'purple';

type StyledAlertProps = {
  show: boolean;
  variant: Variant;
  heading: string;
  description?: string;
};

export const StyledAlert = ({
  show,
  heading,
  description = '',
  variant = 'error',
}: StyledAlertProps) => {
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
      icon: string;
    }
  > = {
    success: {
      styles:
        'border-success-dark text-success-dark bg-success-light [&>svg]:text-success-dark',
      icon: 'toastSuccess',
    },
    error: {
      styles:
        'border-error-dark text-error-dark bg-error-light [&>svg]:text-error-dark',
      icon: 'toastError',
    },
    warning: {
      styles:
        'border-warning-dark text-warning-dark bg-warning-light [&>svg]:text-warning-dark',
      icon: 'toastWarning',
    },
    purple: {
      styles:
        'border-palette-purple-dark text-palette-purple-dark bg-palette-purple [&>svg]:text-palette-purple-dark',
      icon: 'toastPrimary',
    },
  };

  if (!visible) {
    return null;
  }

  return (
    <Alert
      className={`${alertType[variant].styles} border relative flex items-start justify-between py-4 px-8`}>
      <div className="flex items-start">
        <Icons name={alertType[variant].icon} className="mr-4 text-2xl" />
        <div className="flex-1">
          <AlertTitle className="text-base font-medium">{heading}</AlertTitle>
          <AlertDescription className="text-sm">{description}</AlertDescription>
        </div>
      </div>
      <MdClose
        className="cursor-pointer ml-2 text-2xl right-4"
        style={{left: 'unset'}}
        onClick={handleClose}
      />
    </Alert>
  );
};

export default StyledAlert;
