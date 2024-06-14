'use client';

import {IconType} from 'react-icons';
import {MdStorefront} from 'react-icons/md';

interface IconMapping {
  storeFront: IconType;
}

function getIcon(type: keyof IconMapping): IconType | undefined {
  const iconMapping: IconMapping = {
    storeFront: MdStorefront,
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
  onClick?: () => void;
}) => {
  let IconComponent: any = getIcon(name);

  if (!IconComponent) {
    return null;
  }

  return <IconComponent className={`${className}`} {...rest} />;
};

export default Icons;
