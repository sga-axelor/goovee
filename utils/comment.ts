// ---- CORE IMPORTS ---- //
import {SUBAPP_CODES} from '@/constants';
import {PortalWorkspace} from '@/types';

export const isCommentEnabled = ({
  subapp,
  workspace,
}: {
  subapp: SUBAPP_CODES;
  workspace: PortalWorkspace;
}) => {
  const config: Partial<Record<SUBAPP_CODES, boolean>> = {
    [SUBAPP_CODES.events]: workspace.config?.enableEventComment,
    [SUBAPP_CODES.news]: workspace.config?.enableNewsComment,
  };

  if (Object.keys(config).includes(subapp)) {
    return !!(workspace.config?.enableComment && config[subapp]);
  }
  return !!workspace.config?.enableComment;
};
