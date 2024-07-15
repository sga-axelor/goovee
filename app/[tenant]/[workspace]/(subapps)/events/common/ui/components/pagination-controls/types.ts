import type {Dispatch, SetStateAction} from 'react';

export interface PaginationProps {
  totalItems: number | undefined;
  itemsPerPage: number;
  currentPage: number;
  setCurrentPage: (input: number) => void;
}
