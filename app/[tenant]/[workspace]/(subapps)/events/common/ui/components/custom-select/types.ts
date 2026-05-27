import type {Control} from 'react-hook-form';

export interface OptionType {
  value: string;
  label: string | null;
  id: string;
  name: string | null;
  firstName: string | null;
  simpleFullName: string | null;
  emailAddress: {address: string | null} | null;
  fixedPhone: string | null;
  mainPartner: {id: string; simpleFullName: string | null} | null;
}

export interface CustomSelectProps {
  control: Control<Record<string, unknown>>;
  name: string;
  selectedOptions: OptionType[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<OptionType[]>>;
}
