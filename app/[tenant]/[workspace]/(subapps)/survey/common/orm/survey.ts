// ---- CORE IMPORTS ---- //
import {clone, getPageInfo, getSkipInfo} from '@/utils';
import {manager, type Tenant} from '@/tenant';
import {PortalWorkspace} from '@/types';
import {getSession} from '@/auth';
import {DEFAULT_PAGE} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import {SURVEY_STATUS, SURVEY_TYPE} from '@/subapps/survey/common/constants';

export async function findSurveys({
  workspace,
  tenantId,
  limit,
  page = DEFAULT_PAGE,
}: {
  workspace: PortalWorkspace;
  tenantId: Tenant['id'];
  limit?: number;
  page?: string | number;
}) {
  if (!(workspace && tenantId)) return [];
  const client = await manager.getClient(tenantId);

  const skip = getSkipInfo(limit, page);

  const surveys = await client.aOSSurveyConfig
    .find({
      where: {
        typeSelect: SURVEY_TYPE.PUBLIC,
        statusSelect: SURVEY_STATUS.PUBLISHED,
      },
      take: limit,
      ...(skip ? {skip} : {}),
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

  const pageInfo = getPageInfo({
    count: surveys?.[0]?._count,
    page,
    limit,
  });

  return {surveys, pageInfo};
}

export async function findMetaModelRecords({
  workspace,
  tenantId,
  limit,
  page = DEFAULT_PAGE,
}: {
  workspace: PortalWorkspace;
  tenantId: Tenant['id'];
  limit?: number;
  page?: string | number;
}) {
  if (!(workspace && tenantId)) return [];

  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return [];
  }
  const client = await manager.getClient(tenantId);
  const skip = getSkipInfo(limit, page);
  const responses = await client.aOSMetaJsonModel
    .find({
      where: {
        AND: [
          {attrs: {path: 'partner.id', eq: user.id}},
          {attrs: {path: 'surveyConfig', ne: null}},
        ],
      },
      take: limit,
      ...(skip ? {skip} : {}),
      select: {
        attrs: true,
      },
    })
    .catch((error: any) => console.log('error >>>', error));
  const pageInfo = getPageInfo({
    count: responses?.[0]?._count,
    page,
    limit,
  });
  return {responses, pageInfo};
}
