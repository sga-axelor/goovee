import {AOSProject, AOSProjectTask} from '@/goovee/.generated/models';
import {Entity, ID, WhereOptions} from '@goovee/orm';
import {TYPE_SELECT} from '../constants';

export type AuthProps = {
  workspaceId: ID;
  userId: ID;
};

export type QueryProps<T extends Entity> = {
  where?: WhereOptions<T> | null;
  take?: number;
  // orderBy?: OrderByArg<T>;
  orderBy?: any;
  skip?: number;
};

export function getProjectAccessFilter(props: AuthProps) {
  const {userId, workspaceId} = props;
  const where: WhereOptions<AOSProject> = {
    isBusinessProject: true,
    portalWorkspace: {
      id: workspaceId,
    },
    OR: [
      {
        clientPartner: {
          id: userId,
        },
      },
      {
        clientPartner: {
          contactPartnerSet: {
            id: userId,
          },
        },
      },
    ],
  };
  return where;
}

export function getTicketAccessFilter() {
  const where: WhereOptions<AOSProjectTask> = {
    typeSelect: TYPE_SELECT.TICKET,
    isPrivate: false,
  };
  return where;
}
