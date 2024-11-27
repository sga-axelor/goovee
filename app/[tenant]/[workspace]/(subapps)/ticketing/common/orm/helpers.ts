import type {AOSProject, AOSProjectTask} from '@/goovee/.generated/models';
import type {Entity, WhereOptions} from '@goovee/orm';
import {TYPE_SELECT} from '../constants';
import {ROLE} from '@/constants';
import {AuthProps} from '../utils/auth-helper';

export type QueryProps<T extends Entity> = {
  where?: WhereOptions<T> | null;
  take?: number;
  // orderBy?: OrderByArg<T>;
  orderBy?: any;
  skip?: number;
};

export function getProjectAccessFilter(props: AuthProps) {
  const {userId, isContact, workspaceId} = props;
  const where: WhereOptions<AOSProject> = {
    isBusinessProject: true,
    projectStatus: {isCompleted: false},
    portalWorkspace: {id: workspaceId},
    ...(isContact
      ? {clientPartner: {contactPartnerSet: {id: userId}}}
      : {clientPartner: {id: userId}}),
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

export function getRestrictedTicketAccessFilter(props: AuthProps) {
  const where: WhereOptions<AOSProjectTask> = {
    OR: [
      {createdByContact: {id: props.userId}},
      {managedByContact: {id: props.userId}},
    ],
  };
  return where;
}

export function withTicketAccessFilter(props: AuthProps) {
  const {isContact, role} = props;
  const isRestricted = isContact && role != ROLE.TOTAL;
  return function (where: WhereOptions<AOSProjectTask>) {
    if (isRestricted) {
      return {
        AND: [
          where,
          getTicketAccessFilter(),
          getRestrictedTicketAccessFilter(props),
        ],
      };
    }
    return {AND: [where, getTicketAccessFilter()]};
  };
}
