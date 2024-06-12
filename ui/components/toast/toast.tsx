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
      styles: 'border-[#4FC179] text-[#328D54] bg-[#D0EED8]/50',
      icon: 'MdOutlineCheckCircle',
    },
    error: {
      styles:
        'border-[#F14E46] text-[#B2150D] bg-[#FBC6C4]/50 dark:border-destructive [&>svg]:text-destructive',
      icon: 'MdErrorOutline',
    },
    warning: {
      styles: 'bg-[#FFE6BF]/50 border-[#FFA114] text-[#BF7300]',
      icon: 'MdOutlineWarningAmber',
    },
    primary: {
      styles: 'bg-[#F6F1FF]/50 border-[#5603AD] text-[#340077]',
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
