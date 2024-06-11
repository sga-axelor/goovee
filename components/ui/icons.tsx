import {DynamicIconProps, iconsMap} from '@/utils/icons';

const DynamicIcon: React.FC<DynamicIconProps> = ({
  icon,
  fontSize = 24,
  onClick,
  className,
  ...rest
}) => {
  const IconComponent = iconsMap[icon];
  return IconComponent ? (
    <IconComponent size={fontSize} onClick={onClick} className={className} {...rest} />
  ) : (
    ''
  );
};
export default DynamicIcon;
