import type {Control} from 'react-hook-form';
export interface OptionType {
  value: string;
  label: string;
}
export interface CustomSelectProps {
  control: Control<any>;
  name: string;
  selectedOptions: any[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<any[]>>;
}
