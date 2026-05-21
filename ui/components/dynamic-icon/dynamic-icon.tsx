'use client';

import * as MdIcons from 'react-icons/md';
import * as BsIcons from 'react-icons/bs';
import {MdOutlineError} from 'react-icons/md';

const iconMap: Record<string, React.ComponentType<any>> = {
  ...Object.fromEntries(
    Object.entries(MdIcons).map(([key, val]) => [`md-${key.slice(2)}`, val]),
  ),
  ...Object.fromEntries(
    Object.entries(BsIcons).map(([key, val]) => [`bs-${key.slice(2)}`, val]),
  ),
};

export function DynamicIcon({
  icon,
  ...rest
}: {
  icon: string;
  className?: string;
  onClick?: any;
  style?: any;
  fill?: string;
}) {
  const Icon = iconMap[icon] ?? MdOutlineError;
  return <Icon {...rest} />;
}

export default DynamicIcon;
