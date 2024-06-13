import React from 'react';
import {MdArrowDropDown, MdArrowDropUp} from 'react-icons/md';
interface IMdUpDownIcon {
  show: boolean;
  onClick: () => void;
}
const MdUpDownIcon: React.FC<IMdUpDownIcon> = ({show = false, onClick}) => {
  let ComponentIcon = show ? MdArrowDropUp : MdArrowDropDown;

  return <ComponentIcon onClick={onClick} />;
};

export default MdUpDownIcon;
