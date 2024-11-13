import {PortalWorkspace} from '@/types';
import {Event} from '../events';

export interface EventPageCardProps {
  eventDetails: Event;
  metaFields?: any[];
  workspace: PortalWorkspace;
  user?: any;
}
