import * as BootstrapIcon from 'react-icons/bs';
import * as Fa6Icon from 'react-icons/fa6';
import * as AiIcons from 'react-icons/ai';
import * as BiIcons from 'react-icons/bi';
import * as CiIcons from 'react-icons/ci';
import * as CgIcons from 'react-icons/cg';
import * as DiIcons from 'react-icons/di';
import * as FiIcons from 'react-icons/fi';
import * as FcIcons from 'react-icons/fc';
import * as FaIcons from 'react-icons/fa';
import * as GiIcons from 'react-icons/gi';
import * as GoIcons from 'react-icons/go';
import * as GrIcons from 'react-icons/gr';
import * as HiIcons from 'react-icons/hi';
import * as Hi2Icons from 'react-icons/hi2';
import * as ImIcons from 'react-icons/im';
import * as IoIcons from 'react-icons/io';
import * as Io5Icons from 'react-icons/io5';
import * as LuIcons from 'react-icons/lu';
import * as MdIcons from 'react-icons/md';
import * as PiIcons from 'react-icons/pi';
import * as RxIcons from 'react-icons/rx';
import * as RiIcons from 'react-icons/ri';
import * as SiIcons from 'react-icons/si';
import * as SlIcons from 'react-icons/sl';
import * as TbIcons from 'react-icons/tb';
import * as TfiIcons from 'react-icons/tfi';
import * as TiIcons from 'react-icons/ti';
import * as WiIcons from 'react-icons/wi';
import * as VscIcons from 'react-icons/vsc';

type IconName =
  | keyof typeof BootstrapIcon
  | keyof typeof Fa6Icon
  | keyof typeof AiIcons
  | keyof typeof BiIcons
  | keyof typeof CiIcons
  | keyof typeof CgIcons
  | keyof typeof DiIcons
  | keyof typeof FiIcons
  | keyof typeof FcIcons
  | keyof typeof FaIcons
  | keyof typeof GiIcons
  | keyof typeof GoIcons
  | keyof typeof GrIcons
  | keyof typeof HiIcons
  | keyof typeof Hi2Icons
  | keyof typeof ImIcons
  | keyof typeof IoIcons
  | keyof typeof Io5Icons
  | keyof typeof LuIcons
  | keyof typeof MdIcons
  | keyof typeof PiIcons
  | keyof typeof RxIcons
  | keyof typeof RiIcons
  | keyof typeof SiIcons
  | keyof typeof SlIcons
  | keyof typeof TbIcons
  | keyof typeof TfiIcons
  | keyof typeof TiIcons
  | keyof typeof WiIcons
  | keyof typeof VscIcons;

export const iconsMap = {
  ...BootstrapIcon,
  ...Fa6Icon,
  ...AiIcons,
  ...BiIcons,
  ...CiIcons,
  ...CgIcons,
  ...DiIcons,
  ...FiIcons,
  ...FcIcons,
  ...FaIcons,
  ...GiIcons,
  ...GoIcons,
  ...GrIcons,
  ...HiIcons,
  ...Hi2Icons,
  ...ImIcons,
  ...IoIcons,
  ...Io5Icons,
  ...LuIcons,
  ...MdIcons,
  ...PiIcons,
  ...RxIcons,
  ...RiIcons,
  ...SiIcons,
  ...SlIcons,
  ...TbIcons,
  ...TfiIcons,
  ...TiIcons,
  ...WiIcons,
  ...VscIcons,
};
export interface DynamicIconProps {
  icon: IconName;
  fontSize?: string | number;
  onClick?:()=>void
}
