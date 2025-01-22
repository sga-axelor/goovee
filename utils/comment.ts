// ---- CORE IMPORTS ---- //
import {SUBAPP_CODES} from '@/constants';
import {PortalWorkspace} from '@/types';

export const getCommentConfigForSubapp = ({
  subapp,
  workspace,
}: {
  subapp: SUBAPP_CODES;
  workspace: PortalWorkspace;
}) => {
  const subappCommentConfig: any = {
    [SUBAPP_CODES.events]: workspace.config?.enableEventComment,
    [SUBAPP_CODES.news]: workspace.config?.enableNewsComment,
  };

  if ([SUBAPP_CODES.events, SUBAPP_CODES.news].includes(subapp)) {
    if (!subappCommentConfig[subapp]) {
      return;
    }
  }

  return true;
};
