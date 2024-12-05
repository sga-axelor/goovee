'use client';

import {MdArrowDropDown, MdArrowDropUp} from 'react-icons/md';

interface ArrowSwitchPops {
  show: boolean;
  onClick: () => void;
}
export const ArrowSwitch: React.FC<ArrowSwitchPops> = ({
  show = false,
  onClick,
}) => {
  let ComponentIcon = show ? MdArrowDropUp : MdArrowDropDown;

  return <ComponentIcon onClick={onClick} />;
};

export default ArrowSwitch;
