import type {Dispatch, SetStateAction} from 'react';
import type {Category} from '../events';

export interface EventSelectorProps {
  date: Date | undefined;
  setDate: (input: Date | undefined) => void;
  updateCateg: (Input: Category) => void;
  categories: Category[];
  setCurrentPage: Dispatch<SetStateAction<number>>;
}
