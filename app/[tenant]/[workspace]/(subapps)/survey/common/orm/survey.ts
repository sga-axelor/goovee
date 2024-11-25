// ---- CORE IMPORTS ---- //
import {clone, getPageInfo, getSkipInfo} from '@/utils';
import {manager, type Tenant} from '@/tenant';
import {PortalWorkspace} from '@/types';
import {getSession} from '@/auth';
import {DEFAULT_PAGE} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import {SURVEY_STATUS, SURVEY_TYPE} from '@/subapps/survey/common/constants';
import {Response, Survey} from '@/subapps/survey/common/types';

export async function findSurveys({
  workspace,
  tenantId,
  limit,
  page = DEFAULT_PAGE,
  search,
}: {
  workspace: PortalWorkspace;
  tenantId: Tenant['id'];
  limit?: number;
  page?: string | number;
  search?: string;
}) {
  if (!(workspace && tenantId)) return [];
  const client = await manager.getClient(tenantId);

  const skip = getSkipInfo(limit, page);

  const surveys = await client.aOSSurveyConfig
    .find({
      where: {
        typeSelect: SURVEY_TYPE.PUBLIC,
        statusSelect: SURVEY_STATUS.PUBLISHED,
        ...(search
          ? {
              name: {
                like: `%${search}%`,
              },
            }
          : {}),
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
  search,
}: {
  workspace: PortalWorkspace;
  tenantId: Tenant['id'];
  limit?: number;
  page?: string | number;
  search?: string;
}) {
  if (!(workspace && tenantId)) return [];

  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return [];
  }
  const client = await manager.getClient(tenantId);
  const skip = getSkipInfo(limit, page);
  const responses: any = await client.aOSMetaJsonRecord
    .find({
      where: {
        AND: [
          {attrs: {path: 'partner.id', eq: user.id}},
          {attrs: {path: 'surveyConfig', ne: null}},
        ],
        ...(search
          ? {attrs: {path: 'surveyConfig.name', like: `%${search}%`}}
          : {}),
      },
      take: limit,
      ...(skip ? {skip} : {}),
      select: {
        attrs: true,
      },
    })
    .catch((error: any) => console.log('error >>>', error));

  const enrichedResponses = await Promise.all(
    responses.map(async (response: any) => ({
      ...response,
      attrs: await response.attrs,
    })),
  );

  const finalResponses = await Promise.all(
    enrichedResponses.map(async response => ({
      ...response,
      attrs: {
        ...response.attrs,
        surveyConfig: await findSurveyById({
          workspace,
          tenantId,
          id: response.attrs.surveyConfig.id,
        }),
      },
    })),
  );

  const pageInfo = getPageInfo({
    count: responses?.[0]?._count,
    page,
    limit,
  });

  return {responses: finalResponses, pageInfo};
}

export async function findSurveyById({
  workspace,
  tenantId,
  id,
}: {
  workspace: PortalWorkspace;
  tenantId: Tenant['id'];
  id: Survey['id'];
}) {
  if (!(workspace && tenantId)) return [];

  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return [];
  }
  const client = await manager.getClient(tenantId);
  const survey = await client.aOSSurveyConfig
    .findOne({
      where: {
        id,
      },
      select: {
        name: true,
        statusSelect: true,
        typeSelect: true,
        category: {
          name: true,
        },
        canAnswerBeModified: true,
        publicationDatetime: true,
        config: true,
        themeConfig: true,
      },
    })
    .then(async res => ({
      ...res,
      config: await res?.config,
      themeConfig: await res?.themeConfig,
    }))
    .then(clone)
    .catch((error: any) => console.log('error >>>', error));

  return survey;
}

export async function findMetaModelRecordById({
  workspace,
  tenantId,
  id,
}: {
  workspace: PortalWorkspace;
  tenantId: Tenant['id'];
  id: Response['id'];
}) {
  if (!(workspace && tenantId)) return [];

  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return [];
  }
  const client = await manager.getClient(tenantId);
  const response = await client.aOSMetaJsonRecord.findOne({
    where: {id},
    select: {
      attrs: true,
    },
  });

  const enrichedResponse = {...response, attrs: await response?.attrs};

  const finalResponse = {
    ...response,
    attrs: {
      ...enrichedResponse.attrs,
      surveyConfig: await findSurveyById({
        workspace,
        tenantId,
        id: (enrichedResponse.attrs?.surveyConfig as any)?.id,
      }),
    },
  };

  return finalResponse as any;
}
