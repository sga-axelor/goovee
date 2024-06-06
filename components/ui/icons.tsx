import { DynamicIconProps, iconsMap } from "@/utils/icons";

const DynamicIcon: React.FC<DynamicIconProps> = ({ icon, fontSize = 24 }) => {
    const IconComponent = iconsMap[icon];
    return IconComponent ? <IconComponent size={fontSize} /> : "";
};
export default DynamicIcon;