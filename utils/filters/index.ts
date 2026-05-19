// ---- CORE IMPORTS ---- //
import {ROLE} from '@/constants';
import {EntityWhereClause, PartnerKey, User} from '@/types';

export function getWhereClauseForEntity({
  user,
  role,
  isContactAdmin,
  partnerKey = PartnerKey.CLIENT_PARTNER,
}: {
  user: User;
  role: any;
  isContactAdmin?: boolean;
  partnerKey?: PartnerKey;
}): EntityWhereClause {
  if (!user) return {};

  const {id, mainPartnerId, isContact} = user;
  const partnerId = isContact ? mainPartnerId : id;

  if (!partnerId) return {};

  const where: EntityWhereClause =
    partnerKey === PartnerKey.CLIENT_PARTNER
      ? {clientPartner: {id: partnerId}}
      : {partner: {id: partnerId}};

  if (isContact) where.contactPartner = {id};

  if (isContactAdmin || role === ROLE.TOTAL) delete where.contactPartner;

  return where;
}
