// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';
import {manager, type Tenant} from '@/tenant';
import {PortalWorkspace} from '@/types';
import {getSession} from '@/auth';

// ---- LOCAL IMPORTS ---- //
import {SURVEY_STATUS, SURVEY_TYPE} from '@/subapps/survey/common/constants';

export async function findSurveys({
  workspace,
  tenantId,
  limit,
}: {
  workspace: PortalWorkspace;
  tenantId: Tenant['id'];
  limit?: number;
}) {
  if (!(workspace && tenantId)) return [];
  const client = await manager.getClient(tenantId);

  const surveys = await client.aOSSurveyConfig
    .find({
      where: {
        typeSelect: SURVEY_TYPE.PUBLIC,
        statusSelect: SURVEY_STATUS.PUBLISHED,
      },
      take: limit,
      select: {
        name: true,
        statusSelect: true,
        typeSelect: true,
        category: {
          name: true,
        },
        target: {
          name: true,
        },
        publicationDatetime: true,
      },
    })
    .then(clone)
    .catch((error: any) => console.log('error >>>', error));

  return surveys;
}

export async function findMetaModelRecords({
  workspace,
  tenantId,
  limit,
}: {
  workspace: PortalWorkspace;
  tenantId: Tenant['id'];
  limit?: number;
}) {
  if (!(workspace && tenantId)) return [];

  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return [];
  }
  const client = await manager.getClient(tenantId);

  const responses = await client.aOSMetaJsonModel
    .find({
      where: {
        AND: [
          {attrs: {path: 'partner.id', eq: user.id}},
          {attrs: {path: 'surveyConfig', ne: null}},
        ],
      },
      take: limit,
      select: {
        attrs: true,
      },
    })
    .catch((error: any) => console.log('error >>>', error));
  return responses;
}
