'use client';

import {IconType} from 'react-icons';
import {
  MdErrorOutline,
  MdOutlineCheckCircle,
  MdOutlineWarningAmber,
  MdStorefront,
  MdOutlineLocalPrintshop,
  MdAppRegistration,
} from 'react-icons/md';
import {CiShop, CiFileOn, CiShoppingTag} from 'react-icons/ci';

interface IconMapping {
  storeFront: IconType;
  toastSuccess: IconType;
  toastError: IconType;
  toastWarning: IconType;
  toastPrimary: IconType;
  shop: IconType;
  quotation: IconType;
  invoice: IconType;
  order: IconType;
  app: IconType;
}

function getIcon(type: keyof IconMapping): IconType | undefined {
  const iconMapping: IconMapping = {
    storeFront: MdStorefront,
    toastSuccess: MdOutlineCheckCircle,
    toastError: MdErrorOutline,
    toastWarning: MdOutlineWarningAmber,
    toastPrimary: MdErrorOutline,
    shop: CiShop,
    quotation: MdOutlineLocalPrintshop,
    invoice: CiFileOn,
    order: CiShoppingTag,
    app: MdAppRegistration,
  };

  const icon = iconMapping[type];

  return icon;
}

const Icons = ({
  name,
  className,
  size,
  onClick,
  ...rest
}: {
  name: any;
  className?: string;
  size?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}) => {
  let IconComponent: any = getIcon(name);

  if (!IconComponent) {
    return null;
  }

  return <IconComponent className={`${className}`} {...rest} />;
};

export default Icons;
