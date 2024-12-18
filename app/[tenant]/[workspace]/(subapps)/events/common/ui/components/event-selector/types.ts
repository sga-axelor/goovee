import type {Dispatch, SetStateAction} from 'react';

// ---- CORE IMPORTS ---- //
import {PortalWorkspace} from '@/types';

// ---- LOCAL IMPORTS ---- //
import type {Category} from '@/subapps/events/common/ui/components';

export interface EventSelectorProps {
  date: Date | undefined;
  setDate: (input: Date | undefined) => void;
  updateCateg: (Input: Category) => void;
  categories: Category[];
  workspace: PortalWorkspace;
  selectedCategories?: string[];
  onlyRegisteredEvent?: boolean;
  handleToogle?: () => void;
}
