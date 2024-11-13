import {PortalWorkspace} from '@/types';

export interface EventDateCardProps {
  id: string | number;
  startDate?: string;
  endDate?: string;
  eventAllDay?: boolean;
  workspace: PortalWorkspace;
  canRegister?: boolean;
}
