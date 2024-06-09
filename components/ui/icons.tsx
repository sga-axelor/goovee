import {DynamicIconProps, iconsMap} from '@/utils/icons';

const DynamicIcon: React.FC<DynamicIconProps> = ({
  icon,
  fontSize = 24,
  onClick,
  ...rest
}) => {
  const IconComponent = iconsMap[icon];
  console.log(IconComponent);
  return IconComponent ? (
    <IconComponent size={fontSize} {...rest} onClick={onClick} />
  ) : (
    ''
  );
};
export default DynamicIcon;
